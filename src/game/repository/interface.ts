import type {
  GameVersion,
  Loader,
  NewGameVersion,
  NewLoader,
  GameSettings,
  NewGameSettings,
} from '../schema';

export interface IGameRepository {
  getVersions(): Promise<GameVersion[]>;
  createVersion(version: NewGameVersion): Promise<void>;
  getLoaders(): Promise<Loader[]>;
  createLoader(loader: NewLoader): Promise<void>;
  getGameSettings(): Promise<GameSettings | null>;
  createGameSettings(data: NewGameSettings): Promise<void>;
}
