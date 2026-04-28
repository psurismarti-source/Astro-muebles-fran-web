import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

export default defineConfig({
  site: 'https://mueblesfran.barcelona',
  output: 'static',

  integrations: [react()],
});