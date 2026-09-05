<script setup lang="ts">
import { useGame } from '../../composables/game';
import { useMods } from '../../composables/mod';
import { useProfiles } from '../../composables/profiles';
import CreateProfileForm from '../profile/CreateProfileForm.vue';
import ProfileAccordionPanel from '../profile/ProfileAccordionPanel.vue';
import Button from '../volt/Button.vue';
import Accordion from '../volt/Accordion.vue';
import { computed } from 'vue';

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
</script>

<template>
  <div class="flex flex-row gap-4">
    <CreateProfileForm
      :loaders="loaders"
      :game-versions="versions"
      :handle-create="createProfile"
    />
    <Button @click="importProfile">Import profile</Button>
  </div>
  <Accordion :value="['0']" multiple>
    <ProfileAccordionPanel
      v-for="profile in profiles"
      :key="profile.id"
      :accordion-value="profile.id.toString()"
      :profile="profile"
      :mods="mods"
      :handle-add-mod-to-profile="addModToProfile"
      :handle-remove-mod-from-profile="removeModFromProfile"
      :set-active="() => setActive(profile.id)"
      :set-inactive="() => setInactive(profile.id)"
      :export-profile="exportProfile"
      :active-profile-id="activeProfileId"
    />
  </Accordion>
</template>
