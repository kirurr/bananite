import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  root: path.resolve(process.cwd(), 'src/renderer'),
  build: {
    // outDir is resolved relative to `root`, so pin it back with an absolute
    // path to the location Forge/main.ts expects: ../renderer/main_window.
    // Keep this folder name in sync with `name` in forge.config.ts.
    outDir: path.resolve(process.cwd(), '.vite/renderer/main_window'),
    emptyOutDir: true,
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, './src/renderer/') }],
  },
  plugins: [vue(), tailwindcss()],
  server: {
    host: '0.0.0.0',
  },
});
