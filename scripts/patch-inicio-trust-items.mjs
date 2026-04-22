/**
 * patch-inicio-trust-items.mjs
 * Rellena los 4 trustItems (Dirección/Teléfono/Horario/Parking) y los
 * campos de heroMetaTags + heroCta* en el singleton pagina-inicio.
 * Así Santi puede editarlos desde el dashboard.
 *
 * Uso (desde la raíz del repo):
 *   SANITY_TOKEN=tu_token_editor node scripts/patch-inicio-trust-items.mjs
 *
 * Dónde sacar el token:
 *   https://www.sanity.io/manage/project/0g6vki0n
 *   → API → Tokens → Add API token → Permissions: Editor
 */

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '0g6vki0n',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

if (!process.env.SANITY_TOKEN) {
  console.error('❌ Falta SANITY_TOKEN en el entorno. Ver cabecera de este archivo.');
  process.exit(1);
}

const trustItems = [
  { _key: 't1', numero: '01', titulo: 'Dirección', descripcion: 'Gran Vía de les Corts Catalanes, 1105 · 08020 Barcelona' },
  { _key: 't2', numero: '02', titulo: 'Teléfono',  descripcion: 'Te atendemos personalmente, sin IVRs ni esperas.' },
  { _key: 't3', numero: '03', titulo: 'Horario',   descripcion: 'Lun–Vie · 9:30–13:30 / 16:30–20:30 · Sábados 10:00–14:00' },
  { _key: 't4', numero: '04', titulo: 'Parking',   descripcion: 'Parking gratuito para clientes. Ven sin prisas.' },
];

const heroMetaTags = [
  'Tienda física en Barcelona',
  'Más de 25 años sirviendo al barrio',
  'Atención personalizada',
];

await client
  .patch('pagina-inicio-singleton')
  .setIfMissing({
    trustItems,
    heroMetaTags,
    heroBadge:         'Barcelona · Desde 1998',
    heroCtaLlamar:     'Llamar ahora',
    heroCtaComoLlegar: 'Cómo llegar',
    heroCtaWhatsapp:   'WhatsApp',
  })
  .commit({ autoGenerateArrayKeys: true });

console.log('✅ trustItems + heroMetaTags + CTAs poblados en Sanity.');
console.log('   Santi ya puede editarlos desde el dashboard.');
