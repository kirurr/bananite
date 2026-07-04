import { ref } from 'vue';
import type { FilledMod } from '../../mod/schema';
import type { GameVersion, Loader } from '../../game/schema';

/**
 * Whether the preload bridge is present.
 *
 * In a packaged app (and under `npm start`) the preload always runs before the
 * renderer, so `window.api` is guaranteed — this is only ever false if you open
 * the renderer without the preload (e.g. the Vite dev URL in a plain browser).
 * The type says `api` is always there, so this guards a case the types don't.
 */
export function useElectron() {
  const isElectron = window.api != null;
  return { isElectron };
}

/** Reactive view of the mods stored in the main-process database. */
export function useMods() {
  const mods = ref<FilledMod[]>([]);

  async function getMods() {
    const result = await window.api.mods.list();
    mods.value = result;
  }

  async function addModByLink(link: string) {
    await window.api.mods.addByLink(link);
    getMods();
  }

  getMods();

  async function downloadMod(mod: FilledMod, gameVersion: GameVersion, loader: Loader) {
    await window.api.mods.downloadMod(mod, gameVersion, loader);
  }

  return {
    mods,
    getMods,
    addModByLink,
    downloadMod,
  };
}
