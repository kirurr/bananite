import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';

/** Расширения, которые наши резолверы обязаны понимать (важен `.vue`). */
const EXTENSIONS = ['.ts', '.tsx', '.d.ts', '.js', '.jsx', '.mjs', '.cjs', '.json', '.vue'];

export default tseslint.config(
  // Build output / vendored dirs are never linted.
  {
    ignores: [
      '.vite/**',
      'out/**',
      'dist/**',
      'node_modules/**',
      'src/renderer/components/volt/**',
    ],
  },

  js.configs.recommended,
  // Type-aware presets: правила, которым нужен тайпчекер (no-floating-promises,
  // no-misused-promises, no-unsafe-*). Именно они ловят реальные баги, а не стиль.
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  ...pluginVue.configs['flat/recommended'],
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,

  // TS-aware resolver reads `exports`/types maps, so imports like
  // `@vitejs/plugin-vue` (and this config's own deps) resolve correctly
  // and don't trip import/no-unresolved. `.vue` must be in `extensions`,
  // иначе каждый импорт SFC — ложный import/no-unresolved.
  {
    settings: {
      'import/resolver': {
        typescript: { alwaysTryTypes: true, extensions: EXTENSIONS },
        node: { extensions: EXTENSIONS },
      },
      'import/extensions': EXTENSIONS,
    },
    rules: {
      // eslint-plugin-import не умеет парсить SFC (`parser.parse is not a function`),
      // поэтому все правила, которым нужно заглянуть ВНУТРЬ импортируемого модуля,
      // на .vue дают ложные срабатывания. Их работу полностью и точнее делает
      // vue-tsc: экспорты, пропсы и типы SFC проверяет Volar.
      // `import/no-unresolved` остаётся включённым — он резолвит .vue корректно.
      'import/default': 'off',
      'import/namespace': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
    },
  },

  {
    files: ['**/*.{ts,tsx,vue}'],
    rules: {
      // Числа в шаблонных строках — нормально, это не «небезопасный stringify».
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
    },
  },

  // Shared language options for our source files. `projectService` подключает
  // тайпчекер; `extraFileExtensions` обязателен, чтобы он видел .vue.
  {
    files: ['**/*.{ts,tsx,vue}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.vue'],
      },
    },
  },

  // Vue SFCs: vue-eslint-parser is the top-level parser (set by the vue
  // config above); point its <script lang="ts"> at the TS parser.
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: { parser: tseslint.parser },
    },
    rules: {
      // Второй эшелон защиты к vueCompilerOptions.checkUnknown* из tsconfig:
      // ошибка прилетает прямо в редакторе, без прогона vue-tsc.
      'vue/no-undef-components': 'error',
      'vue/no-undef-properties': 'error',
      'vue/no-unused-refs': 'error',
      'vue/require-typed-ref': 'error',
      'vue/no-ref-object-reactivity-loss': 'error',
    },
  },

  // Параметры/переменные с префиксом `_` — осознанно неиспользуемые.
  {
    files: ['**/*.{ts,tsx,vue}'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
    },
  },

  // Конфиги на плейн-JS вне tsconfig: type-aware правила к ним неприменимы.
  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [tseslint.configs.disableTypeChecked],
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
