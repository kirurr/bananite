<script setup lang="ts">
import { ref, type Ref } from 'vue';
import type { GameSettings, NewGameSettings } from '../../game/schema';
import { useDialog } from '../composables/useDialog';

const { openDialog } = useDialog();

const { settings, setSettings } = defineProps<{
	settings: GameSettings | null;
  setSettings: (data: NewGameSettings) => Promise<void>;
}>();

const gamePath = ref(settings?.gamePath);
const downloadPath = ref(settings?.downloadPath);

async function handleChange(ref: Ref<string | undefined>) {
  const string = await openDialog();
  if (string) {
    ref.value = string;
  }
}

function handleChangeGamePath(e: Event) {
  e.preventDefault();
  handleChange(gamePath);
}

function handleChangeDownloadPath(e: Event) {
  e.preventDefault();
  handleChange(downloadPath);
}

function handleSubmit(e: Event) {
  e.preventDefault();

	if (!gamePath.value || !downloadPath.value) return console.error('Paths not set');

  const newSettings: NewGameSettings = {
    id: settings?.id,
    gamePath: gamePath.value,
    downloadPath: downloadPath.value,
  };

  setSettings(newSettings);
}
</script>

<template>
  <form class="flex flex-row gap-4" @submit="handleSubmit">
    <div @click="handleChangeGamePath">
      {{ gamePath }}
			<span v-if="!gamePath">game path is not set</span>
    </div>
    <div @click="handleChangeDownloadPath">
      {{ downloadPath }}
			<span v-if="!downloadPath">download path is not set</span>
    </div>
    <button type="submit">Save</button>
  </form>
</template>
