import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { providers } from '../providers/providers';

export const mods = sqliteTable('mods', {
  id: text('id').primaryKey().notNull(),
  rawName: text('name').notNull(),
  slug: text('slug').notNull(),
  url: text('url').notNull(),
  provider: text('provider', { enum: providers }).notNull(),
});

export type Mod = typeof mods.$inferSelect;
export type NewMod = typeof mods.$inferInsert;

export const modVersions = sqliteTable('mod_versions', {
  id: text('id').primaryKey().notNull(),
  modId: text('mod_id')
    .notNull()
    .references(() => mods.id),
  name: text('name').notNull(),
  version: text('version').notNull(),
  /** ISO 8601 date string */
  date: text('date').notNull(),
  gameVersion: text('game_version').notNull(),
  loader: text('loader').notNull(),
  downloadUrl: text('download_url').notNull(),
  fileName: text('file_name').notNull(),
  fileSize: integer('file_size').notNull(),
});

export type ModVersion = typeof modVersions.$inferSelect;
export type NewModVersion = typeof modVersions.$inferInsert;

export const modInfos = sqliteTable('mod_infos', {
  id: text('id').primaryKey().notNull(),
  modId: text('mod_id')
    .notNull()
    .references(() => mods.id)
    .unique(),
  iconUrl: text('icon_url'),
  title: text('name'),
  description: text('description'),
});

export type ModInfo = typeof modInfos.$inferSelect;
export type NewModInfo = typeof modInfos.$inferInsert;

export type FilledMod = Mod & {
  info: ModInfo | null;
  versions: ModVersion[];
};
