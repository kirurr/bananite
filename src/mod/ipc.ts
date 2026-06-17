import type { Mod, NewMod } from './schema';

/**
 * IPC contract for the mods feature — channel names and the renderer-facing
 * API shape. This module is imported by the preload and renderer, so it must
 * stay free of any main-process code (no `ipcMain`, no repository, no DB).
 * The handlers that fulfil this contract live in `./handlers`.
 */
export const channel = {
  ModsList: 'mods:list',
  ModsAdd: 'mods:add',
  ModsSetEnabled: 'mods:set-enabled',
  ModsDelete: 'mods:delete',
} as const;

export type Api = {
  list(): Promise<Mod[]>;
  add(mod: NewMod): Promise<Mod>;
  setEnabled(id: number, enabled: boolean): Promise<void>;
  delete(id: number): Promise<void>;
};
