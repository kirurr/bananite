/**
 * Shared IPC contract between the main and renderer processes.
 *
 * This is the single source of truth for channel names and payload shapes:
 * the main process (handlers), the preload bridge and the renderer
 * (`window.api`) all import from here, so the three stay in sync.
 */

export interface Mod {
  id: number;
  name: string;
  enabled: boolean;
  createdAt: string;
}

/** Fields accepted when creating a mod (the rest are filled in by the DB). */
export interface NewMod {
  name: string;
  enabled?: boolean;
}

/** IPC channel names. Grouped by feature so it's easy to add more later. */
export const IpcChannel = {
  ModsList: 'mods:list',
  ModsAdd: 'mods:add',
  ModsSetEnabled: 'mods:set-enabled',
  ModsDelete: 'mods:delete',
} as const;

/**
 * The API surface exposed on `window.api` in the renderer.
 * Add new namespaces (settings, launcher, …) alongside `mods` as the app grows.
 */
export interface Api {
  mods: {
    list(): Promise<Mod[]>;
    add(mod: NewMod): Promise<Mod>;
    setEnabled(id: number, enabled: boolean): Promise<void>;
    delete(id: number): Promise<void>;
  };
}
