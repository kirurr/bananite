import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

const gameVersionTypes = ['snapshot', 'release'] as const;

export const gameVersions = sqliteTable('game_versions', {
  version: text('version').notNull().primaryKey(),
  type: text('type', { enum: gameVersionTypes }).notNull(),
});

export type GameVersion = typeof gameVersions.$inferSelect;

export const newGameVersionSchema = createInsertSchema(gameVersions);
export type NewGameVersion = z.infer<typeof newGameVersionSchema>;

export const loaders = sqliteTable('loaders', {
  name: text('name').notNull().primaryKey(),
  /** svg format from modrinth */
  icon: text('icon').notNull(),
});

export type Loader = typeof loaders.$inferSelect;

export const newLoaderSchema = createInsertSchema(loaders);
export type NewLoader = z.infer<typeof newLoaderSchema>;

export const gameSettings = sqliteTable('game_settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  gamePath: text('game_path').notNull(),
  downloadPath: text('download_path').notNull(),
});

export type GameSettings = typeof gameSettings.$inferSelect;
export type NewGameSettings = typeof gameSettings.$inferInsert;
