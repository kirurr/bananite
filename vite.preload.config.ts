import { defineConfig } from 'vite';
import { hotRestart } from './vite.hot-restart';

// https://vitejs.dev/config
export default defineConfig({
  plugins: [hotRestart()],
  server: {
    host: '0.0.0.0',
  },
});
