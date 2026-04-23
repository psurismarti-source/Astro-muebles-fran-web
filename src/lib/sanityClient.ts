import { createClient } from '@sanity/client';
import { createDataAttribute } from '@sanity/visual-editing/create-data-attribute';

export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID ?? '0g6vki0n',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: import.meta.env.PUBLIC_SANITY_API_VERSION ?? '2024-01-01',
  useCdn: false,
});

// ─── HELPER: atributo data-sanity para edición visual ─────────────────────────
export function ds(id: string | undefined, type: string, path: string): string | undefined {
  if (!id) return undefined;
  return createDataAttribute({
    baseUrl: 'https://mueblesfran.sanity.studio',
    projectId: '0g6vki0n',
    dataset: 'production',
    id,
    type,
    path,
  }).toString();
}

// ─── HELPERS de teléfono ──────────────────────────────────────────────────────
/**
 * Normaliza un teléfono ES: quita espacios, '+', y el prefijo 34 si viene ya.
 * Devuelve los 9 dígitos del número nacional. Útil para construir wa.me y tel:
 */
export function cleanPhoneES(raw: string | undefined): string {
  if (!raw) return '';
  return String(raw).replace(/[\s+]/g, '').replace(/^34/, '');
}

/** Devuelve la URL de wa.me limpia: wa.me/34XXXXXXXXX */
export function whatsappUrl(raw: string | undefined): string {
  return `https://wa.me/34${cleanPhoneES(raw)}`;
}

/** Devuelve la URL tel: con prefijo: tel:+34XXXXXXXXX */
export function telUrl(raw: string | undefined): string {
  return `tel:+34${cleanPhoneES(raw)}`;
}

/**
 * Formatea un teléfono ES para mostrar: "+34 644 48 45 63"
 * Si el número no tiene 9 dígitos, devuelve lo que sea pasado tal cual.
 */
export function formatPhoneES(raw: string | undefined): string {
  const clean = cleanPhoneES(raw);
  if (clean.length !== 9) return raw ?? '';
  return `+34 ${clean.slice(0, 3)} ${clean.slice(3, 5)} ${clean.slice(5, 7)} ${clean.slice(7, 9)}`;
}

// ─── QUERIES ──────────────────────────────────────────────────────────────────

/** Página de Inicio (singleton) */
export const QUERY_PAGINA_INICIO = `
  *[_type == "paginaInicio" && _id == "pagina-inicio-singleton"][0] {
    _id,
    heroBadge, heroTitulo, heroSubtitulo, heroCta,
    heroMetaTags,
    heroCtaLlamar, heroCtaComoLlegar, heroCtaWhatsapp,
    trustItems[] { _key, numero, titulo, descripcion },
    productosTitulo, productosSubtitulo,
    ventajasTitulo, ventajasSubtitulo,
    ventajas[] { _key, icono, titulo, descripcion },
    resenasTitulo, resenasSubtitulo, resenasEmbed,
    blogTitulo, blogSubtitulo,
    parkingTitulo, parkingDescripcion, parkingCta,
    contactoTitulo, contactoSubtitulo
  }
`;

/** Página Nosotros (singleton) */
export const QUERY_PAGINA_NOSOTROS = `
  *[_type == "paginaNosotros" && _id == "pagina-nosotros-singleton"][0] {
    _id,
    heroTag, heroTitulo, heroSubtitulo,
    historiaTag, historiaTitulo, historiaParrafo1, historiaParrafo2,
    compromisoTag, compromisoTitulo, compromisoParrafo1, compromisoParrafo2,
    ctaTitulo, ctaSubtitulo
  }
`;

/** Configuración general de la empresa */
export const QUERY_CONFIG = `
  *[_type == "configuracion" && _id == "configuracion-singleton"][0] {
    _id,
    nombreEmpresa, telefono, whatsapp, email, direccion, horario,
    logo { asset->{ url } }
  }
`;

/** Todas las noticias */
export const QUERY_NOTICIAS = `
  *[_type == "noticia"] | order(fecha desc) {
    _id, titulo, "slug": slug.current, fecha, resumen,
    imagen { asset->{ url } }
  }
`;

/** Últimas N noticias */
export const QUERY_NOTICIAS_RECIENTES = (n = 3) => `
  *[_type == "noticia"] | order(fecha desc)[0...${n}] {
    _id, titulo, "slug": slug.current, fecha, resumen,
    imagen { asset->{ url } }
  }
`;

/** Página de categoría por slug (= galeriaFolder) */
export const QUERY_PAGINA_CATEGORIA = `
  *[_type == "paginaCategoria" && slug.current == $slug][0] {
    _id, titulo, tag, subtitulo, caracteristicas, metaDescripcion,
    "parrafos": descripcion[_type == "block"][]{
      "texto": pt::text(@)
    },
    imagenPrincipal { asset->{ url }, alt },
    galeriaExtra[] { asset->{ url }, alt }
  }
`;

/** Una noticia por slug */
export const QUERY_NOTICIA_BY_SLUG = `
  *[_type == "noticia" && slug.current == $slug][0] {
    _id, titulo, "slug": slug.current, fecha, resumen, contenido,
    imagen { asset->{ url } }
  }
`;

/** Slugs de noticias */
export const QUERY_NOTICIAS_SLUGS = `
  *[_type == "noticia"] { "slug": slug.current }
`;
