import { inject, injectable } from 'inversify';
import type { EditProfile, NewProfile, Profile, ProfileWithMods } from './schema';
import { profileExportSchema } from './schema';
import { TYPES } from '../types';
import type { IProfileRepository } from './repository/interface';
import type { IModRepository } from '../mod/repository/interface';
import type { FilledMod, ModVersion } from '../mod/schema';
import { getLinker, getModProvider } from '../container';
import type { IGameService } from '../game/service';

export interface IProfileService {
  create(profile: NewProfile): Promise<void>;
  get(id: number): Promise<Profile | null>;
  list(): Promise<ProfileWithMods[]>;
  addMod(profileId: number, modId: string): Promise<void>;
  removeMod(profileId: number, modId: string): Promise<void>;
  update(profileId: number, data: EditProfile): Promise<void>;
  unlinkActive(): Promise<void>;
  linkActive(): Promise<void>;
  getProfileJSON(profileId: number): Promise<string>;
  createProfileByJSON(json: string): Promise<void>;
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
    await this.repo.create(profile);
  }

  async get(id: number): Promise<Profile | null> {
    return await this.repo.get(id);
  }

  async list(): Promise<ProfileWithMods[]> {
    return this.repo.list();
  }

  async addMod(profileId: number, modId: string): Promise<void> {
    const { profile, mod, gameVersion, loader } = await this.resolveModContext(profileId, modId);

    await this.repo.addMod(profileId, modId);

    const provider = getModProvider(mod.provider);
    await provider.downloadMod(mod, gameVersion, loader);

    if (!profile.isActive) return;

    const modVersion = this.findModVersion(mod, profile);
    if (!modVersion) {
      console.error(`failed to link mod: ${mod.rawName} - Mod version not found`);
      return;
    }

    await getLinker().createLink(modVersion.fileName);
  }

  async removeMod(profileId: number, modId: string): Promise<void> {
    const { profile, mod } = await this.resolveModContext(profileId, modId);

    await this.repo.removeMod(profileId, modId);

    const modVersion = this.findModVersion(mod, profile);
    if (!modVersion) throw new Error('Mod version not found');

    await getLinker().deleteLink(modVersion.fileName);
  }

  async update(profileId: number, data: EditProfile): Promise<void> {
    const profile = await this.repo.get(profileId);
    if (!profile) throw new Error('Profile not found');

    await this.repo.edit(profileId, data);

    if (data.isActive === true) await this.setActive(profile);
    else if (data.isActive === false) await this.setInactive(profile);
  }

  async unlinkActive(): Promise<void> {
    const profile = await this.repo.getActive();
    if (!profile) return;
    await this.setInactive(profile);
  }

  async linkActive(): Promise<void> {
    const profile = await this.repo.getActive();
    if (!profile) return;
    await this.setActive(profile);
  }

  private async resolveModContext(profileId: number, modId: string) {
    const [profile, mod] = await Promise.all([
      this.repo.get(profileId),
      this.modsRepo.getById(modId),
    ]);
    if (!profile || !mod) throw new Error('Profile or mod not found');

    const [gameVersions, loaders] = await Promise.all([
      this.gameSerivce.getVersions(),
      this.gameSerivce.getLoaders(),
    ]);

    const gameVersion = gameVersions.find((v) => v.version === profile.gameVersion);
    if (!gameVersion) throw new Error('Game version not found');
    const loader = loaders.find((l) => l.name === profile.loader);
    if (!loader) throw new Error('Loader not found');

    return { profile, mod, gameVersion, loader };
  }

  private findModVersion(mod: FilledMod, profile: Profile): ModVersion | undefined {
    return mod.versions.find(
      (v) => v.gameVersion === profile.gameVersion && v.loader === profile.loader,
    );
  }

  private async setActive(profile: ProfileWithMods): Promise<void> {
    const linker = getLinker();
    await Promise.all(
      profile.mods
        .map((mod) => {
          const modVersion = this.findModVersion(mod, profile);
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
          const modVersion = this.findModVersion(mod, profile);
          if (!modVersion) {
            console.error(`failed to unlink mod: ${mod.rawName} - Mod version not found`);
            return null;
          }

          return linker.deleteLink(modVersion.fileName);
        })
        .filter(Boolean),
    );
  }

  async getProfileJSON(profileId: number): Promise<string> {
    const profile = await this.repo.get(profileId);
    if (!profile) throw new Error('Profile not found');

    const data = profileExportSchema.parse({
      version: 1,
      profile: {
        name: profile.name,
        gameVersion: profile.gameVersion,
        loader: profile.loader,
      },
      mods: profile.mods.map((mod) => ({
        id: mod.id,
        provider: mod.provider,
        url: mod.url,
      })),
    });

    return JSON.stringify(data, null, 2);
  }

  async createProfileByJSON(json: string): Promise<void> {
    const data = profileExportSchema.parse(JSON.parse(json));

    const created = await this.repo.create(data.profile);

    for (const mod of data.mods) {
      try {
        const existing = await this.modsRepo.getById(mod.id);
        if (!existing) await getModProvider(mod.provider).addModByLink(mod.url);
        await this.addMod(created.id, mod.id);
      } catch (e) {
        console.error(`failed to import mod: ${mod.id}`);
        console.error(e);
      }
    }
  }
}
