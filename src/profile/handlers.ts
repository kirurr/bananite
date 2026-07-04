import { dialog, ipcMain } from 'electron';
import { readFile, writeFile } from 'fs/promises';
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

  ipcMain.handle(channel.ExportProfile, async (_, profileId) => {
    const json = await service.getProfileJSON(profileId);
    const { name } = JSON.parse(json).profile as { name: string };

    const result = await dialog.showSaveDialog({
      defaultPath: `${name}.json`,
      filters: [{ name: 'JSON', extensions: ['json'] }],
    });

    if (result.canceled || !result.filePath) return;
    await writeFile(result.filePath, json, 'utf-8');
  });

  ipcMain.handle(channel.ImportProfile, async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'JSON', extensions: ['json'] }],
    });

    if (result.canceled || result.filePaths.length === 0) return;
    const contents = await readFile(result.filePaths[0], 'utf-8');
    await service.createProfileByJSON(contents);
  });
}
