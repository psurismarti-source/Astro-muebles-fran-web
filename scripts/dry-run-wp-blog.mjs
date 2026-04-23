/**
 * dry-run-wp-blog.mjs
 * Analiza qué se migraría de mueblesfran.barcelona (WordPress) a Sanity,
 * sin escribir nada. Genera un reporte JSON con:
 *   - Total de posts en WP
 *   - Lista de slugs
 *   - Conflictos con noticias ya existentes en Sanity
 *   - Tamaño estimado de imágenes
 *   - Posts con contenido "raro" (shortcodes, tablas, etc.)
 *
 * Uso:
 *   SANITY_TOKEN=tu_token node scripts/dry-run-wp-blog.mjs
 *
 * Salida: scripts/reports/dry-run-wp-blog.json
 */

import { createClient } from '@sanity/client';
import fs from 'node:fs/promises';
import path from 'node:path';

const WP_BASE = 'https://mueblesfran.barcelona/wp-json/wp/v2';
const REPORT_PATH = path.resolve('scripts/reports/dry-run-wp-blog.json');

const sanity = createClient({
  projectId: '0g6vki0n',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

if (!process.env.SANITY_TOKEN) {
  console.error('❌ Falta SANITY_TOKEN en el entorno.');
  console.error('   https://www.sanity.io/manage/project/0g6vki0n → API → Tokens');
  process.exit(1);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

async function fetchAllWpPosts() {
  const all = [];
  let page = 1;
  while (true) {
    const url = `${WP_BASE}/posts?per_page=100&page=${page}&_fields=id,slug,title,date,modified,excerpt,featured_media,categories`;
    const res = await fetch(url);
    if (res.status === 400) break; // Fin de paginación (rest_post_invalid_page_number)
    if (!res.ok) throw new Error(`WP API error on page ${page}: ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) break;
    all.push(...data);
    console.log(`   · página ${page}: ${data.length} posts (acumulado: ${all.length})`);
    page++;
  }
  return all;
}

async function fetchWpMedia(mediaId) {
  if (!mediaId) return null;
  try {
    const res = await fetch(`${WP_BASE}/media/${mediaId}?_fields=source_url,alt_text,media_details`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchExistingSanityNoticias() {
  return await sanity.fetch(`*[_type == "noticia"]{ _id, "slug": slug.current, titulo }`);
}

function decodeEntities(str) {
  return String(str)
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&aacute;/g, 'á')
    .replace(/&eacute;/g, 'é')
    .replace(/&iacute;/g, 'í')
    .replace(/&oacute;/g, 'ó')
    .replace(/&uacute;/g, 'ú')
    .replace(/&ntilde;/g, 'ñ')
    .replace(/&Aacute;/g, 'Á')
    .replace(/&Eacute;/g, 'É')
    .replace(/&Iacute;/g, 'Í')
    .replace(/&Oacute;/g, 'Ó')
    .replace(/&Uacute;/g, 'Ú')
    .replace(/&Ntilde;/g, 'Ñ');
}

function hasWeirdMarkup(html) {
  const suspects = [
    /\[[a-z_-]+[^\]]*\]/i,        // shortcodes [something]
    /<table[^>]*>/i,              // tablas
    /<iframe[^>]*>/i,              // iframes
    /<script[^>]*>/i,              // scripts
    /wp:(image|embed|gallery)/i,   // bloques gutenberg raros
  ];
  return suspects.some((r) => r.test(html));
}

function countInlineImages(html) {
  const matches = html.match(/<img[^>]+src="[^"]+"/gi) || [];
  return matches.length;
}

// ── Main ─────────────────────────────────────────────────────────────────────

console.log('🔎 Dry run: análisis de migración blog WP → Sanity\n');

console.log('1. Fetch posts WordPress…');
const wpPosts = await fetchAllWpPosts();
console.log(`   ✓ Total: ${wpPosts.length} posts\n`);

console.log('2. Fetch noticias existentes en Sanity…');
const sanityNoticias = await fetchExistingSanityNoticias();
const existingSlugs = new Set(sanityNoticias.map((n) => n.slug));
console.log(`   ✓ Ya en Sanity: ${sanityNoticias.length} noticias\n`);

console.log('3. Análisis post a post (puede tardar por las peticiones de media)…');
const report = {
  generatedAt: new Date().toISOString(),
  wpTotal: wpPosts.length,
  sanityExisting: sanityNoticias.length,
  summary: {
    toCreate: 0,
    slugConflicts: 0,
    missingFeaturedMedia: 0,
    hasWeirdMarkup: 0,
    totalInlineImages: 0,
  },
  posts: [],
};

for (let i = 0; i < wpPosts.length; i++) {
  const p = wpPosts[i];
  if (i % 25 === 0) console.log(`   · procesando ${i + 1}/${wpPosts.length}…`);

  const title = decodeEntities(p.title.rendered);
  const html = p.content?.rendered ?? '';
  const weird = hasWeirdMarkup(html);
  const inlineImgs = countInlineImages(html);

  let media = null;
  if (p.featured_media) {
    media = await fetchWpMedia(p.featured_media);
  }

  const entry = {
    id: p.id,
    slug: p.slug,
    title,
    date: p.date,
    featuredImage: media?.source_url ?? null,
    featuredImageBytes: media?.media_details?.filesize ?? null,
    inlineImages: inlineImgs,
    hasWeirdMarkup: weird,
    slugConflict: existingSlugs.has(p.slug),
  };
  report.posts.push(entry);

  if (entry.slugConflict) report.summary.slugConflicts++;
  else report.summary.toCreate++;
  if (!entry.featuredImage) report.summary.missingFeaturedMedia++;
  if (weird) report.summary.hasWeirdMarkup++;
  report.summary.totalInlineImages += inlineImgs;
}

await fs.mkdir(path.dirname(REPORT_PATH), { recursive: true });
await fs.writeFile(REPORT_PATH, JSON.stringify(report, null, 2), 'utf8');

console.log('\n📊 Resumen:');
console.log(`   · Posts en WP:                    ${report.wpTotal}`);
console.log(`   · Noticias ya en Sanity:          ${report.sanityExisting}`);
console.log(`   · Se crearán como nuevos:         ${report.summary.toCreate}`);
console.log(`   · Conflictos de slug (se saltan): ${report.summary.slugConflicts}`);
console.log(`   · Sin imagen destacada:           ${report.summary.missingFeaturedMedia}`);
console.log(`   · Con HTML "raro":                ${report.summary.hasWeirdMarkup}`);
console.log(`   · Imágenes inline totales:        ${report.summary.totalInlineImages}`);
console.log(`\n📄 Reporte completo: ${REPORT_PATH}`);
