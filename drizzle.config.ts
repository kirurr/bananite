import { defineConfig } from 'drizzle-kit';

/**
 * drizzle-kit configuration (used by the `db:*` npm scripts).
 *
 * - `schema` points at the table definitions.
 * - `out` is where generated SQL migrations live; this folder is bundled into
 *   the packaged app (see `extraResource` in forge.config.ts) and applied at
 *   startup by `initDatabase()`.
 *
 * Note: drizzle-kit only needs `dbCredentials` for `push`/`studio`. At runtime
 * the real database path is resolved from Electron's userData dir, so the local
 * `mods.db` here is only for local development tooling.
 */
export default defineConfig({
  dialect: 'sqlite',
  schema: './src/**/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: './mods.db',
  },
});
