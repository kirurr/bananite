import { injectable } from 'inversify';
import type { IProfileRepository } from './interface';
import { profileMods, profiles, type NewProfile, type ProfileWithMods } from '../schema';
import { getDb, type DB } from '../../drizzle/client';
import { eq } from 'drizzle-orm';

@injectable()
export class SQLiteProfileRepository implements IProfileRepository {
  private readonly db: DB = getDb();

  async create(profile: NewProfile): Promise<void> {
    await this.db.insert(profiles).values(profile);
  }

  async get(id: number): Promise<ProfileWithMods | null> {
    const data = await this.db
      .select()
      .from(profiles)
      .leftJoin(profileMods, eq(profileMods.profileId, profiles.id))
      .where(eq(profiles.id, id));
    if (data.length === 0) return null;

    const byId = new Map<number, ProfileWithMods>();
    for (const row of data) {
      let filled = byId.get(row.profiles.id);
      if (!filled) {
        filled = { ...row.profiles, mods: [] };
        byId.set(row.profiles.id, filled);
      }
      if (row.profile_mods) filled.mods.push(row.profile_mods);
    }

    return [...byId.values()][0];
  }

  async list(): Promise<ProfileWithMods[]> {
    const data = await this.db
      .select()
      .from(profiles)
      .leftJoin(profileMods, eq(profileMods.profileId, profiles.id));

    const byId = new Map<number, ProfileWithMods>();
    for (const row of data) {
      let filled = byId.get(row.profiles.id);
      if (!filled) {
        filled = { ...row.profiles, mods: [] };
        byId.set(row.profiles.id, filled);
      }
      if (row.profile_mods) filled.mods.push(row.profile_mods);
    }

    return [...byId.values()];
  }

  async addMod(profileId: number, modId: string): Promise<void> {
    await this.db.insert(profileMods).values({ profileId, modId });
  }
}
