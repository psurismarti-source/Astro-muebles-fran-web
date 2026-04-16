import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';

import noticia from './schemas/noticia';
import configuracion from './schemas/configuracion';
import paginaCategoria from './schemas/paginaCategoria';

export default defineConfig({
  name: 'muebles-fran',
  title: 'Muebles Fran — Panel de contenido',

  // ⚠️ Rellena estos dos valores con los de tu proyecto en sanity.io
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'TU_PROJECT_ID',
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenido')
          .items([
            // Singleton: configuración (solo un documento)
            S.listItem()
              .title('⚙️  Datos de la Empresa')
              .id('configuracion')
              .child(
                S.document()
                  .schemaType('configuracion')
                  .documentId('configuracion-singleton')
              ),
            S.divider(),
            S.documentTypeListItem('noticia').title('📰  Novedades / Blog'),
            S.divider(),
            S.documentTypeListItem('paginaCategoria').title('🪑  Páginas de Categoría'),
          ]),
    }),
    visionTool(), // Permite lanzar queries GROQ desde el Studio
  ],

  schema: {
    types: [noticia, configuracion, paginaCategoria],
  },
});
