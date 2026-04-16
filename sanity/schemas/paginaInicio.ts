import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'paginaInicio',
  title: '🏠 Página de Inicio',
  type: 'document',
  fields: [
    // ── HERO ──────────────────────────────────────────────────────────
    defineField({
      name: 'heroBadge',
      title: 'Hero — Badge (texto pequeño encima del título)',
      type: 'string',
      initialValue: 'Nueva colección 2025',
      group: 'hero',
    }),
    defineField({
      name: 'heroTitulo',
      title: 'Hero — Título principal',
      type: 'string',
      initialValue: 'Muebles de calidad para tu hogar',
      group: 'hero',
    }),
    defineField({
      name: 'heroSubtitulo',
      title: 'Hero — Subtítulo',
      type: 'text',
      rows: 2,
      initialValue: 'Más de 1.600 modelos en exposición. Visítanos en Gran Vía 1105, Barcelona.',
      group: 'hero',
    }),
    defineField({
      name: 'heroCta',
      title: 'Hero — Botón (texto)',
      type: 'string',
      initialValue: 'Ver colecciones',
      group: 'hero',
    }),

    // ── VENTAJAS ──────────────────────────────────────────────────────
    defineField({
      name: 'ventajasTitulo',
      title: 'Ventajas — Título sección',
      type: 'string',
      initialValue: 'Muebles Fran',
      group: 'ventajas',
    }),
    defineField({
      name: 'ventajasSubtitulo',
      title: 'Ventajas — Subtítulo sección',
      type: 'string',
      initialValue: 'Calidad, servicio y experiencia a tu disposición',
      group: 'ventajas',
    }),
    defineField({
      name: 'ventajas',
      title: 'Ventajas — Tarjetas',
      type: 'array',
      group: 'ventajas',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'icono', title: 'Icono (emoji)', type: 'string' }),
            defineField({ name: 'titulo', title: 'Título', type: 'string' }),
            defineField({ name: 'descripcion', title: 'Descripción', type: 'text', rows: 2 }),
          ],
          preview: {
            select: { title: 'titulo', subtitle: 'descripcion', media: 'icono' },
            prepare({ title, subtitle }) { return { title, subtitle } },
          },
        }),
      ],
    }),

    // ── PRODUCTOS ─────────────────────────────────────────────────────
    defineField({
      name: 'productosTitulo',
      title: 'Productos — Título sección',
      type: 'string',
      initialValue: 'Nuestros productos',
      group: 'productos',
    }),
    defineField({
      name: 'productosSubtitulo',
      title: 'Productos — Subtítulo',
      type: 'string',
      initialValue: 'Encuentra todo lo que necesitas para amueblar tu hogar',
      group: 'productos',
    }),

    // ── BLOG ──────────────────────────────────────────────────────────
    defineField({
      name: 'blogTitulo',
      title: 'Blog — Título sección',
      type: 'string',
      initialValue: 'Blog',
      group: 'blog',
    }),
    defineField({
      name: 'blogSubtitulo',
      title: 'Blog — Subtítulo',
      type: 'string',
      initialValue: 'Consejos, tendencias e inspiración para tu hogar',
      group: 'blog',
    }),
  ],

  groups: [
    { name: 'hero', title: '🎬 Hero' },
    { name: 'productos', title: '🛋️ Productos' },
    { name: 'ventajas', title: '⭐ Ventajas' },
    { name: 'blog', title: '📰 Blog' },
  ],
})
