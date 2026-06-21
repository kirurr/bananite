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

  function syncData() {
    return window.api.game.syncData();
  }

	async function openDialog(): Promise<string | undefined> {
		const string =  await window.api.openDialog({});
		console.log(string);
		return string;
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
		openDialog,
  };
}
