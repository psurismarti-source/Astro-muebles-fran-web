import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'noticia',
  title: 'Novedades / Blog',
  type: 'document',
  icon: () => '📰',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título',
      type: 'string',
      validation: Rule => Rule.required().min(5).max(120),
      group: 'contenido',
    }),
    defineField({
      name: 'slug',
      title: 'URL (slug)',
      type: 'slug',
      description: 'Se genera automáticamente desde el título. No lo cambies una vez publicado.',
      options: {
        source: 'titulo',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
      group: 'contenido',
    }),
    defineField({
      name: 'fecha',
      title: 'Fecha de publicación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: Rule => Rule.required(),
      group: 'contenido',
    }),
    defineField({
      name: 'imagen',
      title: 'Imagen principal',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo (descripción para buscadores)',
          type: 'string',
          validation: Rule => Rule.required(),
        }),
      ],
      group: 'contenido',
    }),
    defineField({
      name: 'resumen',
      title: 'Resumen (máx. 200 caracteres)',
      type: 'text',
      rows: 3,
      description: 'Aparece en el listado del blog y en redes sociales.',
      validation: Rule => Rule.max(200),
      group: 'contenido',
    }),
    defineField({
      name: 'contenido',
      title: 'Contenido del artículo',
      type: 'array',
      group: 'contenido',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Título H2', value: 'h2' },
            { title: 'Título H3', value: 'h3' },
            { title: 'Cita', value: 'blockquote' },
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
                title: 'Enlace',
                fields: [{ name: 'href', type: 'url', title: 'URL' }],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'Texto alternativo' },
            { name: 'caption', type: 'string', title: 'Pie de foto' },
          ],
        },
      ],
    }),
  ],
    // ── SEO ───────────────────────────────────────────────────────────
    defineField({
      name: 'metaTitulo',
      title: 'Meta título (opcional)',
      type: 'string',
      description: 'Si está vacío se usa el título del artículo. Máx. 60 caracteres.',
      validation: Rule => Rule.max(60).warning('Google corta títulos superiores a 60 caracteres'),
      group: 'seo',
    }),
    defineField({
      name: 'metaDescripcion',
      title: 'Meta descripción (opcional)',
      type: 'text',
      rows: 2,
      description: 'Si está vacío se usa el resumen del artículo. Máx. 160 caracteres.',
      validation: Rule => Rule.max(160).warning('Google muestra como máximo 160 caracteres'),
      group: 'seo',
    }),
    defineField({
      name: 'ogImage',
      title: 'Imagen para redes sociales (opcional)',
      type: 'image',
      options: { hotspot: false },
      description: 'Si está vacío se usa la imagen principal del artículo. Recomendado: 1200×630px.',
      group: 'seo',
    }),
    defineField({
      name: 'noIndex',
      title: 'No indexar este artículo',
      type: 'boolean',
      description: 'Actívalo solo si NO quieres que Google indexe este artículo. Normalmente debe estar desactivado.',
      initialValue: false,
      group: 'seo',
    }),
  ],
  groups: [
    { name: 'contenido', title: '📝 Contenido', default: true },
    { name: 'seo', title: '🔍 SEO' },
  ],
  preview: {
    select: { title: 'titulo', media: 'imagen', date: 'fecha' },
    prepare({ title, media, date }) {
      const d = date ? new Date(date).toLocaleDateString('es-ES') : '';
      return { title, subtitle: d, media };
    },
  },
  orderings: [
    { title: 'Más recientes', name: 'fechaDesc', by: [{ field: 'fecha', direction: 'desc' }] },
  ],
});
