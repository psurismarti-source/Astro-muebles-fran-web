/**
 * patch-inicio-nuevos-campos.mjs
 * Rellena los nuevos campos de parkingBanner y contacto en el singleton pagina-inicio.
 *
 * Uso:
 *   SANITY_TOKEN=tu_token node scripts/patch-inicio-nuevos-campos.mjs
 */

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '0g6vki0n',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

await client
  .patch('pagina-inicio-singleton')
  .setIfMissing({
    parkingTitulo:      'Parking gratuito para clientes',
    parkingDescripcion: 'Ven en coche sin preocuparte por el aparcamiento — disponemos de parking propio y gratuito para todos nuestros clientes.',
    parkingCta:         'Ver ubicación →',
    contactoTitulo:     'Visítanos en tienda',
    contactoSubtitulo:  'Estamos en Barcelona, listos para atenderte. Ven a conocer nuestra exposición y encuentra el mueble perfecto para tu hogar.',
  })
  .commit({ autoGenerateArrayKeys: true });

console.log('✅ Campos de parking y contacto rellenados correctamente.');
