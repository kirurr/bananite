import { ref } from 'vue';
import type { GameSettings, GameVersion, Loader, NewGameSettings } from '../../game/schema';

const versions = ref<GameVersion[]>([]);
const loaders = ref<Loader[]>([]);
const settings = ref<GameSettings | null>(null);
void getVersions();
void getLoaders();
void getSettings();
async function getSettings() {
  const result = await window.api.game.getSettings();
  settings.value = result;
}

async function getVersions() {
  const result = await window.api.game.listVersions();
  versions.value = result;
}

async function getLoaders() {
  const result = await window.api.game.listLoaders();
  loaders.value = result;
}

// Первичная загрузка при создании композабла: ждать здесь нельзя (setup
// синхронный), поэтому промис отпускаем осознанно через `void`.

async function setSettings(data: NewGameSettings) {
  await window.api.game.setSettings(data);
  await getSettings();
}

async function syncData() {
  await window.api.game.syncData();
  await Promise.all([getVersions(), getLoaders()]);
}

export function useGame() {
  return {
    versions,
    getVersions,
    loaders,
    getLoaders,
    syncData,
    settings,
    getSettings,
    setSettings,
  };
}
