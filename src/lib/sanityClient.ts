import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: import.meta.env.PUBLIC_SANITY_API_VERSION ?? '2024-01-01',
  useCdn: true, // true en producción para máxima velocidad
});

// ─── QUERIES ──────────────────────────────────────────────────────────────────

/** Todas las noticias ordenadas por fecha (para el listado) */
export const QUERY_NOTICIAS = `
  *[_type == "noticia"] | order(fecha desc) {
    _id,
    titulo,
    "slug": slug.current,
    fecha,
    resumen,
    imagen { asset->{ url } }
  }
`;

/** Las últimas N noticias (para el bloque del inicio) */
export const QUERY_NOTICIAS_RECIENTES = (n = 3) => `
  *[_type == "noticia"] | order(fecha desc)[0...${n}] {
    _id,
    titulo,
    "slug": slug.current,
    fecha,
    resumen,
    imagen { asset->{ url } }
  }
`;

/** Una noticia por slug (para el detalle) */
export const QUERY_NOTICIA_BY_SLUG = `
  *[_type == "noticia" && slug.current == $slug][0] {
    _id,
    titulo,
    "slug": slug.current,
    fecha,
    resumen,
    contenido,
    imagen { asset->{ url } }
  }
`;

/** Todos los slugs de noticias (para getStaticPaths) */
export const QUERY_NOTICIAS_SLUGS = `
  *[_type == "noticia"] { "slug": slug.current }
`;

/** Configuración general de la empresa */
export const QUERY_CONFIG = `
  *[_type == "configuracion"][0] {
    nombreEmpresa,
    telefono,
    whatsapp,
    email,
    direccion,
    horario,
    logo { asset->{ url } }
  }
`;
