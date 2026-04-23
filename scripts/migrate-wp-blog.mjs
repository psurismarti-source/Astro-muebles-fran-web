/**
 * migrate-wp-blog.mjs
 * Migra los posts de mueblesfran.barcelona (WordPress) al CMS Sanity
 * como documentos tipo "noticia".
 *
 * Qué hace por cada post:
 *   1. Descarga la imagen destacada y la sube a Sanity como asset.
 *   2. Descarga las imágenes inline del contenido y las sube a Sanity.
 *   3. Convierte el HTML del post a Portable Text (respeta títulos, negritas,
 *      cursivas, listas, enlaces e imágenes).
 *   4. Crea o actualiza el documento noticia con un _id determinista
 *      ("noticia-wp-{id}"), de forma que re-correr el script es idempotente.
 *
 * Uso:
 *   SANITY_TOKEN=tu_token_editor node scripts/migrate-wp-blog.mjs
 *
 * Flags:
 *   --limit=10        Migra solo los 10 primeros posts (útil para probar).
 *   --only=11902      Migra solo el post con ese ID de WP.
 *   --force           Sobrescribe documentos existentes en Sanity.
 *
 * Ejemplo de prueba con 3 posts:
 *   SANITY_TOKEN=xxx node scripts/migrate-wp-blog.mjs --limit=3
 */

import { createClient } from '@sanity/client';
import { htmlToBlocks } from '@sanity/block-tools';
import { Schema } from '@sanity/schema';
import { JSDOM } from 'jsdom';
import fs from 'node:fs/promises';
import path from 'node:path';

// ── Config ───────────────────────────────────────────────────────────────────

const WP_BASE = 'https://mueblesfran.barcelona/wp-json/wp/v2';
const LOG_PATH = path.resolve('scripts/reports/migrate-wp-blog.log.json');

const args = process.argv.slice(2);
const flag = (name) => {
  const f = args.find((a) => a.startsWith(`--${name}`));
  if (!f) return null;
  const [, v] = f.split('=');
  return v ?? true;
};
const LIMIT = Number(flag('limit')) || null;
const ONLY_ID = flag('only') ? Number(flag('only')) : null;
const FORCE = !!flag('force');

if (!process.env.SANITY_TOKEN) {
  console.error('❌ Falta SANITY_TOKEN en el entorno.');
  console.error('   https://www.sanity.io/manage/project/0g6vki0n → API → Tokens → Editor');
  process.exit(1);
}

const sanity = createClient({
  projectId: '0g6vki0n',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

// ── Esquema de bloques para block-tools ──────────────────────────────────────
// block-tools necesita el schema COMPILADO (no un objeto plano). Así que
// declaramos el type 'noticia' con la misma estructura que sanity/schemas/noticia.ts
// y lo compilamos con @sanity/schema. Luego extraemos el type del field 'contenido'.

const compiledSchema = Schema.compile({
  name: 'default',
  types: [
    {
      type: 'object',
      name: 'noticia',
      fields: [
        {
          name: 'contenido',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'H2', value: 'h2' },
                { title: 'H3', value: 'h3' },
                { title: 'Cita', value: 'blockquote' },
              ],
              lists: [
                { title: 'Lista', value: 'bullet' },
                { title: 'Numerada', value: 'number' },
              ],
              marks: {
                decorators: [
                  { title: 'Negrita', value: 'strong' },
                  { title: 'Cursiva', value: 'em' },
                ],
                annotations: [
                  {
                    name: 'link',
                    type: 'object',
                    fields: [{ name: 'href', type: 'url' }],
                  },
                ],
              },
            },
            { type: 'image', fields: [{ name: 'alt', type: 'string' }] },
          ],
        },
      ],
    },
  ],
});

const blockContentType = compiledSchema
  .get('noticia')
  .fields.find((f) => f.name === 'contenido').type;

// ── Helpers ──────────────────────────────────────────────────────────────────

