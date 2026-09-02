<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useSystem } from '../../composables/system';
import { useGame } from '../../composables/game';
import DialogButtonInput from '../generic/DialogButtonInput.vue';

const { openDialog } = useSystem();

const { settings, setSettings } = useGame();

const gamePath = ref(settings.value?.gamePath);
const downloadPath = ref(settings.value?.downloadPath);

async function handleChange(ref: Ref<string | undefined>): Promise<boolean> {
  const string = await openDialog();
  if (string) {
    ref.value = string;
    return true;
  }
  return false;
}

async function handleChangeGamePath(e: Event) {
  e.preventDefault();
  const isChanged = await handleChange(gamePath);
  if (!isChanged) return;
  if (!gamePath.value) return;
  if (!settings.value) await createNewSettings();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await setSettings({ ...settings.value!, gamePath: gamePath.value });
}

async function handleChangeDownloadPath(e: Event) {
  e.preventDefault();
  const isChanged = await handleChange(downloadPath);

  if (!isChanged) return;
  if (!downloadPath.value) return;
  if (!settings.value) await createNewSettings();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await setSettings({ ...settings.value!, downloadPath: downloadPath.value });
}

async function createNewSettings() {
  await setSettings({
    gamePath: '',
    downloadPath: '',
  });
}
</script>

<template>
  <div class="flex flex-row flex-wrap gap-4">
    <div>
      <label for="game-path">Game path</label>
      <DialogButtonInput
        id="game-path"
        :value="gamePath"
        placeholder="Game path is not set"
        @click="handleChangeGamePath"
      />
    </div>
    <div>
      <label for="download-path">Download path</label>
      <DialogButtonInput
        id="download-path"
        :value="downloadPath"
        placeholder="Download path is not set"
        @click="handleChangeDownloadPath"
      />
    </div>
  </div>
</template>
