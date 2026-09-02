<script setup lang="ts">
import { computed, ref } from 'vue';
import type { FilledMod } from '../../../mod/schema';
import type { ProfileWithMods } from '../../../profile/schema';
import Button from '../volt/Button.vue';
import Select from '../volt/Select.vue';

const props = defineProps<{
  profile: ProfileWithMods;
  mods: FilledMod[];
  handleAddModToProfile: (profileId: number, modId: string) => Promise<void>;
  handleRemoveModFromProfile: (profileId: number, modId: string) => Promise<void>;
  setActive: () => Promise<void>;
  setInactive: () => Promise<void>;
  exportProfile: (profileId: number) => Promise<void>;
}>();

const filteredMods = computed(() => {
  return props.mods
    .filter((m) => !props.profile.mods.some((pm) => pm.id === m.id))
    .filter((m) => m.versions.some((mv) => mv.gameVersion === props.profile.gameVersion))
    .filter((m) => m.versions.some((mv) => mv.loader === props.profile.loader));
});

const selectedModId = ref<string | undefined>(undefined);

async function handleSubmit() {
  if (!selectedModId.value) {
    console.error('Mod not selected');
    return;
  }

  await props.handleAddModToProfile(props.profile.id, selectedModId.value);
}
</script>
<template>
  <li>
    <div>
      <span>{{ profile.name }} - {{ profile.gameVersion }} - {{ profile.loader }}</span>
      <ul>
        <li v-if="profile.mods.length === 0">No mods</li>
        <li v-for="mod in profile.mods" :key="mod.id">
          {{ mod.rawName }}
          <Button label="Remove" @click="handleRemoveModFromProfile(profile.id, mod.id)" />
        </li>
      </ul>
      <div>
        <form @submit.prevent="handleSubmit">
          <Select
            v-model="selectedModId"
            :options="filteredMods"
            option-label="rawName"
            option-value="id"
            placeholder="Select mod"
            show-clear
          />
          <Button type="submit" label="Add" />
        </form>
      </div>
      <template v-if="profile.isActive">
        <Button label="Set inactive" @click="setInactive" />
      </template>
      <template v-else>
        <Button label="Set active" @click="setActive" />
      </template>
      <Button label="Export" @click="exportProfile(profile.id)" />
    </div>
  </li>
</template>
