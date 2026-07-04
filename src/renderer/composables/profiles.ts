import { ref } from 'vue';
import type { EditProfile, NewProfile, ProfileWithMods } from '../../profile/schema';

export function useProfiles() {
  const profiles = ref<ProfileWithMods[]>([]);

  listProfiles();

  async function listProfiles() {
    const result = await window.api.profile.list();
    profiles.value = result;
  }

  async function createProfile(profile: NewProfile) {
    await window.api.profile.create(profile);
    listProfiles();
  }

  async function addModToProfile(profileId: number, modId: string) {
    await window.api.profile.addMod(profileId, modId);
    listProfiles();
  }

  async function updateProfile(profileId: number, data: EditProfile) {
    await window.api.profile.update(profileId, data);
    listProfiles();
  }

  async function setActive(profileId: number) {
    await updateProfile(profileId, { isActive: true });
  }

  async function setInactive(profileId: number) {
    await updateProfile(profileId, { isActive: false });
  }

  return {
    profiles,
    listProfiles,
    createProfile,
    addModToProfile,
    updateProfile,
    setActive,
    setInactive,
  };
}
