import type { EditProfile, NewProfile, Profile, ProfileWithMods } from '../schema';

export interface IProfileRepository {
  create(profile: NewProfile): Promise<Profile>;
  getActive(): Promise<ProfileWithMods | null>;
  get(id: number): Promise<ProfileWithMods | null>;
  list(): Promise<ProfileWithMods[]>;
  addMod(profileId: number, modId: string): Promise<void>;
  removeMod(profileId: number, modId: string): Promise<void>;
  edit(id: number, profile: EditProfile): Promise<void>;
}
