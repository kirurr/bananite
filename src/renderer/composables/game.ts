import { ref } from 'vue';
import type { GameSettings, GameVersion, Loader, NewGameSettings } from '../../game/schema';

export function useGame() {
  const versions = ref<GameVersion[]>([]);
  const loaders = ref<Loader[]>([]);
  const settings = ref<GameSettings | null>(null);

  getVersions();
  getLoaders();
  getSettings();

  async function getSettings() {
    const result = await window.api.game.getSettings();
    settings.value = result;
  }

  async function setSettings(data: NewGameSettings) {
    await window.api.game.setSettings(data);
    getSettings();
  }

  async function getVersions() {
    const result = await window.api.game.listVersions();
    versions.value = result;
  }

  async function getLoaders() {
    const result = await window.api.game.listLoaders();
    loaders.value = result;
  }

  async function syncData() {
    await window.api.game.syncData();
    getVersions();
    getLoaders();
  }

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
