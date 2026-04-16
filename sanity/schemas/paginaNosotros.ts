import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'paginaNosotros',
  title: '👥 Página Nosotros',
  type: 'document',
  fields: [
    // ── HERO ──────────────────────────────────────────────────────────
    defineField({
      name: 'heroTag',
      title: 'Hero — Tag (texto pequeño)',
      type: 'string',
      initialValue: 'Tienda familiar · Barcelona',
      group: 'hero',
    }),
    defineField({
      name: 'heroTitulo',
      title: 'Hero — Título',
      type: 'string',
      initialValue: 'Una tienda familiar con años de experiencia',
      group: 'hero',
    }),
    defineField({
      name: 'heroSubtitulo',
      title: 'Hero — Subtítulo',
      type: 'text',
      rows: 2,
      initialValue: 'Desde hace décadas ayudamos a nuestros clientes a convertir sus casas en hogares, con muebles de calidad y un trato cercano y personalizado.',
      group: 'hero',
    }),

    // ── HISTORIA ──────────────────────────────────────────────────────
    defineField({
      name: 'historiaTag',
      title: 'Historia — Tag',
      type: 'string',
      initialValue: 'Nuestra historia',
      group: 'historia',
    }),
    defineField({
      name: 'historiaTitulo',
      title: 'Historia — Título',
      type: 'string',
      initialValue: 'Muebles Fran, nacidos en Barcelona',
      group: 'historia',
    }),
    defineField({
      name: 'historiaParrafo1',
      title: 'Historia — Párrafo 1',
      type: 'text',
      rows: 3,
      initialValue: 'Muebles Fran es una tienda familiar ubicada en el corazón de Barcelona, especializada en mobiliario de calidad para el hogar. Llevamos años ayudando a nuestros clientes a encontrar el mueble perfecto para cada espacio.',
      group: 'historia',
    }),
    defineField({
      name: 'historiaParrafo2',
      title: 'Historia — Párrafo 2',
      type: 'text',
      rows: 3,
      initialValue: 'Nuestro equipo te asesora de forma personalizada para encontrar los muebles que mejor se adaptan a tu espacio, estilo y presupuesto. Ven a visitarnos y descubre nuestra amplia selección en exposición.',
      group: 'historia',
    }),

    // ── COMPROMISO ────────────────────────────────────────────────────
    defineField({
      name: 'compromisoTag',
      title: 'Compromiso — Tag',
      type: 'string',
      initialValue: 'Nuestro compromiso',
      group: 'compromiso',
    }),
    defineField({
      name: 'compromisoTitulo',
      title: 'Compromiso — Título',
      type: 'string',
      initialValue: 'Calidad y asesoramiento personalizado',
      group: 'compromiso',
    }),
    defineField({
      name: 'compromisoParrafo1',
      title: 'Compromiso — Párrafo 1',
      type: 'text',
      rows: 3,
      initialValue: 'Trabajamos con las mejores marcas del sector para ofrecerte muebles con la mejor relación calidad-precio. Cada pieza está seleccionada con mimo para garantizar durabilidad y estilo.',
      group: 'compromiso',
    }),
    defineField({
      name: 'compromisoParrafo2',
      title: 'Compromiso — Párrafo 2',
      type: 'text',
      rows: 3,
      initialValue: 'Nuestros profesionales conocen a fondo cada producto y están listos para ayudarte a tomar la mejor decisión, sin presiones. Tu hogar, tu decisión.',
      group: 'compromiso',
    }),

    // ── CTA ───────────────────────────────────────────────────────────
    defineField({
      name: 'ctaTitulo',
      title: 'CTA — Título',
      type: 'string',
      initialValue: '¿Listo para renovar tu hogar?',
      group: 'cta',
    }),
    defineField({
      name: 'ctaSubtitulo',
      title: 'CTA — Subtítulo',
      type: 'text',
      rows: 2,
      initialValue: 'Visítanos en nuestra tienda de Barcelona o escríbenos. Estaremos encantados de ayudarte.',
      group: 'cta',
    }),
  ],

  groups: [
    { name: 'hero', title: '🎬 Hero' },
    { name: 'historia', title: '📖 Nuestra Historia' },
    { name: 'compromiso', title: '🤝 Compromiso' },
    { name: 'cta', title: '📣 CTA Final' },
  ],
})
