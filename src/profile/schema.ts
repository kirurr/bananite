import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { gameVersions, loaders } from '../game/schema';
import { mods, type FilledMod } from '../mod/schema';
import { providers } from '../providers/providers';
import z from 'zod';

export const profiles = sqliteTable('profiles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  gameVersion: text('game_version').references(() => gameVersions.version),
  loader: text('loader').references(() => loaders.name),
  isActive: integer('is_active', { mode: 'boolean' }).default(false).unique(),
});

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type EditProfile = Partial<Omit<NewProfile, 'id'>>;

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
  mods: FilledMod[];
};

export const profileJSONSchema = z.object({
  name: z.string(),
  gameVersion: z.string(),
  loader: z.string(),
});

export const profileExportModSchema = z.object({
  id: z.string(),
  provider: z.enum(providers),
  url: z.url(),
});

export const profileExportSchema = z.object({
  version: z.literal(1),
  profile: profileJSONSchema,
  mods: z.array(profileExportModSchema),
});

export type ProfileExport = z.infer<typeof profileExportSchema>;
