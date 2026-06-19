import { app } from 'electron';
import path from 'node:path';
import Database from 'better-sqlite3';
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as gameSchema from '../game/schema';
import * as modSchema from '../mod/schema';

const schema = {
  ...gameSchema,
  ...modSchema,
};

export type DB = BetterSQLite3Database<typeof schema>;

let instance: DB | null = null;

function migrationsFolder(): string {
  // In a packaged app the `drizzle/` folder is shipped via `extraResource`
  // (see forge.config.ts) and lands next to the app in the resources dir.
  // In development it sits in the project root.
  return app.isPackaged
    ? path.join(process.resourcesPath, 'drizzle')
    : path.join(app.getAppPath(), 'drizzle');
}

export function initDatabase(): DB {
  if (instance) return instance;

  const file = path.join(app.getPath('userData'), 'mods.db');
  const sqlite = new Database(file);
  sqlite.pragma('journal_mode = WAL');

  instance = drizzle(sqlite, {
    schema,
  });
  migrate(instance, { migrationsFolder: migrationsFolder() });
  return instance;
}

export function getDb(): DB {
  if (!instance) {
    throw new Error('Database not initialised. Call initDatabase() on app startup first.');
  }
  return instance;
}
