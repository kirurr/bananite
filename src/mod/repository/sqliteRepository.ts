import { asc, desc, eq } from 'drizzle-orm';
import { injectable } from 'inversify';
import { type DB, getDb } from '../../drizzle/client';
import {
  type Mod,
  type ModInfo,
  type ModVersion,
  mods,
  modInfos,
  modVersions,
  type NewMod,
  type NewModInfo,
  type NewModVersion,
  type FilledMod,
} from '../schema';
import type { IModInfoRepository, IModRepository, IModVersionRepository } from './interface';

@injectable()
export class SQLiteModRepository implements IModRepository {
  private readonly db: DB = getDb();

  async getById(id: string): Promise<Mod | undefined> {
    const data = await this.db.select().from(mods).where(eq(mods.id, id)).limit(1);
    return data[0];
  }

  async list(): Promise<FilledMod[]> {
    const rows = await this.db
      .select()
      .from(mods)
      .leftJoin(modInfos, eq(mods.id, modInfos.modId))
      .leftJoin(modVersions, eq(mods.id, modVersions.modId))
			.orderBy(mods.id, desc(modVersions.date));

    const byId = new Map<string, FilledMod>();
    for (const row of rows) {
      let filled = byId.get(row.mods.id);
      if (!filled) {
        filled = { ...row.mods, info: row.mod_infos, versions: [] };
        byId.set(row.mods.id, filled);
      }
      if (row.mod_versions) filled.versions.push(row.mod_versions);
    }

    return [...byId.values()];
  }

  async add(mod: NewMod): Promise<Mod> {
    const data = await this.db.insert(mods).values(mod).returning();
    return data[0];
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(mods).where(eq(mods.id, id));
  }
}

@injectable()
export class SQLiteModInfoRepository implements IModInfoRepository {
  private readonly db: DB = getDb();

  async get(id: string): Promise<ModInfo | undefined> {
    const data = await this.db.select().from(modInfos).where(eq(modInfos.id, id)).limit(1);
    return data[0];
  }

  async list(): Promise<ModInfo[]> {
    return this.db.select().from(modInfos).orderBy(modInfos.id);
  }

  async add(modInfo: NewModInfo): Promise<ModInfo> {
    const data = await this.db.insert(modInfos).values(modInfo).returning();
    return data[0];
  }
}

@injectable()
export class SQLiteModVersionRepository implements IModVersionRepository {
  private readonly db: DB = getDb();

  async get(id: string): Promise<ModVersion | undefined> {
    const data = await this.db.select().from(modVersions).where(eq(modVersions.id, id)).limit(1);
    return data[0];
  }

  async list(): Promise<ModVersion[]> {
    return this.db.select().from(modVersions).orderBy(desc( modVersions.date ));
  }

  async add(modVersion: NewModVersion): Promise<ModVersion> {
    const data = await this.db.insert(modVersions).values(modVersion).returning();
    return data[0];
  }
}
