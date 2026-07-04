import { inject, injectable } from 'inversify';
import type { EditProfile, NewProfile, Profile, ProfileWithMods } from './schema';
import { TYPES } from '../types';
import type { IProfileRepository } from './repository/interface';
import type { IModRepository } from '../mod/repository/interface';
import { getLinker, getModProvider } from '../container';
import type { IGameService } from '../game/service';

export interface IProfileService {
  create(profile: NewProfile): Promise<void>;
  get(id: number): Promise<Profile | null>;
  list(): Promise<ProfileWithMods[]>;
  addMod(profileId: number, modId: string): Promise<void>;
  update(profileId: number, data: EditProfile): Promise<void>;
}

@injectable()
export class ProfileService implements IProfileService {
  private readonly repo: IProfileRepository;
  private readonly modsRepo: IModRepository;
  private readonly gameSerivce: IGameService;
  constructor(
    @inject(TYPES.ProfileRepository) repo: IProfileRepository,
    @inject(TYPES.ModRepository) modsRepo: IModRepository,
    @inject(TYPES.GameService) gameSerivce: IGameService,
  ) {
    this.repo = repo;
    this.modsRepo = modsRepo;
    this.gameSerivce = gameSerivce;
  }

  async create(profile: NewProfile): Promise<void> {
    return await this.repo.create(profile);
  }

  async get(id: number): Promise<Profile | null> {
    return await this.repo.get(id);
  }

  async list(): Promise<ProfileWithMods[]> {
    return this.repo.list();
  }

  async addMod(profileId: number, modId: string): Promise<void> {
    const [profile, mod] = await Promise.all([
      this.repo.get(profileId),
      this.modsRepo.getById(modId),
    ]);
    if (!profile || !mod) throw new Error('Failed to add mod to profile: Profile or mod not found');

    await this.repo.addMod(profileId, modId);

    const provider = getModProvider(mod.provider);

    const [gameVersions, loaders] = await Promise.all([
      this.gameSerivce.getVersions(),
      this.gameSerivce.getLoaders(),
    ]);

    const gameVersion = gameVersions.find((v) => v.version === profile.gameVersion);
    if (!gameVersion) throw new Error('Game version not found');
    const loader = loaders.find((l) => l.name === profile.loader);
    if (!loader) throw new Error('Loader not found');

    await provider.downloadMod(mod, gameVersion, loader);

    if (!profile.isActive) return;

    const linker = getLinker();
    const modVersion = mod.versions.find(
      (v) => v.gameVersion === profile.gameVersion && v.loader === profile.loader,
    );

    if (!modVersion) {
      console.error(`failed to link mod: ${mod.rawName} - Mod version not found`);
      return;
    }

    await linker.createLink(modVersion.fileName);
  }

  async update(profileId: number, data: EditProfile): Promise<void> {
    const profile = await this.repo.get(profileId);
    if (!profile) throw new Error('Profile not found');

    await this.repo.edit(profileId, data);

    if (data.isActive === true) await this.setActive(profile);
    else if (data.isActive === false) await this.setInactive(profile);
  }

  private async setActive(profile: ProfileWithMods): Promise<void> {
    const linker = getLinker();
    await Promise.all(
      profile.mods
        .map((mod) => {
          const modVersion = mod.versions.find(
            (v) => v.gameVersion === profile.gameVersion && v.loader === profile.loader,
          );

          if (!modVersion) {
            console.error(`failed to link mod: ${mod.rawName} - Mod version not found`);
            return null;
          }

          return linker.createLink(modVersion.fileName);
        })
        .filter(Boolean),
    );
  }

  private async setInactive(profile: ProfileWithMods): Promise<void> {
    const linker = getLinker();
    await Promise.all(
      profile.mods
        .map((mod) => {
          const modVersion = mod.versions.find(
            (v) => v.gameVersion === profile.gameVersion && v.loader === profile.loader,
          );

          if (!modVersion) {
            console.error(`failed to unlink mod: ${mod.rawName} - Mod version not found`);
            return null;
          }

          return linker.deleteLink(modVersion.fileName);
        })
        .filter(Boolean),
    );
  }
}
