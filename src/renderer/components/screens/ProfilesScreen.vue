<script setup lang="ts">
import { useGame } from '../../composables/game';
import { useMods } from '../../composables/mod';
import { useProfiles } from '../../composables/profiles';
import CreateProfileForm from '../profile/CreateProfileForm.vue';
import ProfileAccordionPanel from '../profile/ProfileAccordionPanel.vue';
import Button from '../volt/Button.vue';
import Accordion from '../volt/Accordion.vue';
import { computed } from 'vue';
import { handleErrorToast, TOAST_TIMEOUT_MS } from '../../composables/toast';
import { useToast } from 'primevue/usetoast';
import type { NewProfile } from '../../../profile/schema';

const { loaders, versions } = useGame();
const { mods } = useMods();

const {
  profiles,
  createProfile,
  addModToProfile,
  removeModFromProfile,
  setActive,
  setInactive,
  exportProfile,
  importProfile,
} = useProfiles();

const activeProfileId = computed(() => profiles.value.find((p) => p.isActive)?.id);

const toast = useToast();

async function handleSetActive(profileId: number) {
  try {
    await setActive(profileId);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Profile set active',
      life: TOAST_TIMEOUT_MS,
    });
  } catch (e) {
    handleErrorToast(toast, e);
  }
}

async function handleSetInactive(profileId: number) {
  try {
    await setInactive(profileId);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Profile set inactive',
      life: TOAST_TIMEOUT_MS,
    });
  } catch (e) {
    handleErrorToast(toast, e);
  }
}

async function handleExportProfile(profileId: number) {
  try {
    await exportProfile(profileId);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Profile exported',
      life: TOAST_TIMEOUT_MS,
    });
  } catch (e) {
    handleErrorToast(toast, e);
  }
}

async function handleAddModToProfile(profileId: number, modId: string) {
  try {
    await addModToProfile(profileId, modId);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Mod added to profile',
      life: TOAST_TIMEOUT_MS,
    });
  } catch (e) {
    handleErrorToast(toast, e);
  }
}

async function handleRemoveModFromProfile(profileId: number, modId: string) {
  try {
    await removeModFromProfile(profileId, modId);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Mod removed from profile',
      life: TOAST_TIMEOUT_MS,
    });
  } catch (e) {
    handleErrorToast(toast, e);
  }
}

async function handleCreateProfile(profile: NewProfile) {
  try {
    await createProfile(profile);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Profile created',
      life: TOAST_TIMEOUT_MS,
    });
  } catch (e) {
    handleErrorToast(toast, e);
  }
}

async function handleImportProfile() {
  try {
    await importProfile();
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Profile imported',
      life: TOAST_TIMEOUT_MS,
    });
  } catch (e) {
    handleErrorToast(toast, e);
  }
}
</script>

<template>
  <div class="flex flex-row gap-4">
    <CreateProfileForm
      :loaders="loaders"
      :game-versions="versions"
      :handle-create="handleCreateProfile"
    />
    <Button @click="handleImportProfile">Import profile</Button>
  </div>
  <Accordion :value="['0']" multiple>
    <ProfileAccordionPanel
      v-for="profile in profiles"
      :key="profile.id"
      :accordion-value="profile.id.toString()"
      :profile="profile"
      :mods="mods"
      :handle-add-mod-to-profile="(modId: string) => handleAddModToProfile(profile.id, modId)"
      :handle-remove-mod-from-profile="
        (modId: string) => handleRemoveModFromProfile(profile.id, modId)
      "
      :set-active="() => handleSetActive(profile.id)"
      :set-inactive="() => handleSetInactive(profile.id)"
      :export-profile="() => handleExportProfile(profile.id)"
      :active-profile-id="activeProfileId"
    />
  </Accordion>
</template>
