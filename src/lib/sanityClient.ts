import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID ?? '0g6vki0n',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: import.meta.env.PUBLIC_SANITY_API_VERSION ?? '2024-01-01',
  useCdn: true,
});

// ─── HELPER: atributo data-sanity para edición visual ─────────────────────────
export function ds(documentId: string, path: string) {
  return `${documentId};${path}`;
}

// ─── QUERIES ──────────────────────────────────────────────────────────────────

/** Página de Inicio (singleton) */
export const QUERY_PAGINA_INICIO = `
  *[_type == "paginaInicio" && _id == "pagina-inicio-singleton"][0] {
    _id,
    heroBadge, heroTitulo, heroSubtitulo, heroCta,
    productosTitulo, productosSubtitulo,
    ventajasTitulo, ventajasSubtitulo,
    ventajas[] { _key, icono, titulo, descripcion },
    blogTitulo, blogSubtitulo
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
