import { defineConfig } from 'vite';
import pklPlugin from '@nexo-labs/vite-pkl-plugin';

export default defineConfig({
  plugins: [
    pklPlugin({
      generateTypes: true,
      outputDir: 'src/generated',
      watch: true
    })
  ]
}); 