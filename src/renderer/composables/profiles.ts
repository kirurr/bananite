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

  async function removeModFromProfile(profileId: number, modId: string) {
    await window.api.profile.removeMod(profileId, modId);
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

  async function exportProfile(profileId: number) {
    await window.api.profile.exportProfile(profileId);
  }

  async function importProfile() {
    await window.api.profile.importProfile();
    listProfiles();
  }

  return {
    profiles,
    listProfiles,
    createProfile,
    addModToProfile,
    removeModFromProfile,
    updateProfile,
    setActive,
    setInactive,
    exportProfile,
    importProfile,
  };
}
