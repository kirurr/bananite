<script setup lang="ts">
import { ref } from 'vue';
import type { Loader, GameVersion } from '../../../game/schema';
import type { NewProfile } from '../../../profile/schema';
import InputText from '../volt/InputText.vue';
import Select from '../volt/Select.vue';
import Button from '../volt/Button.vue';

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
  <form class="flex flex-row flex-wrap items-center gap-4" @submit.prevent="handleSubmit">
    <InputText v-model="name" placeholder="Name" />
    <Select
      v-model="gameVersion"
      filter
      placeholder="Game version"
      :options="gameVersions"
      option-label="version"
      option-value="version"
    />
    <Select
      v-model="loader"
      filter
      placeholder="Loader"
      :options="loaders"
      option-label="name"
      option-value="name"
    />
    <Button type="submit">Create</Button>
  </form>
</template>
