import type { EditProfile, NewProfile, Profile, ProfileWithMods } from "./schema";

export const channel = {
	CreateProfile: 'profile:create-profile',
	GetProfile: 'profile:get-profile',
	ListProfiles: 'profile:list-profiles',
	AddModToProfile: 'profile:add-mod-to-profile',
	UpdateProfile: 'profile:update-profile',
} as const;

export type Api = {
	create(profile: NewProfile): Promise<void>;
	get(id: number): Promise<Profile | null>;
	list(): Promise<ProfileWithMods[]>;
	addMod(profileId: number, modId: string): Promise<void>;
	update(profileId: number, data: EditProfile): Promise<void>;
};
