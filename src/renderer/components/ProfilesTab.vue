<script setup lang="ts">
import { useGame } from '../composables/game';
import { useMods } from '../composables/mod';
import { useProfiles } from '../composables/profiles';
import CreateProfileForm from './CreateProfileForm.vue';
import ProfileLi from './ProfileLi.vue';

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
</script>

<template>
  <div>
    <CreateProfileForm
      :loaders="loaders"
      :game-versions="versions"
      :handle-create="createProfile"
    />
    <button @click="importProfile">Import profile</button>
  </div>
  <ul>
    <ProfileLi
      v-for="profile in profiles"
      :key="profile.id"
      :profile="profile"
      :mods="mods"
      :handle-add-mod-to-profile="addModToProfile"
      :handle-remove-mod-from-profile="removeModFromProfile"
      :set-active="() => setActive(profile.id)"
      :set-inactive="() => setInactive(profile.id)"
      :export-profile="exportProfile"
    />
  </ul>
</template>
