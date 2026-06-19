import { ref } from 'vue';
import type { GameVersion, Loader } from '../../game/schema';

export function useGame() {
  const versions = ref<GameVersion[]>([]);
  const loaders = ref<Loader[]>([]);

	getVersions();
	getLoaders();

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

  return {
    versions,
    getVersions,
    loaders,
    getLoaders,
    syncData,
  };
}
