import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

export default defineConfig({
  // Si usas un dominio personalizado en Vercel, ponlo aquí:
  // site: 'https://www.mueblesfran.com',
  output: 'static',

  integrations: [react()],
});