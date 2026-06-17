import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const mods = sqliteTable('mods', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  // `boolean` mode stores 0/1 in SQLite but reads/writes JS booleans for us.
  enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});

export type Mod = typeof mods.$inferSelect;
export type NewMod = typeof mods.$inferInsert;
