import { injectable } from 'inversify';
import { getDb, type DB } from '../../drizzle/client';
import {
  gameVersions,
  loaders,
  type GameVersion,
  type Loader,
  type NewGameVersion,
  type NewLoader,
} from '../schema';
import type { IGameRepository } from './interface';

@injectable()
export class SQLiteGameRepository implements IGameRepository {
  private readonly db: DB = getDb();

  async createVersion(version: NewGameVersion): Promise<void> {
    await this.db.insert(gameVersions).values(version).returning().onConflictDoNothing();
  }

  async createLoader(loader: NewLoader): Promise<void> {
    await this.db.insert(loaders).values(loader).returning().onConflictDoNothing();
  }

  async getVersions(): Promise<GameVersion[]> {
    return await this.db.select().from(gameVersions);
  }

  async getLoaders(): Promise<Loader[]> {
    return await this.db.select().from(loaders);
  }
}
