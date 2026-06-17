/**
 * Standalone seeding script — populates a SQLite database with sample mods.
 *
 * Run it with:  npm run db:seed
 *
 * This runs in plain Node (not Electron), so it can't use `app.getPath()`.
 * By default it seeds the local development database (`./mods.db` in the project
 * root, the same file drizzle-kit uses). Point it at another file with the
 * DB_PATH env var, e.g.:  DB_PATH=/path/to/mods.db npm run db:seed
 */
import path from 'node:path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { mods } from '../mod/schema';

const file = process.env.DB_PATH ?? path.join(process.cwd(), 'mods.db');

const sqlite = new Database(file);
sqlite.pragma('journal_mode = WAL');
const db = drizzle(sqlite);

migrate(db, { migrationsFolder: path.join(process.cwd(), 'drizzle') });

const sampleMods: (typeof mods.$inferInsert)[] = [
  { name: 'Fabric API', enabled: true },
  { name: 'Sodium', enabled: true },
  { name: 'Iris Shaders', enabled: true },
  { name: 'JEI (Just Enough Items)', enabled: true },
  { name: 'Distant Horizons', enabled: false },
];

db.delete(mods).run();
db.insert(mods).values(sampleMods).run();

console.log(`Seeded ${sampleMods.length} mods into ${file}`);

sqlite.close();
