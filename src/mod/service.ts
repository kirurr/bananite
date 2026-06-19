import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import type { IModRepository, IModInfoRepository, IModVersionRepository } from './repository/interface';
import type { NewMod, NewModInfo, NewModVersion, Mod } from './schema';

export interface IModService {
  createMod(mod: NewMod, modInfo: NewModInfo, modVersions: NewModVersion[]): Promise<Mod>;
}

@injectable()
export class ModService implements IModService {
  private readonly repo: IModRepository;
  private readonly infoRepo: IModInfoRepository;
  private readonly versionRepo: IModVersionRepository;

  constructor(
    @inject(TYPES.ModRepository) repo: IModRepository,
    @inject(TYPES.ModInfoRepository) infoRepo: IModInfoRepository,
    @inject(TYPES.ModVersionRepository) versionRepo: IModVersionRepository,
  ) {
    this.repo = repo;
    this.infoRepo = infoRepo;
    this.versionRepo = versionRepo;
  }

  async createMod(mod: NewMod, modInfo: NewModInfo, modVersions: NewModVersion[]): Promise<Mod> {
    try {
      const oldMod = await this.repo.getById(mod.id);
      if (oldMod) throw new Error('Mod already exists');
      const newMod = await this.repo.add(mod);

      await this.infoRepo.add(modInfo);

      await Promise.all(
        modVersions.map(async (modVersion) => {
          const newModVersion = await this.versionRepo.add(modVersion);
          newModVersion.modId = newMod.id;
        }),
      );
      return newMod;
    } catch (e) {
      console.error('failed to create mod');
      console.error(e);
      throw e;
    }
  }
}
