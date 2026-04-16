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
    defineField({
      name: 'metaDescripcionGlobal',
      title: 'Meta descripción global (SEO)',
      type: 'text',
      rows: 2,
      description: 'Descripción por defecto para redes sociales y buscadores.',
      initialValue: 'Muebles Fran Barcelona — Tienda de muebles y decoración. Salones, dormitorios, cocinas, baños y juvenil. Gran Vía 1105.',
    }),
  ],
  preview: {
    select: { title: 'nombreEmpresa', subtitle: 'telefono', media: 'logo' },
  },
});
