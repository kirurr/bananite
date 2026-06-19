import type { GameVersion, Loader, NewGameVersion, NewLoader } from '../schema';

export interface IGameRepository {
  getVersions(): Promise<GameVersion[]>;
  createVersion(version: NewGameVersion): Promise<void>;
  getLoaders(): Promise<Loader[]>;
  createLoader(loader: NewLoader): Promise<void>;
}
