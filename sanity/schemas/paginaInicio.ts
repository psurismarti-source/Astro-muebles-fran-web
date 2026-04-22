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
      title: 'Hero — Botón (texto) [legacy, ya no se usa en el nuevo hero]',
      type: 'string',
      initialValue: 'Ver colecciones',
      group: 'hero',
    }),
    defineField({
      name: 'heroMetaTags',
      title: 'Hero — Tags inferiores (3 frases cortas)',
      description: 'Aparecen en la franja inferior del hero, separadas por un punto.',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.max(3).warning('Idealmente 3 tags'),
      initialValue: [
        'Tienda física en Barcelona',
        'Más de 25 años sirviendo al barrio',
        'Atención personalizada',
      ],
      group: 'hero',
    }),
    defineField({
      name: 'heroCtaLlamar',
      title: 'Hero — Texto del botón "Llamar"',
      type: 'string',
      initialValue: 'Llamar ahora',
      group: 'hero',
    }),
    defineField({
      name: 'heroCtaComoLlegar',
      title: 'Hero — Texto del botón "Cómo llegar"',
      type: 'string',
      initialValue: 'Cómo llegar',
      group: 'hero',
    }),
    defineField({
      name: 'heroCtaWhatsapp',
      title: 'Hero — Texto del botón "WhatsApp"',
      type: 'string',
      initialValue: 'WhatsApp',
      group: 'hero',
    }),

    // ── TRUST (4 celdas bajo el hero) ─────────────────────────────────
    defineField({
      name: 'trustItems',
      title: 'Bloque de 4 celdas bajo el hero',
      description: 'Dirección, Teléfono, Horario, Parking. Mantén 4 elementos.',
      type: 'array',
      group: 'trust',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'numero',      title: 'Número (01, 02, …)', type: 'string' }),
            defineField({ name: 'titulo',      title: 'Título',             type: 'string' }),
            defineField({ name: 'descripcion', title: 'Descripción',        type: 'text', rows: 2 }),
          ],
          preview: {
            select: { title: 'titulo', subtitle: 'descripcion' },
            prepare({ title, subtitle }) { return { title, subtitle } },
          },
        }),
      ],
      validation: (Rule) => Rule.length(4).warning('Deben ser exactamente 4 celdas'),
      initialValue: [
        { _key: 't1', numero: '01', titulo: 'Dirección', descripcion: 'Gran Vía de les Corts Catalanes, 1105 · 08020 Barcelona' },
        { _key: 't2', numero: '02', titulo: 'Teléfono',  descripcion: 'Te atendemos personalmente, sin IVRs ni esperas.' },
        { _key: 't3', numero: '03', titulo: 'Horario',   descripcion: 'Lun–Vie · 9:30–13:30 / 16:30–20:30 · Sábados 10:00–14:00' },
        { _key: 't4', numero: '04', titulo: 'Parking',   descripcion: 'Parking gratuito para clientes. Ven sin prisas.' },
      ],
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

    // ── PARKING BANNER ────────────────────────────────────────────────
    defineField({
      name: 'parkingTitulo',
      title: 'Parking — Título',
      type: 'string',
      initialValue: 'Parking gratuito para clientes',
      group: 'parking',
    }),
    defineField({
      name: 'parkingDescripcion',
      title: 'Parking — Descripción',
      type: 'text',
      rows: 2,
      initialValue: 'Ven en coche sin preocuparte por el aparcamiento — disponemos de parking propio y gratuito para todos nuestros clientes.',
      group: 'parking',
    }),
    defineField({
      name: 'parkingCta',
      title: 'Parking — Texto del botón',
      type: 'string',
      initialValue: 'Ver ubicación →',
      group: 'parking',
    }),

    // ── CONTACTO ──────────────────────────────────────────────────────
    defineField({
      name: 'contactoTitulo',
      title: 'Contacto — Título sección',
      type: 'string',
      initialValue: 'Visítanos en tienda',
      group: 'contacto',
    }),
    defineField({
      name: 'contactoSubtitulo',
      title: 'Contacto — Subtítulo',
      type: 'text',
      rows: 2,
      initialValue: 'Estamos en Barcelona, listos para atenderte. Ven a conocer nuestra exposición y encuentra el mueble perfecto para tu hogar.',
      group: 'contacto',
    }),
  ],

  groups: [
    { name: 'hero', title: '🎬 Hero' },
    { name: 'trust', title: '🔢 Celdas bajo el hero' },
    { name: 'productos', title: '🛋️ Productos' },
    { name: 'ventajas', title: '⭐ Ventajas' },
    { name: 'blog', title: '📰 Blog' },
    { name: 'parking', title: '🅿️ Parking' },
    { name: 'contacto', title: '📍 Contacto' },
  ],
})
