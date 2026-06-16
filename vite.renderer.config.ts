import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';

// https://vitejs.dev/config
export default defineConfig({
	// index.html now lives in src/renderer, so that folder is the Vite root.
	// (Forge's plugin defaults root to the project dir; we override it here.)
	root: path.resolve(process.cwd(), 'src/renderer'),
	build: {
		// outDir is resolved relative to `root`, so pin it back with an absolute
		// path to the location Forge/main.ts expects: ../renderer/main_window.
		// Keep this folder name in sync with `name` in forge.config.ts.
		outDir: path.resolve(process.cwd(), '.vite/renderer/main_window'),
		emptyOutDir: true,
	},
	plugins: [vue()],
	server: {
		host: '0.0.0.0',
	}
});
