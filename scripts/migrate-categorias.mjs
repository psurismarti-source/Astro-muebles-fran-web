/**
 * migrate-categorias.mjs
 * Crea los documentos de paginaCategoria en Sanity con el contenido actual de la web.
 *
 * Uso:
 *   SANITY_TOKEN=tu_token node scripts/migrate-categorias.mjs
 */

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '0g6vki0n',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

// Helper: convierte array de strings en bloques Portable Text
function toBlocks(parrafos) {
  return parrafos.map((texto, i) => ({
    _type: 'block',
    _key: `blk${i}`,
    style: 'normal',
    children: [{ _type: 'span', _key: `sp${i}`, text: texto, marks: [] }],
    markDefs: [],
  }));
}

// Helper: deriva la categoría del galeriaFolder
function getCategoria(folder) {
  if (folder.startsWith('salones'))    return 'salones';
  if (folder.startsWith('dormitorio')) return 'dormitorios';
  if (folder.startsWith('juvenil'))    return 'juvenil';
  if (folder.startsWith('banos'))      return 'banos';
  if (folder.startsWith('cocinas'))    return 'cocinas';
  return '';
}

const paginas = [
  // ── SALONES ─────────────────────────────────────────────────────────────────
  {
    slug: 'salones-ambientes',
    titulo: 'Ambientes de Salón',
    tag: 'Salones · Ambientes',
    subtitulo: 'Composiciones completas para tu salón',
    parrafos: [
      'Descubre nuestra amplia selección de ambientes de salón, donde cada composición ha sido diseñada para maximizar el espacio y la estética de tu hogar.',
      'Desde estilos contemporáneos hasta diseños más clásicos, en Muebles Fran encontrarás la solución perfecta para cada gusto y cada presupuesto.',
    ],
    caracteristicas: [
      'Más de 55 ambientes en exposición',
      'Composiciones personalizables',
      'Diferentes estilos: moderno, nórdico, clásico',
      'Asesoramiento de decoración incluido',
      'Montaje profesional en Barcelona',
    ],
  },
  {
    slug: 'salones-sofas',
    titulo: 'Sofás',
    tag: 'Salones · Sofás',
    subtitulo: 'Sofás para todos los estilos y espacios',
    parrafos: [
      'Amplia selección de sofás de las mejores marcas nacionales: rinconeras, cheslong, sofás cama y módulos componibles. Tapizados en tela, terciopelo o piel.',
      'Personalizables en color, medida y tipo de pata. Consulta nuestro catálogo de más de 40 modelos en exposición.',
    ],
    caracteristicas: [
      'Más de 40 modelos en exposición',
      'Sofás rinconera, cheslong y 3 plazas',
      'Sofás cama con arrastre',
      'Tapizados: tela, terciopelo, piel',
      'Montaje e instalación en Barcelona',
    ],
  },
  {
    slug: 'salones-mesas',
    titulo: 'Mesas de Comedor',
    tag: 'Salones · Mesas',
    subtitulo: 'Mesas de comedor para cada espacio',
    parrafos: [
      'Colección de mesas de comedor fijas y extensibles en madera maciza, cristal, cerámica y lacado. Para espacios pequeños y grandes comedores.',
      'Combinables con nuestras sillas y sillones de comedor. Consulta disponibilidad de medidas y acabados.',
    ],
    caracteristicas: [
      'Mesas fijas y extensibles',
      'Materiales: madera, cerámica, cristal, lacado',
      'Para 4, 6 y 8 comensales',
      'Medidas personalizables bajo pedido',
      'Combinables con sillas de la exposición',
    ],
  },
  {
    slug: 'salones-sillas',
    titulo: 'Sillas de Comedor',
    tag: 'Salones · Sillas',
    subtitulo: 'Sillas tapizadas y de madera para el comedor',
    parrafos: [
      'Gran variedad de sillas de comedor tapizadas en tela, polipiel y madera. Clásicas, modernas y nórdicas para combinar con cualquier mesa.',
      'También encontrarás sillas apilables, con reposabrazos y taburetes altos para barra o isla de cocina.',
    ],
    caracteristicas: [
      'Más de 80 modelos en exposición',
      'Tapizadas en tela, polipiel y madera',
      'Varios colores y acabados disponibles',
      'Sillas con y sin reposabrazos',
      'Taburetes y sillas altas para barra',
    ],
  },
  {
    slug: 'salones-butacas',
    titulo: 'Butacas y Sillones',
    tag: 'Salones · Butacas',
    subtitulo: 'El rincón de descanso perfecto',
    parrafos: [
      'Selección de butacas y sillones individuales para completar tu salón. Modelos relax con mecanismo reclinable, butacas de diseño y sillones orejeros.',
      'Disponibles en multitud de tapizados y acabados, combinables con el sofá de tu elección.',
    ],
    caracteristicas: [
      'Modelos relax con reclinable',
      'Butacas de diseño y orejeras',
      'Tapizados: tela, terciopelo, piel',
      'Opciones con reposapiés',
      'Combinables con sofás del catálogo',
    ],
  },
  {
    slug: 'salones-buffets',
    titulo: 'Aparadores y Buffets',
    tag: 'Salones · Aparadores',
    subtitulo: 'Orden y estética para tu comedor',
    parrafos: [
      'Colección de aparadores y buffets en madera, lacado y combinados. Perfectos para almacenar vajilla, mantelería y complementos de comedor.',
      'Diseños bajos y altos, con puertas correderas o batientes, en distintos acabados para coordinarse con tu mesa y sillas.',
    ],
    caracteristicas: [
      'Más de 33 modelos en exposición',
      'Acabados: madera, lacado, combinado',
      'Con baldas regulables interiores',
      'Puertas correderas y batientes',
      'Medidas estándar y a medida',
    ],
  },
  {
    slug: 'salones-muebles-tv',
    titulo: 'Muebles de TV',
    tag: 'Salones · Muebles TV',
    subtitulo: 'El centro del salón, bien organizado',
    parrafos: [
      'Muebles de televisión bajos y módulos de salón para organizar el espacio alrededor de la pantalla. Con cajones, baldas y huecos para aparatos.',
      'Disponibles en acabados naturales y lacados para adaptarse a cualquier decoración.',
    ],
    caracteristicas: [
      'Módulos bajos y composiciones',
      'Huecos para aparatos y cables',
      'Acabados: roble, nogal, lacado',
      'Combinables con estanterías',
      'Medidas personalizables',
    ],
  },
  // ── DORMITORIOS ─────────────────────────────────────────────────────────────
  {
    slug: 'dormitorios-ambientes',
    titulo: 'Ambientes de Dormitorio',
    tag: 'Dormitorios · Ambientes',
    subtitulo: 'Composiciones completas para tu dormitorio',
    parrafos: [
      'Más de 90 ambientes de dormitorio en nuestra exposición de Barcelona. Desde habitaciones matrimoniales hasta dormitorios juveniles, cada composición está pensada para maximizar el espacio.',
      'Combinamos camas, armarios, mesitas, cómodas y cabeceros para crear dormitorios con personalidad y funcionalidad.',
    ],
    caracteristicas: [
      'Más de 90 ambientes en exposición',
      'Camas de 135, 150 y 180 cm',
      'Armarios y sistemas de almacenaje',
      'Diferentes estilos y acabados',
      'Diseño e instalación profesional',
    ],
  },
  {
    slug: 'dormitorios-armarios',
    titulo: 'Armarios',
    tag: 'Dormitorios · Armarios',
    subtitulo: 'Armarios para el dormitorio',
    parrafos: [
      'Los armarios son fundamentales para mantener el orden y la armonía en el dormitorio. En Muebles Fran disponemos de una extensa galería de armarios con puertas correderas y batientes, en acabados de madera, lacado mate y más.',
      'Con más de 100 modelos en nuestra exposición, encontrarás el armario perfecto para cualquier espacio. También ofrecemos soluciones a medida para aprovechar al máximo los rincones de tu habitación.',
    ],
    caracteristicas: [
      'Más de 100 modelos en exposición',
      'Puertas correderas y batientes',
      'Interiores completamente equipados',
      'Acabados: madera, lacado, roble, nogal',
      'Montaje e instalación profesional',
    ],
  },
  {
    slug: 'dormitorios-armarios-medida',
    titulo: 'Armarios a Medida',
    tag: 'Dormitorios · Armarios a Medida',
    subtitulo: 'Aprovecha cada centímetro de tu espacio',
    parrafos: [
      'Los armarios a medida son la solución perfecta para espacios irregulares, techos inclinados o rincones difíciles. Diseñamos y fabricamos tu armario ajustado exactamente a tus necesidades.',
      'Nuestros especialistas visitan tu hogar, toman medidas y te proponen la mejor distribución interior para maximizar el almacenaje.',
    ],
    caracteristicas: [
      'Medición y presupuesto gratuito en Barcelona',
      'Diseño personalizado de interior',
      'Puertas correderas, batientes o abatibles',
      'Múltiples acabados y colores',
      'Instalación incluida',
    ],
  },
  {
    slug: 'dormitorios-arlex',
    titulo: 'Dormitorios Arlex',
    tag: 'Dormitorios · Arlex',
    subtitulo: 'La colección premium de Arlex',
    parrafos: [
      'Arlex es una de las marcas de referencia en dormitorios de diseño. Sus composiciones combinan materiales de alta calidad con un diseño contemporáneo y atemporal.',
      'En Muebles Fran somos distribuidores oficiales de Arlex. Visita nuestra exposición en Barcelona para descubrir la colección completa.',
    ],
    caracteristicas: [
      'Distribuidores oficiales Arlex en Barcelona',
      'Materiales de primera calidad',
      'Diseño contemporáneo y atemporal',
      'Camas, armarios y complementos de la marca',
      'Garantía de fabricante',
    ],
  },
  {
    slug: 'dormitorio-vestidores',
    titulo: 'Vestidores',
    tag: 'Dormitorios · Vestidores',
    subtitulo: 'Tu espacio personal de moda y organización',
    parrafos: [
      'Transforma un dormitorio o un rincón en un vestidor funcional y elegante. Sistemas modulares adaptables a cualquier espacio y presupuesto.',
      'Diseñamos vestidores abiertos, con cortina o con puerta, con todo tipo de interiores: colgadores, baldas, cajones y zapateros.',
    ],
    caracteristicas: [
      'Más de 12 ambientes en exposición',
      'Vestidores abiertos y cerrados',
      'Sistemas modulares ampliables',
      'Interiores personalizados',
      'Iluminación integrada disponible',
    ],
  },
  // ── JUVENIL ─────────────────────────────────────────────────────────────────
  {
    slug: 'juvenil-ambientes',
    titulo: 'Ambientes Juveniles',
    tag: 'Juvenil · Ambientes',
    subtitulo: 'Habitaciones juveniles con personalidad',
    parrafos: [
      'Habitaciones juveniles que crecen con tus hijos. Composiciones funcionales con escritorios, estanterías, armarios y camas en un solo conjunto.',
      'Diseños modernos y coloridos que se adaptan a todos los gustos, con gran variedad de acabados y configuraciones.',
    ],
    caracteristicas: [
      'Más de 100 ambientes en exposición',
      'Composiciones con escritorio integrado',
      'Camas nido, abatibles y literas',
      'Armarios y sistemas de almacenaje',
      'Acabados en múltiples colores',
    ],
  },
  {
    slug: 'juvenil-armarios',
    titulo: 'Armarios Juveniles',
    tag: 'Juvenil · Armarios',
    subtitulo: 'Armarios funcionales para habitaciones juveniles',
    parrafos: [
      'Armarios juveniles coordinados con el resto del dormitorio. Modelos de 2, 3 y 4 puertas con interiores adaptados para ropa joven: cajones, zapatero y colgadores largos y cortos.',
      'Disponibles en los mismos acabados que las camas y escritorios juveniles para crear composiciones perfectamente coordinadas.',
    ],
    caracteristicas: [
      'Coordinados con camas y escritorios',
      'De 2, 3 y 4 puertas',
      'Puertas correderas y batientes',
      'Interiores adaptados a ropa joven',
      'Múltiples acabados disponibles',
    ],
  },
  {
    slug: 'juvenil-camas-abatibles',
    titulo: 'Camas Abatibles',
    tag: 'Juvenil · Camas Abatibles',
    subtitulo: 'Gana espacio con las camas abatibles',
    parrafos: [
      'Las camas abatibles son la solución perfecta para habitaciones pequeñas. De día el espacio queda libre para estudiar o jugar; de noche se despliega una cama cómoda y completa.',
      'Disponemos de modelos verticales y horizontales, simples y con escritorio integrado, para camas de 90 y 105 cm.',
    ],
    caracteristicas: [
      'Más de 40 modelos en exposición',
      'Abatibles verticales y horizontales',
      'Con escritorio y estanterías integradas',
      'Para camas de 90 y 105 cm',
      'Mecanismo de gas de alta seguridad',
    ],
  },
  {
    slug: 'juvenil-escritorios',
    titulo: 'Escritorios Juveniles',
    tag: 'Juvenil · Escritorios',
    subtitulo: 'El rincón de estudio perfecto',
    parrafos: [
      'Escritorios y zonas de estudio diseñados para jóvenes. Con cajones, estanterías superiores, puertos USB y gestión de cables integrada.',
      'Modulares y ampliables a medida que crecen las necesidades del estudiante. Coordinados con el resto del dormitorio juvenil.',
    ],
    caracteristicas: [
      'Con cajones y almacenaje integrado',
      'Estanterías superiores modulares',
      'Gestión de cables integrada',
      'Altura ergonómica regulable en algunos modelos',
      'Coordinados con camas y armarios',
    ],
  },
  {
    slug: 'juvenil-literas',
    titulo: 'Literas',
    tag: 'Juvenil · Literas',
    subtitulo: 'Literas seguras y con estilo',
    parrafos: [
      'Literas para habitaciones compartidas. Estructura robusta con escalera de acceso segura, barandilla de protección y diseño moderno.',
      'Modelos con escritorio integrado en la cama inferior, con cama nido extraíble y triples para hasta tres camas en el mismo espacio.',
    ],
    caracteristicas: [
      'Estructura robusta certificada',
      'Barandilla de seguridad incluida',
      'Escalera cómoda con peldaños antideslizantes',
      'Modelos con escritorio y cajones',
      'Para colchones de 90 y 105 cm',
    ],
  },
  // ── BAÑOS ───────────────────────────────────────────────────────────────────
  {
    slug: 'banos',
    titulo: 'Baños',
    tag: 'Baños',
    subtitulo: 'Muebles de baño con diseño y funcionalidad',
    parrafos: [
      'En Muebles Fran encontrarás una cuidada selección de lavabos y muebles de baño de las mejores marcas. Lavabos de apoyo, empotrados, sobre mueble y de pared en cerámica, cristal y piedra natural.',
      'Diseños contemporáneos que combinan estética y durabilidad para que tu baño sea un espacio de bienestar y relajación.',
    ],
    caracteristicas: [
      'Lavabos de apoyo, empotrados y sobre mueble',
      'Materiales: cerámica, cristal, piedra natural',
      'Muebles de baño en múltiples acabados',
      'Griferías y accesorios coordinados',
      'Asesoramiento de proyecto incluido',
    ],
  },
  // ── COCINAS ─────────────────────────────────────────────────────────────────
  {
    slug: 'cocinas',
    titulo: 'Cocinas',
    tag: 'Cocinas',
    subtitulo: 'Cocinas diseñadas para tu forma de vivir',
    parrafos: [
      'Diseñamos y fabricamos cocinas a medida adaptadas a cada espacio y cada necesidad. Desde cocinas minimalistas en lacado blanco hasta modelos en madera natural o con isla central.',
      'Nuestros especialistas te acompañan desde el primer boceto hasta la instalación completa, con las mejores marcas de electrodomésticos.',
    ],
    caracteristicas: [
      'Diseño personalizado gratuito',
      'Acabados: lacado, madera, piedra sinterizada',
      'Con o sin isla central',
      'Electrodomésticos de primeras marcas',
      'Instalación completa en Barcelona',
    ],
  },
];

async function run() {
  console.log(`Creando ${paginas.length} documentos en Sanity...`);

  for (const p of paginas) {
    const doc = {
      _id:   p.slug,        // ID = slug → idempotente (se puede ejecutar varias veces)
      _type: 'paginaCategoria',
      titulo: p.titulo,
      slug:  { _type: 'slug', current: p.slug },
      categoria: getCategoria(p.slug),
      tag:   p.tag,
      subtitulo: p.subtitulo,
      descripcion: toBlocks(p.parrafos),
      caracteristicas: p.caracteristicas,
    };

    await client.createOrReplace(doc);
    console.log(`✓ ${p.titulo} (${p.slug})`);
  }

  console.log('\n✅ Migración completada. Todos los documentos están publicados en Sanity.');
}

run().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
