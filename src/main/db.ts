import { app } from 'electron';
import path from 'node:path';
import Database from 'better-sqlite3';
import type { Mod, NewMod } from '../shared/ipc';

/** Raw row shape as stored in SQLite (`enabled` is 0/1, not a boolean). */
interface ModRow {
  id: number;
  name: string;
  enabled: number;
  created_at: string;
}

let db: Database.Database;

/** Open the database and create tables if they don't exist. Call once on startup. */
export function initDatabase(): void {
  const file = path.join(app.getPath('userData'), 'mods.db');
  db = new Database(file);
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS mods (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT    NOT NULL,
      enabled    INTEGER NOT NULL DEFAULT 1,
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

function rowToMod(row: ModRow): Mod {
  return {
    id: row.id,
    name: row.name,
    enabled: row.enabled === 1,
    createdAt: row.created_at,
  };
}

export function listMods(): Mod[] {
  const rows = db.prepare('SELECT * FROM mods ORDER BY id').all() as ModRow[];
  return rows.map(rowToMod);
}

export function getMod(id: number): Mod {
  const row = db.prepare('SELECT * FROM mods WHERE id = ?').get(id) as ModRow | undefined;
  if (!row) throw new Error(`Mod ${id} not found`);
  return rowToMod(row);
}

export function addMod(input: NewMod): Mod {
  const info = db
    .prepare('INSERT INTO mods (name, enabled) VALUES (?, ?)')
    .run(input.name, input.enabled === false ? 0 : 1);
  return getMod(Number(info.lastInsertRowid));
}

export function setModEnabled(id: number, enabled: boolean): void {
  db.prepare('UPDATE mods SET enabled = ? WHERE id = ?').run(enabled ? 1 : 0, id);
}

export function deleteMod(id: number): void {
  db.prepare('DELETE FROM mods WHERE id = ?').run(id);
}
