import { type Api as ModsApi, channel as ModsChannel } from '../mod/ipc';

/**
 * Shared IPC contract between the main and renderer processes.
 *
 * Channel names and payload types only — NO handler code. The preload bridge
 * and the renderer (`window.api`) import from here, so it must never pull in
 * main-process modules (Node, SQLite, Electron main APIs). Handler registration
 * lives in `../main/ipc`.
 */

export const IpcChannel = {
  ...ModsChannel,
};

/**
 * The API surface exposed on `window.api` in the renderer.
 * Add new namespaces (settings, launcher, …) alongside `mods` as the app grows.
 */
export interface Api {
  mods: ModsApi;
}
