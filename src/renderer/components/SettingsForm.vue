<script setup lang="ts">
import type { GameSettings, NewGameSettings } from '../../game/schema';

const { settings, setSettings } = defineProps<{
  settings: GameSettings | null;
  setSettings: (data: NewGameSettings) => Promise<void>;
}>();

function handleSubmit(e: Event) {
  e.preventDefault();
  const form = e.target as HTMLFormElement;

  const data = new FormData(form);

  const settings: NewGameSettings = {
    gamePath: data.get('gamePath') as string,
    downloadPath: data.get('downloadPath') as string,
  };

  setSettings(settings);
}
</script>

<template>
  <form class="flex flex-row gap-4" @submit="handleSubmit">
    <input
			type="text"
			name="gamePath"
			placeholder="Game path"
			:value="settings?.gamePath"
		/>
    <input
      type="text"
      name="downloadPath"
      placeholder="Download path"
      :value="settings?.downloadPath"
    />
    <button type="submit">Save</button>
  </form>
</template>
