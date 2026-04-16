import { createClient } from '@sanity/client';
import { createDataAttribute } from '@sanity/visual-editing/create-data-attribute';

export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID ?? '0g6vki0n',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: import.meta.env.PUBLIC_SANITY_API_VERSION ?? '2024-01-01',
  useCdn: true,
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

/** Página de categoría por slug (= galeriaFolder) */
export const QUERY_PAGINA_CATEGORIA = `
  *[_type == "paginaCategoria" && slug.current == $slug][0] {
    _id, titulo, tag, subtitulo, caracteristicas, metaDescripcion,
    "parrafos": descripcion[_type == "block"][]{
      "texto": string::join(children[].text, "")
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
