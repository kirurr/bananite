import { inject, injectable } from 'inversify';
import type { EditProfile, NewProfile, Profile, ProfileExport, ProfileWithMods } from './schema';
import { profileExportSchema } from './schema';
import { TYPES } from '../types';
import type { IProfileRepository } from './repository/interface';
import type { IModRepository } from '../mod/repository/interface';
import type { FilledMod, ModVersion } from '../mod/schema';
import { getLinker, getModProvider } from '../container';

export interface IProfileService {
  create(profile: NewProfile): Promise<void>;
  get(id: number): Promise<Profile | null>;
  list(): Promise<ProfileWithMods[]>;
  addMod(profileId: number, modId: string, modVersion: string): Promise<void>;
  removeMod(profileId: number, modId: string): Promise<void>;
  update(profileId: number, data: EditProfile): Promise<void>;
  unlinkActive(): Promise<void>;
  linkActive(): Promise<void>;
  getProfileJSON(profileId: number): Promise<string>;
  createProfileByJSON(json: string): Promise<void>;
}

@injectable()
export class ProfileService implements IProfileService {
  private readonly profileRepository: IProfileRepository;
  private readonly modsRepository: IModRepository;
  constructor(
    @inject(TYPES.ProfileRepository) repo: IProfileRepository,
    @inject(TYPES.ModRepository) modsRepo: IModRepository,
  ) {
    this.profileRepository = repo;
    this.modsRepository = modsRepo;
  }

  async create(profile: NewProfile): Promise<void> {
    await this.profileRepository.create(profile);
  }

  async get(id: number): Promise<Profile | null> {
    return await this.profileRepository.get(id);
  }

  async list(): Promise<ProfileWithMods[]> {
    return this.profileRepository.list();
  }

  async addMod(profileId: number, modId: string, modVersionId: string): Promise<void> {
    const { profile, mod } = await this.resolveModContext(profileId, modId);

    await this.profileRepository.addMod(profileId, modId, modVersionId);

    const provider = getModProvider(mod.provider);
    await provider.downloadMod(mod, modVersionId);

    if (!profile.isActive) return;

    const modVersion = mod.versions.find((v) => v.id === modVersionId);
    if (!modVersion) {
      console.error(`failed to link mod: ${mod.rawName} - Mod version not found`);
      return;
    }

    await getLinker().createLink(modVersion.fileName);
  }

  async removeMod(profileId: number, modId: string): Promise<void> {
    const { profile, mod } = await this.resolveModContext(profileId, modId);

    await this.profileRepository.removeMod(profileId, modId);

    const modVersion = this.findSelectedModVersion(mod, profile);
    if (!modVersion) throw new Error('Mod version not found');

    await getLinker().deleteLink(modVersion.fileName);
  }

  async update(profileId: number, data: EditProfile): Promise<void> {
    const profile = await this.profileRepository.get(profileId);
    if (!profile) throw new Error('Profile not found');

    await this.profileRepository.edit(profileId, data);

    if (data.isActive === true) await this.setActive(profile);
    else if (data.isActive === false) await this.setInactive(profile);
  }

  async unlinkActive(): Promise<void> {
    const profile = await this.profileRepository.getActive();
    if (!profile) return;
    await this.setInactive(profile);
  }

  async linkActive(): Promise<void> {
    const profile = await this.profileRepository.getActive();
    if (!profile) return;
    await this.setActive(profile);
  }

  private async resolveModContext(profileId: number, modId: string) {
    const [profile, mod] = await Promise.all([
      this.profileRepository.get(profileId),
      this.modsRepository.getById(modId),
    ]);
    if (!profile || !mod) throw new Error('Profile or mod not found');

    return { profile, mod };
  }

  private findSelectedModVersion(mod: FilledMod, profile: ProfileWithMods): ModVersion | undefined {
    const selectedMod = profile.mods.find((m) => m.id === mod.id);
    if (!selectedMod) throw new Error('Failed to find selected mod version: Mod version not found');

    return mod.versions.find((v) => v.id === selectedMod.selectedVersionId);
  }

  private async setActive(profile: ProfileWithMods): Promise<void> {
    const linker = getLinker();
    await Promise.all(
      profile.mods.flatMap((mod) => {
        const modVersion = this.findSelectedModVersion(mod, profile);
        if (!modVersion) {
          console.error(`Failed to link mod: ${mod.rawName} - Mod version not found`);
          return [];
        }

        return [linker.createLink(modVersion.fileName)];
      }),
    );
  }

  private async setInactive(profile: ProfileWithMods): Promise<void> {
    const linker = getLinker();
    await Promise.all(
      profile.mods.flatMap((mod) => {
        const modVersion = this.findSelectedModVersion(mod, profile);
        if (!modVersion) {
          console.error(`Failed to unlink mod: ${mod.rawName} - Mod version not found`);
          return [];
        }

        return [linker.deleteLink(modVersion.fileName)];
      }),
    );
  }

  async getProfileJSON(profileId: number): Promise<string> {
    const profile = await this.profileRepository.get(profileId);
    if (!profile) throw new Error('Profile not found');

    if (!profile.gameVersion) throw new Error('Game version not found');
    if (!profile.loader) throw new Error('Loader not found');

    const toExport: ProfileExport = {
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
        versionId: mod.selectedVersionId,
      })),
    };
    const data = profileExportSchema.parse(toExport);

    return JSON.stringify(data, null, 2);
  }

  async createProfileByJSON(json: string): Promise<void> {
    const data = profileExportSchema.parse(JSON.parse(json));

    const created = await this.profileRepository.create(data.profile);

    for (const mod of data.mods) {
      try {
        const existing = await this.modsRepository.getById(mod.id);
        if (!existing) await getModProvider(mod.provider).addModByLink(mod.url);
        await this.addMod(created.id, mod.id, mod.versionId);
      } catch (e) {
        console.error(`Failed to import mod: ${mod.id}`);
        console.error(e);
      }
    }
  }
}
