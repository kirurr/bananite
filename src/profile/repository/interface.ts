import type { NewProfile, Profile, ProfileWithMods } from '../schema';

export interface IProfileRepository {
  create(profile: NewProfile): Promise<void>;
  get(id: number): Promise<Profile | null>;
  list(): Promise<ProfileWithMods[]>;
  addMod(profileId: number, modId: string): Promise<void>;
}
