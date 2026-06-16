import { ipcMain } from 'electron';
import { IpcChannel, type NewMod } from '../shared/ipc';
import * as db from './db';

/**
 * Wire every IPC channel to its database handler.
 * Call once, after the database has been initialised.
 */
export function registerIpcHandlers(): void {
  ipcMain.handle(IpcChannel.ModsList, () => db.listMods());
  ipcMain.handle(IpcChannel.ModsAdd, (_event, mod: NewMod) => db.addMod(mod));
  ipcMain.handle(IpcChannel.ModsSetEnabled, (_event, id: number, enabled: boolean) =>
    db.setModEnabled(id, enabled),
  );
  ipcMain.handle(IpcChannel.ModsDelete, (_event, id: number) => db.deleteMod(id));
}
