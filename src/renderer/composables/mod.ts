import { ref } from 'vue';
import type { FilledMod } from '../../mod/schema';

/**
 * Whether the preload bridge is present.
 *
 * In a packaged app (and under `npm start`) the preload always runs before the
 * renderer, so `window.api` is guaranteed — this is only ever false if you open
 * the renderer without the preload (e.g. the Vite dev URL in a plain browser).
 * The type says `api` is always there, so this guards a case the types don't.
 */
export function useElectron() {
  const isElectron = (window as { api?: unknown }).api != null;
  return { isElectron };
}

const mods = ref<FilledMod[]>([]);

async function getMods() {
  const result = await window.api.mods.list();
  mods.value = result;
}

void getMods();
async function addModByLink(link: string) {
  await window.api.mods.addByLink(link);
  await getMods();
}

export function useMods() {
  return {
    mods,
    getMods,
    addModByLink,
  };
}
