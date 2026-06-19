import { ipcMain } from 'electron';
import { container } from '../container';
import { TYPES } from '../types';
import type { IGameService } from './service';
import { channel } from './ipc';

export function registerGameIpcHandlers(): void {
  const service = container.get<IGameService>(TYPES.GameService);

  ipcMain.handle(channel.VersionList, () => service.getVersions());
  ipcMain.handle(channel.LoaderList, () => service.getLoaders());
  ipcMain.handle(channel.SyncData, () => service.syncData());
  ipcMain.handle(channel.GameSettings, () => service.getSettings());
  ipcMain.handle(channel.SetGameSettings, (_, data) => service.setSettings(data));
}
