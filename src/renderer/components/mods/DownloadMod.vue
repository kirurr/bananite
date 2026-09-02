<script setup lang="ts">
import { computed, ref, toRaw } from 'vue';
import type { GameVersion, Loader } from '../../../game/schema';
import type { FilledMod } from '../../../mod/schema';
import Button from '../volt/Button.vue';
import Select from '../volt/Select.vue';

const props = defineProps<{
  mods: FilledMod[];
  versions: GameVersion[];
  loaders: Loader[];
  handleDownload: (mod: FilledMod, version: GameVersion, loader: Loader) => Promise<void>;
}>();

const modId = ref<string | undefined>(undefined);
const versionId = ref<string | undefined>(undefined);

const currentMod = computed<FilledMod | undefined>(() => {
  return props.mods.find((m) => m.id === modId.value);
});

async function handleSubmit() {
  if (!modId.value || !versionId.value) return;

  const mod = currentMod.value;
  if (!mod) {
    console.error('Mod not found');
    return;
  }

  const modVersion = mod.versions.find((v) => v.id === versionId.value);
  if (!modVersion) {
    console.error('Mod version not found');
    return;
  }

  const gameVersion = props.versions.find((v) => v.version === modVersion.gameVersion);
  if (!gameVersion) {
    console.error('Game version not found');
    return;
  }

  const loader = props.loaders.find((l) => l.name === modVersion.loader);
  if (!loader) {
    console.error('Loader not found');
    return;
  }

  await props.handleDownload(toRaw(mod), toRaw(gameVersion), toRaw(loader));
}
</script>

<template>
  <form class="flex flex-row gap-4" @submit.prevent="handleSubmit">
    <Select
      v-model="modId"
      :options="mods"
      option-label="rawName"
      option-value="id"
      placeholder="Select mod"
    />
    <Select
      v-model="versionId"
      :options="currentMod?.versions"
      option-label="name"
      option-value="id"
      placeholder="Select version"
    />
    <Button type="submit">Download</Button>
  </form>
</template>
