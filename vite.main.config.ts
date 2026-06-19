import { defineConfig } from 'vite';
import { hotRestart } from './vite.hot-restart';

// https://vitejs.dev/config
export default defineConfig({
  plugins: [hotRestart()],
  build: {
    rollupOptions: {
      // Native module: must stay external so Vite doesn't try to bundle the
      // .node binary. Forge merges this with its own externals (electron +
      // node builtins), and `plugin-auto-unpack-natives` unpacks it from the
      // asar archive in packaged builds. Add other native deps here too.
      external: ['better-sqlite3'],
    },
  },
  server: {
    host: '0.0.0.0',
  },
});
