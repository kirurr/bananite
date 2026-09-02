<script setup lang="ts">
import { ref } from 'vue';
import type { Loader, GameVersion } from '../../../game/schema';
import type { NewProfile } from '../../../profile/schema';

const props = defineProps<{
  loaders: Loader[];
  gameVersions: GameVersion[];
  handleCreate: (profile: NewProfile) => Promise<void>;
}>();

const name = ref<string>();
const gameVersion = ref<string>();
const loader = ref<string>();

async function handleSubmit() {
  if (!name.value || !gameVersion.value || !loader.value) {
    console.error('Fields not set');
    return;
  }

  const profile: NewProfile = {
    name: name.value,
    gameVersion: gameVersion.value,
    loader: loader.value,
  };

  await props.handleCreate(profile);
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="name" type="text" placeholder="Name" />
    <select v-model="gameVersion" placeholder="Game version">
      <option v-for="v in gameVersions" :key="v.version">
        {{ v.version }}
      </option>
    </select>
    <select v-model="loader" placeholder="Loader">
      <option v-for="l in loaders" :key="l.name">
        {{ l.name }}
      </option>
    </select>
    <button type="submit">Create</button>
  </form>
</template>
