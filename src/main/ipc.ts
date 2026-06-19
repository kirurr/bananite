import { registerGameIpcHandlers } from '../game/handlers';
import { registerModsIpcHandlers } from '../mod/handlers';

/**
 * Register every feature's IPC handlers. Main-process only — this is where the
 * DB-backed handler code is pulled in, kept separate from the renderer-safe
 * contract in `../shared/ipc`.
 *
 * Call once, after `initDatabase()`.
 */
export function registerIpcHandlers(): void {
  registerModsIpcHandlers();
  registerGameIpcHandlers();
}
