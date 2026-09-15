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
import { firstOrThrow } from '../../shared/array';

@injectable()
export class SQLiteProfileRepository implements IProfileRepository {
  private readonly db: DB = getDb();

  constructor(@inject(TYPES.ModRepository) private readonly modsRepo: IModRepository) {}
  async create(profile: NewProfile): Promise<Profile> {
    const rows = await this.db.insert(profiles).values(profile).returning();
    return firstOrThrow(rows, 'insert into profiles returned no rows');
  }

  async getActive(): Promise<ProfileWithMods | null> {
    const [activeProfile] = await this.db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.isActive, true));
    if (!activeProfile) return null;

    return await this.get(activeProfile.id);
  }

  async get(id: number): Promise<ProfileWithMods | null> {
    const [profile] = await this.db.select().from(profiles).where(eq(profiles.id, id));
    if (!profile) return null;
    const pMods = await this.db
      .select()
      .from(profileMods)
      .where(eq(profileMods.profileId, profile.id));
    const mods = await this.modsRepo.list(profile.id);

    return {
      ...profile,
      mods: mods.map((mod) => {
        const profileMod = pMods.find((pm) => pm.modId === mod.id);
        if (!profileMod) throw new Error('Mod version not found');
        return { ...mod, selectedVersionId: profileMod.modVersionId };
      }),
    };
  }

  async list(): Promise<ProfileWithMods[]> {
    const [profilesRows, profileModsRows, modsRows] = await Promise.all([
      this.db.select().from(profiles),
      this.db.select().from(profileMods),
      this.modsRepo.list(),
    ]);

    const modsById = new Map(modsRows.map((m) => [m.id, m]));

    const modsByProfile = new Map<number, (FilledMod & { selectedVersionId: string })[]>();

    for (const pm of profileModsRows) {
      const mod = modsById.get(pm.modId);
      if (!mod) continue;

      const modVersion = mod.versions.find((v) => v.id === pm.modVersionId);
      if (!modVersion) throw new Error('Mod version not found');
      const arr = modsByProfile.get(pm.profileId) ?? [];
      arr.push({ ...mod, selectedVersionId: pm.modVersionId });
      modsByProfile.set(pm.profileId, arr);
    }

    return profilesRows.map((profile) => ({
      ...profile,
      mods: modsByProfile.get(profile.id) ?? [],
    }));
  }

  async addMod(profileId: number, modId: string, modVersionId: string): Promise<void> {
    await this.db.insert(profileMods).values({ profileId, modId, modVersionId });
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
