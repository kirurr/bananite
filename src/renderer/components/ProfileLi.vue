<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ProfileWithMods } from '../../profile/schema';
import type { FilledMod } from '../../mod/schema';
import Button from './volt/Button.vue';

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

function handleSubmit() {
  if (!selectedModId.value) return console.error('Mod not selected');

  props.handleAddModToProfile(props.profile.id, selectedModId.value);
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
          <Button
						label="Remove"
						@click="handleRemoveModFromProfile(profile.id, mod.id)"
					/>
        </li>
      </ul>
      <div>
        <form @submit.prevent="handleSubmit">
          <select v-model="selectedModId" placeholder="Select mod">
            <option :value="undefined">No mod selected</option>
            <option v-for="mod in filteredMods" :key="mod.id" :value="mod.id">
              {{ mod.rawName }}
            </option>
          </select>
          <button type="submit">Add</button>
        </form>
      </div>
      <template v-if="profile.isActive">
        <button @click="setInactive">Set inactive</button>
      </template>
      <template v-else>
        <button @click="setActive">Set active</button>
      </template>
      <button @click="exportProfile(profile.id)">Export</button>
    </div>
  </li>
</template>
