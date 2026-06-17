import { ipcMain } from 'electron';
import { channel } from './ipc';
import { SQLiteModsRepository } from './repository/sqliteRepository';
import type { NewMod } from './schema';

/**
 * Wire every mod IPC channel to its repository method.
 * Call once, after the database has been initialised (it touches the DB).
 */
export function registerModsIpcHandlers(): void {
  const mods = new SQLiteModsRepository();

  ipcMain.handle(channel.ModsList, () => mods.list());
  ipcMain.handle(channel.ModsAdd, (_event, mod: NewMod) => mods.add(mod));
  ipcMain.handle(channel.ModsSetEnabled, (_event, id: number, enabled: boolean) =>
    mods.setEnabled(id, enabled),
  );
  ipcMain.handle(channel.ModsDelete, (_event, id: number) => mods.delete(id));
}