async function fetchAllWpPosts() {
  const all = [];
  let page = 1;
  while (true) {
    const url = `${WP_BASE}/posts?per_page=100&page=${page}&_fields=id,slug,title,date,modified,excerpt,content,featured_media`;
    const res = await fetch(url);
    if (res.status === 400) break;
    if (!res.ok) throw new Error(`WP API error on page ${page}: ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) break;
    all.push(...data);
    page++;
  }
  return all;
}

async function fetchWpMediaUrl(mediaId) {
  if (!mediaId) return null;
  try {
    const res = await fetch(`${WP_BASE}/media/${mediaId}?_fields=source_url,alt_text`);
    if (!res.ok) return null;
    const json = await res.json();
    return { url: json.source_url, alt: json.alt_text ?? '' };
  } catch {
    return null;
  }
}

function decodeEntities(str) {
  return String(str)
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '…')
    .replace(/&aacute;/g, 'á').replace(/&eacute;/g, 'é')
    .replace(/&iacute;/g, 'í').replace(/&oacute;/g, 'ó')
    .replace(/&uacute;/g, 'ú').replace(/&ntilde;/g, 'ñ')
    .replace(/&Aacute;/g, 'Á').replace(/&Eacute;/g, 'É')
    .replace(/&Iacute;/g, 'Í').replace(/&Oacute;/g, 'Ó')
    .replace(/&Uacute;/g, 'Ú').replace(/&Ntilde;/g, 'Ñ');
}

function stripHtmlAndTrim(html, max = 200) {
  const text = decodeEntities(
    String(html)
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  );
  if (text.length <= max) return text;
  return text.slice(0, max - 1).replace(/\s\S*$/, '') + '…';
}

async function uploadImageToSanity(imageUrl, label = 'imagen') {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) {
      console.warn(`   ⚠ No se pudo descargar ${label}: ${imageUrl} (HTTP ${res.status})`);
      return null;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const filename = imageUrl.split('/').pop().split('?')[0] || 'imagen.jpg';
    const asset = await sanity.assets.upload('image', buf, { filename });
    return asset._id;
  } catch (e) {
    console.warn(`   ⚠ Error subiendo ${label} (${imageUrl}):`, e.message);
    return null;
  }
}

/**
 * Encuentra las URLs de imágenes dentro del HTML, las sube a Sanity y devuelve
 * un mapa { urlOriginal -> sanityAssetId }. También devuelve el HTML con las
 * imágenes ya reemplazadas por marcadores que block-tools sabrá convertir.
 */
async function uploadInlineImagesAndRewriteHtml(html) {
  const dom = new JSDOM(html);
  const imgs = [...dom.window.document.querySelectorAll('img')];
  const replacements = {};
  for (const img of imgs) {
    const url = img.getAttribute('src');
    if (!url || replacements[url]) continue;
    const alt = img.getAttribute('alt') ?? '';
    const assetId = await uploadImageToSanity(url, 'inline');
    if (assetId) {
      replacements[url] = { assetId, alt };
    }
  }
  // block-tools no tiene un handler out-of-the-box para imágenes, así que las
  // separamos del bloque rico: las dejamos como <img> y luego las procesaremos
  // nosotros insertando bloques de tipo `image` en el array final.
  return { replacements, dom };
}

function htmlBlocksFromDom(dom) {
  const body = dom.window.document.body;
  const blocks = htmlToBlocks(body.innerHTML, blockContentType, {
    parseHtml: (h) => new JSDOM(h).window.document,
  });
  return blocks;
}

/**
 * Toma el DOM del post y devuelve un array Portable Text con bloques de texto
 * e imágenes intercalados en el orden correcto.
 */
function buildPortableText(dom, inlineImageReplacements) {
  const body = dom.window.document.body;
  const out = [];
  const chunk = []; // acumulamos HTML hasta encontrar un <img>, entonces lo convertimos

  const flush = () => {
    if (chunk.length === 0) return;
    const html = chunk.join('');
    chunk.length = 0;
    const blocks = htmlToBlocks(html, blockContentType, {
      parseHtml: (h) => new JSDOM(h).window.document,
    });
    out.push(...blocks);
  };

  const walk = (node) => {
    if (node.nodeType === 1 && node.tagName === 'IMG') {
      // Antes de insertar la imagen, volcamos el texto acumulado
      flush();
      const src = node.getAttribute('src');
      const alt = node.getAttribute('alt') ?? '';
      const repl = inlineImageReplacements[src];
      if (repl?.assetId) {
        out.push({
          _type: 'image',
          _key: `img-${out.length}`,
          asset: { _type: 'reference', _ref: repl.assetId },
          alt,
        });
      }
      return;
    }
    if (node.nodeType === 1 && node.childNodes && node.childNodes.length > 0) {
      // Si el nodo contiene un <img> en profundidad, recorremos hijos uno a uno
      const hasImg = !!node.querySelector('img');
      if (hasImg) {
        // Recorremos hijos directamente (el wrapper se pierde, lo cual suele estar bien)
        [...node.childNodes].forEach(walk);
        return;
      }
    }
    // Nodo normal: serialízalo como HTML y agrégalo al chunk
    if (node.outerHTML) chunk.push(node.outerHTML);
    else if (node.textContent) chunk.push(node.textContent);
  };

  [...body.childNodes].forEach(walk);
  flush();
  return out.filter(Boolean);
}

// ── Main ─────────────────────────────────────────────────────────────────────

console.log('🚚 Migración blog WP → Sanity\n');
if (LIMIT) console.log(`   · Flag --limit: solo ${LIMIT} posts`);
if (ONLY_ID) console.log(`   · Flag --only: solo post ID ${ONLY_ID}`);
if (FORCE) console.log(`   · Flag --force: sobrescribe existentes`);
console.log('');

console.log('1. Fetch posts WordPress…');
let wpPosts = await fetchAllWpPosts();
if (ONLY_ID) wpPosts = wpPosts.filter((p) => p.id === ONLY_ID);
if (LIMIT) wpPosts = wpPosts.slice(0, LIMIT);
console.log(`   ✓ ${wpPosts.length} posts a procesar\n`);

const log = { startedAt: new Date().toISOString(), created: [], updated: [], skipped: [], errors: [] };

for (let i = 0; i < wpPosts.length; i++) {
  const p = wpPosts[i];
  const docId = `noticia-wp-${p.id}`;
  const title = decodeEntities(p.title.rendered);
  console.log(`[${i + 1}/${wpPosts.length}] #${p.id} — ${title.slice(0, 60)}`);

  try {
    // ¿Existe ya?
    const existing = await sanity.fetch('*[_id == $id][0]{ _id }', { id: docId });
    if (existing && !FORCE) {
      console.log(`   ↪ existe, salto (usa --force para sobrescribir)`);
      log.skipped.push({ id: p.id, slug: p.slug, reason: 'ya_existe' });
      continue;
    }

    // Imagen destacada
    let imagenField = null;
    if (p.featured_media) {
      const media = await fetchWpMediaUrl(p.featured_media);
      if (media?.url) {
        console.log(`   · subiendo imagen destacada…`);
        const assetId = await uploadImageToSanity(media.url, 'featured');
        if (assetId) {
          imagenField = {
            _type: 'image',
            asset: { _type: 'reference', _ref: assetId },
            alt: media.alt || title,
          };
        }
      }
    }

    // Imágenes inline
    const html = p.content?.rendered ?? '';
    console.log(`   · procesando contenido…`);
    const { replacements, dom } = await uploadInlineImagesAndRewriteHtml(html);
    const inlineCount = Object.keys(replacements).length;
    if (inlineCount > 0) console.log(`   · ${inlineCount} imágenes inline subidas`);

    // HTML → Portable Text
    const contenido = buildPortableText(dom, replacements);

    // Doc final
    const doc = {
      _id: docId,
      _type: 'noticia',
      titulo: title,
      slug: { _type: 'slug', current: p.slug },
      fecha: p.date ? new Date(p.date).toISOString() : new Date().toISOString(),
      resumen: stripHtmlAndTrim(p.excerpt?.rendered ?? '', 200),
      contenido,
      ...(imagenField ? { imagen: imagenField } : {}),
    };

    await sanity.createOrReplace(doc);
    console.log(`   ✓ ${existing ? 'actualizado' : 'creado'}`);
    (existing ? log.updated : log.created).push({ id: p.id, slug: p.slug });
  } catch (e) {
    console.error(`   ✖ error:`, e.message);
    log.errors.push({ id: p.id, slug: p.slug, error: e.message });
  }
}

log.finishedAt = new Date().toISOString();
await fs.mkdir(path.dirname(LOG_PATH), { recursive: true });
await fs.writeFile(LOG_PATH, JSON.stringify(log, null, 2), 'utf8');

console.log('\n📊 Resumen:');
console.log(`   ✓ Creados:     ${log.created.length}`);
console.log(`   ↻ Actualizados: ${log.updated.length}`);
console.log(`   ↪ Saltados:    ${log.skipped.length}`);
console.log(`   ✖ Errores:     ${log.errors.length}`);
console.log(`\n📄 Log completo: ${LOG_PATH}`);
