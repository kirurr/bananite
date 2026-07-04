import { ipcMain } from 'electron';
import { container } from '../container';
import { TYPES } from '../types';
import type { IProfileService } from './service';
import { channel } from './ipc';

export function registerProfileIpcHandlers(): void {
  const service = container.get<IProfileService>(TYPES.ProfileService);

  ipcMain.handle(channel.CreateProfile, (_, profile) => service.create(profile));
  ipcMain.handle(channel.GetProfile, (_, id) => service.get(id));
  ipcMain.handle(channel.ListProfiles, () => service.list());
  ipcMain.handle(channel.AddModToProfile, (_, profileId, modId) =>
    service.addMod(profileId, modId),
  );
  ipcMain.handle(channel.RemoveModFromProfile, (_, profileId, modId) =>
    service.removeMod(profileId, modId),
  );
  ipcMain.handle(channel.UpdateProfile, (_, profileId, data) => service.update(profileId, data));
}
