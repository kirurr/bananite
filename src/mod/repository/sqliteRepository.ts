import { eq } from 'drizzle-orm';
import { DB, getDb } from '../../drizzle/client';
import { Mod, mods, NewMod } from '../schema';
import { ModRepository } from './interface';

export class SQLiteModsRepository implements ModRepository {
  constructor(private readonly db: DB = getDb()) {}
  async list(): Promise<Mod[]> {
    const data = await this.db.select().from(mods).orderBy(mods.id);
    return data;
  }

  async add(mod: NewMod): Promise<Mod> {
    const data = await this.db
      .insert(mods)
      .values({ name: mod.name, enabled: mod.enabled })
      .returning();
    return data[0];
  }

  async setEnabled(id: number, enabled: boolean): Promise<void> {
    await this.db.update(mods).set({ enabled }).where(eq(mods.id, id));
  }

  async delete(id: number): Promise<void> {
    await this.db.delete(mods).where(eq(mods.id, id));
  }
}
