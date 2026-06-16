import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  // Build output / vendored dirs are never linted.
  { ignores: ['.vite/**', 'out/**', 'dist/**', 'node_modules/**'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,

  // TS-aware resolver reads `exports`/types maps, so imports like
  // `@vitejs/plugin-vue` (and this config's own deps) resolve correctly
  // and don't trip import/no-unresolved. Applied to every file.
  {
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
  },

  // Shared language options for our source files.
  {
    files: ['**/*.{ts,tsx,vue}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },

  // Vue SFCs: vue-eslint-parser is the top-level parser (set by the vue
  // config above); point its <script lang="ts"> at the TS parser.
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: { parser: tseslint.parser },
    },
  },

  // The `typescript-eslint` meta package exposes `config`/`configs`/`parser`
  // on its default export by design; this rule's warning is a false positive.
  {
    files: ['eslint.config.mjs'],
    rules: { 'import/no-named-as-default-member': 'off' },
  },

  // MUST stay last: turns off every ESLint rule that conflicts with Prettier
  // (the stylistic rules pulled in by the js/ts/vue/import presets above).
  // Prettier owns formatting; ESLint is left to check code quality only.
  eslintConfigPrettier,
);
