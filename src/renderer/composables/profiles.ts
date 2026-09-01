import { ref } from 'vue';
import type { EditProfile, NewProfile, ProfileWithMods } from '../../profile/schema';
const profiles = ref<ProfileWithMods[]>([]);

void listProfiles();

async function listProfiles() {
  const result = await window.api.profile.list();
  profiles.value = result;
}

async function createProfile(profile: NewProfile) {
  await window.api.profile.create(profile);
  await listProfiles();
}

async function addModToProfile(profileId: number, modId: string) {
  await window.api.profile.addMod(profileId, modId);
  await listProfiles();
}

async function removeModFromProfile(profileId: number, modId: string) {
  await window.api.profile.removeMod(profileId, modId);
  await listProfiles();
}

async function updateProfile(profileId: number, data: EditProfile) {
  await window.api.profile.update(profileId, data);
  await listProfiles();
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
  await listProfiles();
}

export function useProfiles() {
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
