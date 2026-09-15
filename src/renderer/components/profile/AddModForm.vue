<script setup lang="ts">
import type { FilledMod } from '../../../mod/schema';
import Select from '../volt/Select.vue';
import Button from '../volt/Button.vue';
import { computed, ref } from 'vue';

const props = defineProps<{
  mods: FilledMod[];
  gameVersion: string;
  loader: string;
}>();
const emit = defineEmits<{
  submit: [modId: string, modVersionId: string];
}>();

const modId = ref<string | undefined>();
const modVersionId = ref<string | undefined>();

const filteredModVersions = computed<FilledMod['versions']>(() => {
  if (!modId.value) return [];

  const mod = props.mods.find((m) => m.id === modId.value);
  if (!mod) return [];

  const versions = mod.versions.filter(
    (v) => v.gameVersion === props.gameVersion && v.loader === props.loader,
  );
  versions.sort((a, b) => {
    const aDate = new Date(a.date);
    const bDate = new Date(b.date);
    return bDate.getTime() - aDate.getTime();
  });
  return versions;
});

function handleSubmit() {
  if (!modId.value) {
    console.error('Mod not selected');
    return;
  }

  if (!modVersionId.value) {
    console.error('Mod version not selected');
    return;
  }

  emit('submit', modId.value, modVersionId.value);
  modId.value = undefined;
  modVersionId.value = undefined;
}
</script>

<template>
  <form class="flex flex-row items-center gap-4" @submit.prevent="handleSubmit">
    <Select
      v-model="modId"
      filter
      :options="mods"
      option-label="rawName"
      option-value="id"
      placeholder="Select mod"
      show-clear
    />
    <Select
      v-model="modVersionId"
      :disabled="!modId"
      :options="filteredModVersions"
      option-label="name"
      option-value="id"
      placeholder="Select mod version"
      filter
      show-clear
    />
    <Button type="submit" label="Add" />
  </form>
</template>
