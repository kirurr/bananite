import { inject, injectable } from 'inversify';
import type { IProfileRepository } from './interface';
import {
  profileMods,
  profiles,
  type EditProfile,
  type NewProfile,
  type Profile,
  type ProfileWithMods,
} from '../schema';
import { getDb, type DB } from '../../drizzle/client';
import { and, eq } from 'drizzle-orm';
import type { IModRepository } from '../../mod/repository/interface';
import { TYPES } from '../../types';
import type { FilledMod } from '../../mod/schema';

@injectable()
export class SQLiteProfileRepository implements IProfileRepository {
  private readonly db: DB = getDb();

  constructor(@inject(TYPES.ModRepository) private readonly modsRepo: IModRepository) {}
  async create(profile: NewProfile): Promise<Profile> {
    const [row] = await this.db.insert(profiles).values(profile).returning();
    return row;
  }

  async getActive(): Promise<ProfileWithMods | null> {
    const rows = await this.db.select().from(profiles).where(eq(profiles.isActive, true));
    if (rows.length === 0) return null;
    const profile = rows[0];
    const mods = await this.modsRepo.list(profile.id);

    return {
      ...profile,
      mods,
    };
  }

  async get(id: number): Promise<ProfileWithMods | null> {
    const rows = await this.db.select().from(profiles).where(eq(profiles.id, id));
    if (rows.length === 0) return null;
    const profile = rows[0];
    const mods = await this.modsRepo.list(profile.id);

    return {
      ...profile,
      mods,
    };
  }

  async list(): Promise<ProfileWithMods[]> {
    const [profilesRows, profileModsRows, modsRows] = await Promise.all([
      this.db.select().from(profiles),
      this.db.select().from(profileMods),
      this.modsRepo.list(),
    ]);

    const modsById = new Map(modsRows.map((m) => [m.id, m]));

    const modsByProfile = new Map<number, FilledMod[]>();

    for (const pm of profileModsRows) {
      const mod = modsById.get(pm.modId);
      if (!mod) continue;

      const arr = modsByProfile.get(pm.profileId) ?? [];
      arr.push(mod);
      modsByProfile.set(pm.profileId, arr);
    }

    return profilesRows.map((profile) => ({
      ...profile,
      mods: modsByProfile.get(profile.id) ?? [],
    }));
  }

  async addMod(profileId: number, modId: string): Promise<void> {
    await this.db.insert(profileMods).values({ profileId, modId });
  }

  async removeMod(profileId: number, modId: string): Promise<void> {
    await this.db
      .delete(profileMods)
      .where(and(eq(profileMods.profileId, profileId), eq(profileMods.modId, modId)));
  }

  async edit(profileId: number, profile: EditProfile): Promise<void> {
    await this.db.update(profiles).set(profile).where(eq(profiles.id, profileId));
  }
}
