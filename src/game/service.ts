import { inject, injectable, named } from 'inversify';
import { NAMED_CONSTANTS, TYPES } from '../types';
import type { IGameRepository } from './repository/interface';
import { type GameSettings, type GameVersion, type Loader, type NewGameSettings } from './schema';
import type { IProviderAPI } from '../providers/api/interface';
import { getProfileService } from '../container';

export interface IGameService {
  syncData(): Promise<void>;
  getVersions(): Promise<GameVersion[]>;
  getLoaders(): Promise<Loader[]>;
  getSettings(): Promise<GameSettings | null>;
  setSettings(data: NewGameSettings): Promise<void>;
}

@injectable()
export class GameService implements IGameService {
  constructor(
    @inject(TYPES.GameRepository) private readonly repo: IGameRepository,
    @inject(TYPES.ProviderAPI)
    @named(NAMED_CONSTANTS.providers.modrinth)
    private readonly api: IProviderAPI,
  ) {}

  async syncData() {
    const [versions, loaders] = await Promise.all([
      this.api.getGameVersions(),
      this.api.getGameLoaders(),
    ]);

    const result = await Promise.allSettled([
      ...versions.map((version) => this.repo.createVersion(version)),
      ...loaders.map((loader) => this.repo.createLoader(loader)),
    ]);

    result.forEach((v) => {
      if (v.status === 'rejected') {
        console.error(v.reason);
      }
    });
  }

  async getVersions(): Promise<GameVersion[]> {
    return this.repo.getVersions();
  }

  async getLoaders(): Promise<Loader[]> {
    return this.repo.getLoaders();
  }

  async getSettings(): Promise<GameSettings | null> {
    return this.repo.getGameSettings();
  }

  async setSettings(data: NewGameSettings): Promise<void> {
    const profileService = getProfileService();

    await profileService.unlinkActive();
    await this.repo.setGameSettings(data);
    await profileService.linkActive();
  }
}
