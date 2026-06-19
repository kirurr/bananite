import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { gameVersions, loaders } from '../game/schema';
import { mods } from '../mod/schema';

export const profiles = sqliteTable('profiles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: integer('name'),
  gameVersion: text('game_version').references(() => gameVersions.version),
  loader: text('loader').references(() => loaders.name),
});

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

export const profileMods = sqliteTable('profile_mods', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  profileId: integer('profile_id')
    .notNull()
    .references(() => profiles.id),
  modId: text('mod_id')
    .notNull()
    .references(() => mods.id),
});

export type ProfileMod = typeof profileMods.$inferSelect;
export type NewProfileMod = typeof profileMods.$inferInsert;

export type ProfileWithMods = Profile & {
  mods: ProfileMod[];
};
