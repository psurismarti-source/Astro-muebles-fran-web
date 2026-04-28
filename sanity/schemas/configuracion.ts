import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'configuracion',
  title: 'Datos de la Empresa',
  type: 'document',
  icon: () => '⚙️',
  // Solo debe existir un documento de este tipo
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'nombreEmpresa',
      title: 'Nombre de la empresa',
      type: 'string',
      initialValue: 'Muebles Fran',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'telefono',
      title: 'Teléfono principal',
      type: 'string',
      description: 'Ej: 93 313 88 06',
      initialValue: '93 313 88 06',
    }),
    defineField({
      name: 'whatsapp',
      title: 'Número de WhatsApp (con prefijo país)',
      type: 'string',
      description: 'Ej: 34644484563 (sin + ni espacios)',
      initialValue: '34644484563',
    }),
    defineField({
      name: 'email',
      title: 'Email de contacto',
      type: 'string',
      initialValue: 'comercial@mfran.com',
    }),
    defineField({
      name: 'direccion',
      title: 'Dirección',
      type: 'text',
      rows: 2,
      initialValue: 'Gran Vía de les Corts Catalanes 1105, 08020 Barcelona',
    }),
    defineField({
      name: 'horario',
      title: 'Horario de apertura',
      type: 'text',
      rows: 3,
      description: 'Ej: Lun–Sáb: 10:00–20:00 / Dom: cerrado',
    }),
    defineField({
      name: 'logo',
      title: 'Logo de la empresa',
      type: 'image',
      options: { hotspot: false },
    }),
    // ── SEO GLOBAL ────────────────────────────────────────────────────
    defineField({
      name: 'metaTituloGlobal',
      title: 'Meta título global',
      type: 'string',
      description: 'Título por defecto para buscadores cuando una página no tiene el suyo. Máx. 60 caracteres.',
      validation: Rule => Rule.max(60).warning('Google corta títulos superiores a 60 caracteres'),
      group: 'seo',
    }),
    defineField({
      name: 'metaDescripcionGlobal',
      title: 'Meta descripción global',
      type: 'text',
      rows: 2,
      description: 'Descripción por defecto para buscadores y redes cuando una página no tiene la suya. Máx. 160 caracteres.',
      initialValue: 'Muebles Fran Barcelona — Tienda de muebles y decoración. Salones, dormitorios, cocinas, baños y juvenil. Gran Vía 1105.',
      validation: Rule => Rule.max(160).warning('Google muestra como máximo 160 caracteres'),
      group: 'seo',
    }),
    defineField({
      name: 'ogImageGlobal',
      title: 'Imagen OG global (redes sociales)',
      type: 'image',
      options: { hotspot: false },
      description: 'Imagen por defecto al compartir cualquier página en redes. Recomendado: 1200×630px.',
      group: 'seo',
    }),
  ],
  groups: [
    { name: 'seo', title: '🔍 SEO Global' },
  ],
  preview: {
    select: { title: 'nombreEmpresa', subtitle: 'telefono', media: 'logo' },
  },
});
