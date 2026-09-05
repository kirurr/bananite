<script setup lang="ts">
import { computed, ref } from 'vue';
import type { FilledMod } from '../../../mod/schema';
import type { ProfileWithMods } from '../../../profile/schema';
import Button from '../volt/Button.vue';
import Select from '../volt/Select.vue';
import AccordionPanel from '../volt/AccordionPanel.vue';
import AccordionHeader from '../volt/AccordionHeader.vue';
import AccordionContent from '../volt/AccordionContent.vue';
import ProfileModsDataTable from './ProfileModsDataTable.vue';

const props = defineProps<{
  profile: ProfileWithMods;
  mods: FilledMod[];
  handleAddModToProfile: (modId: string) => Promise<void>;
  handleRemoveModFromProfile: (modId: string) => Promise<void>;
  setActive: () => Promise<void>;
  setInactive: () => Promise<void>;
  exportProfile: () => Promise<void>;
  accordionValue: string;
  activeProfileId: number | undefined;
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

  await props.handleAddModToProfile(selectedModId.value);
  selectedModId.value = undefined;
}
</script>
<template>
  <AccordionPanel :value="props.accordionValue">
    <AccordionHeader>
      <div class="flex flex-row items-center gap-4">
        <span>{{ profile.name }} - {{ profile.gameVersion }} - {{ profile.loader }}</span>
        <template v-if="profile.isActive">
          <Button label="Set inactive" @click.stop="setInactive" />
        </template>
        <template v-else>
          <Button
            label="Set active"
            :disabled="props.activeProfileId !== undefined"
            @click.stop="setActive"
          />
        </template>
        <Button label="Export" @click="exportProfile" />
      </div>
    </AccordionHeader>
    <AccordionContent>
      <div class="space-y-4">
        <form class="flex flex-row items-center gap-4" @submit.prevent="handleSubmit">
          <Select
            v-model="selectedModId"
            filter
            :options="filteredMods"
            option-label="rawName"
            option-value="id"
            placeholder="Select mod"
            show-clear
          />
          <Button type="submit" label="Add" />
        </form>
        <ProfileModsDataTable
          :mods="profile.mods"
          :handle-remove-mod-from-profile="(modId: string) => handleRemoveModFromProfile(modId)"
        />
      </div>
    </AccordionContent>
  </AccordionPanel>
</template>
