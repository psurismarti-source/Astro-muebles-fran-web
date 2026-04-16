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
    }),
    defineField({
      name: 'slug',
      title: 'URL de la página',
      type: 'slug',
      description: 'Debe coincidir con la ruta en la web. Ej: dormitorios/armarios',
      options: { source: 'titulo', maxLength: 96 },
      validation: Rule => Rule.required(),
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
    }),
    defineField({
      name: 'tag',
      title: 'Etiqueta pequeña (sobre el título)',
      type: 'string',
      description: 'Ej: Dormitorios · Armarios',
    }),
    defineField({
      name: 'subtitulo',
      title: 'Subtítulo de la sección intro',
      type: 'string',
    }),
    defineField({
      name: 'descripcion',
      title: 'Descripción',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Texto de la sección de presentación.',
    }),
    defineField({
      name: 'caracteristicas',
      title: 'Lista de características',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Puntos que aparecen en la lista de la sección intro.',
    }),
    defineField({
      name: 'imagenPrincipal',
      title: 'Imagen principal de la sección',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Texto alternativo' }),
      ],
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
    }),
    defineField({
      name: 'metaDescripcion',
      title: 'Meta descripción SEO',
      type: 'text',
      rows: 2,
      validation: Rule => Rule.max(160),
    }),
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
