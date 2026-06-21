<script setup lang="ts">
import { computed, ref, toRaw } from 'vue';
import type { GameVersion, Loader } from '../../game/schema';
import type { FilledMod } from '../../mod/schema';

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

function handleSubmit() {
  if (!modId.value) return;
  if (!versionId.value) return;

  const mod = currentMod.value!;

  const modVersion = mod.versions.find((v) => v.id === versionId.value);
  if (!modVersion) return console.error('Version not found');

  const gameVersion = props.versions.find((v) => v.version === modVersion.gameVersion);
  if (!gameVersion) return console.error('Version not found');

  const loader = props.loaders.find((l) => l.name === modVersion.loader);
  if (!loader) return console.error('Loader not found');

  props.handleDownload(toRaw(mod), toRaw(gameVersion), toRaw(loader));
}
</script>

<template>
  <form class="flex flex-row gap-4" @submit.prevent="handleSubmit">
    <select v-model="modId" class="flex-1" placeholder="Select mod">
      <option value=""></option>
      <option v-for="mod in mods" :key="mod.id" :value="mod.id">{{ mod.rawName }}</option>
    </select>

    <select v-model="versionId" class="flex-1" placeholder="Select version" :disabled="!currentMod">
      <option value=""></option>
      <option v-for="version in currentMod?.versions" :key="version.id" :value="version.id">
        {{ version.name }}
      </option>
    </select>
    <button type="submit">Download</button>
  </form>
</template>
