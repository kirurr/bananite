<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useSystem } from '../../composables/system';
import { useGame } from '../../composables/game';
import DialogButtonInput from '../generic/DialogButtonInput.vue';
import { useToast } from 'primevue/usetoast';
import { handleErrorToast, TOAST_TIMEOUT_MS } from '../../composables/toast';

const { openDialog } = useSystem();

const toast = useToast();

const { settings, setSettings } = useGame();

const gamePath = ref(settings.value?.gamePath);
const downloadPath = ref(settings.value?.downloadPath);

async function handleDialog(ref: Ref<string | undefined>): Promise<boolean> {
  const string = await openDialog();
  if (string) {
    ref.value = string;
    return true;
  }
  return false;
}

async function handleChangeGamePath(e: Event) {
  e.preventDefault();
  const isChanged = await handleDialog(gamePath);
  if (!isChanged) return;
  if (!gamePath.value) return;
  if (!settings.value) await createNewSettings();

  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await setSettings({ ...settings.value!, gamePath: gamePath.value });
  } catch (e) {
    handleErrorToast(toast, e);
    return;
  }

  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Settings saved',
    life: TOAST_TIMEOUT_MS,
  });
}

async function handleChangeDownloadPath(e: Event) {
  e.preventDefault();
  const isChanged = await handleDialog(downloadPath);

  if (!isChanged) return;
  if (!downloadPath.value) return;
  if (!settings.value) await createNewSettings();

  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await setSettings({ ...settings.value!, downloadPath: downloadPath.value });
  } catch (e) {
    handleErrorToast(toast, e);
    return;
  }

  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Settings saved',
    life: TOAST_TIMEOUT_MS,
  });
}

async function createNewSettings() {
  try {
    await setSettings({
      gamePath: '',
      downloadPath: '',
    });
  } catch (e) {
    handleErrorToast(toast, e);
    return;
  }
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
