import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { presentationTool } from 'sanity/presentation';

import noticia from './schemas/noticia';
import configuracion from './schemas/configuracion';
import paginaCategoria from './schemas/paginaCategoria';
import paginaInicio from './schemas/paginaInicio';
import paginaNosotros from './schemas/paginaNosotros';

export default defineConfig({
  name: 'muebles-fran',
  title: 'Muebles Fran — Panel de contenido',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? '0g6vki0n',
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenido')
          .items([
            // Singletons
            S.listItem()
              .title('⚙️  Datos de la Empresa')
              .id('configuracion')
              .child(
                S.document()
                  .schemaType('configuracion')
                  .documentId('configuracion-singleton')
              ),
            S.listItem()
              .title('🏠  Página de Inicio')
              .id('paginaInicio')
              .child(
                S.document()
                  .schemaType('paginaInicio')
                  .documentId('pagina-inicio-singleton')
              ),
            S.listItem()
              .title('👥  Página Nosotros')
              .id('paginaNosotros')
              .child(
                S.document()
                  .schemaType('paginaNosotros')
                  .documentId('pagina-nosotros-singleton')
              ),
            S.divider(),
            S.documentTypeListItem('noticia').title('📰  Novedades / Blog'),
            S.divider(),
            S.documentTypeListItem('paginaCategoria').title('🪑  Páginas de Categoría'),
          ]),
    }),

    presentationTool({
      previewUrl: {
        origin: 'https://astro-muebles-fran-web.vercel.app',
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
      name: 'presentation',
      title: '🌐 Vista previa web',
    }),

    visionTool(),
  ],

  schema: {
    types: [noticia, configuracion, paginaCategoria, paginaInicio, paginaNosotros],
  },
});
