import { ref, onMounted } from 'vue';
import type { Mod } from '../../shared/ipc';

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
  const mods = ref<Mod[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Run an IPC call with shared loading/error handling. Returns true on success
  // so callers can decide whether to refresh afterwards.
  async function run(op: () => Promise<unknown>): Promise<boolean> {
    loading.value = true;
    error.value = null;
    try {
      await op();
      return true;
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function refresh() {
    await run(async () => {
      mods.value = await window.api.mods.list();
    });
  }

  async function add(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (await run(() => window.api.mods.add({ name: trimmed }))) await refresh();
  }

  async function toggle(mod: Mod) {
    if (await run(() => window.api.mods.setEnabled(mod.id, !mod.enabled))) await refresh();
  }

  async function remove(mod: Mod) {
    if (await run(() => window.api.mods.delete(mod.id))) await refresh();
  }

  // Load once when the consuming component mounts.
  onMounted(refresh);

  return { mods, loading, error, refresh, add, toggle, remove };
}
