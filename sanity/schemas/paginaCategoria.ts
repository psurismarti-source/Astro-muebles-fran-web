import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'paginaCategoria',
  title: 'Páginas de Categoría',
  type: 'document',
  icon: () => '🪑',
  description: 'Edita los textos y la imagen principal de cada página de producto.',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título de la página',
      type: 'string',
      description: 'Ej: Armarios',
      validation: Rule => Rule.required(),
      group: 'contenido',
    }),
    defineField({
      name: 'slug',
      title: 'URL de la página',
      type: 'slug',
      description: 'Debe coincidir con la ruta en la web. Ej: dormitorios/armarios',
      options: { source: 'titulo', maxLength: 96 },
      validation: Rule => Rule.required(),
      group: 'contenido',
    }),
    defineField({
      name: 'categoria',
      title: 'Categoría principal',
      type: 'string',
      options: {
        list: [
          { title: 'Salones', value: 'salones' },
          { title: 'Dormitorios', value: 'dormitorios' },
          { title: 'Juvenil', value: 'juvenil' },
          { title: 'Baños', value: 'banos' },
          { title: 'Cocinas', value: 'cocinas' },
        ],
      },
      validation: Rule => Rule.required(),
      group: 'contenido',
    }),
    defineField({
      name: 'tag',
      title: 'Etiqueta pequeña (sobre el título)',
      type: 'string',
      description: 'Ej: Dormitorios · Armarios',
      group: 'contenido',
    }),
    defineField({
      name: 'subtitulo',
      title: 'Subtítulo de la sección intro',
      type: 'string',
      group: 'contenido',
    }),
    defineField({
      name: 'descripcion',
      title: 'Descripción',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Texto de la sección de presentación.',
      group: 'contenido',
    }),
    defineField({
      name: 'caracteristicas',
      title: 'Lista de características',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Puntos que aparecen en la lista de la sección intro.',
      group: 'contenido',
    }),
    defineField({
      name: 'imagenPrincipal',
      title: 'Imagen principal de la sección',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Texto alternativo' }),
      ],
      group: 'contenido',
    }),
    defineField({
      name: 'galeriaExtra',
      title: 'Imágenes adicionales de galería (desde Sanity)',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Descripción' }],
        },
      ],
      description: 'Opcional: imágenes gestionadas desde aquí en lugar de la carpeta /img.',
      group: 'contenido',
    }),

    // ── SEO ───────────────────────────────────────────────────────────
    defineField({
      name: 'metaTitulo',
      title: 'Meta título',
      type: 'string',
      description: 'Título que aparece en Google. Máx. 60 caracteres. Ej: "Armarios y vestidores · Muebles Fran Barcelona".',
      validation: Rule => Rule.max(60).warning('Google corta títulos superiores a 60 caracteres'),
      group: 'seo',
    }),
    defineField({
      name: 'metaDescripcion',
      title: 'Meta descripción',
      type: 'text',
      rows: 2,
      description: 'Descripción que aparece bajo el título en Google. Máx. 160 caracteres.',
      validation: Rule => Rule.max(160).warning('Google muestra como máximo 160 caracteres'),
      group: 'seo',
    }),
    defineField({
      name: 'ogImage',
      title: 'Imagen para redes sociales',
      type: 'image',
      options: { hotspot: false },
      description: 'Imagen al compartir en redes. Si está vacío se usa la imagen global. Recomendado: 1200×630px.',
      group: 'seo',
    }),
    defineField({
      name: 'noIndex',
      title: 'No indexar esta página',
      type: 'boolean',
      description: 'Actívalo solo si NO quieres que Google indexe esta página. Normalmente debe estar desactivado.',
      initialValue: false,
      group: 'seo',
    }),
  ],
  groups: [
    { name: 'contenido', title: '📝 Contenido', default: true },
    { name: 'seo', title: '🔍 SEO' },
  ],
  preview: {
    select: { title: 'titulo', subtitle: 'categoria', media: 'imagenPrincipal' },
    prepare({ title, subtitle, media }) {
      return { title, subtitle: subtitle ?? '', media };
    },
  },
  orderings: [
    { title: 'Categoría', name: 'categoria', by: [{ field: 'categoria', direction: 'asc' }, { field: 'titulo', direction: 'asc' }] },
  ],
});
