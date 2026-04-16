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
    }),
    defineField({
      name: 'fecha',
      title: 'Fecha de publicación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: Rule => Rule.required(),
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
    }),
    defineField({
      name: 'resumen',
      title: 'Resumen (máx. 200 caracteres)',
      type: 'text',
      rows: 3,
      description: 'Aparece en el listado del blog y en redes sociales.',
      validation: Rule => Rule.max(200),
    }),
    defineField({
      name: 'contenido',
      title: 'Contenido del artículo',
      type: 'array',
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
