import { dialog, ipcMain } from 'electron';
import { readFile, writeFile } from 'fs/promises';
import { container } from '../container';
import { TYPES } from '../types';
import type { IProfileService } from './service';
import { channel } from './ipc';
import type { EditProfile, NewProfile } from './schema';

export function registerProfileIpcHandlers(): void {
  const service = container.get<IProfileService>(TYPES.ProfileService);

  ipcMain.handle(channel.CreateProfile, (_, profile: NewProfile) => service.create(profile));
  ipcMain.handle(channel.GetProfile, (_, id: number) => service.get(id));
  ipcMain.handle(channel.ListProfiles, () => service.list());
  ipcMain.handle(channel.AddModToProfile, (_, profileId: number, modId: string) =>
    service.addMod(profileId, modId),
  );
  ipcMain.handle(channel.RemoveModFromProfile, (_, profileId: number, modId: string) =>
    service.removeMod(profileId, modId),
  );
  ipcMain.handle(channel.UpdateProfile, (_, profileId: number, data: EditProfile) =>
    service.update(profileId, data),
  );

  ipcMain.handle(channel.ExportProfile, async (_, profileId: number) => {
    const json = await service.getProfileJSON(profileId);
    const { profile } = JSON.parse(json) as { profile: { name: string } };
    const { name } = profile;

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

    const [filePath] = result.filePaths;
    if (result.canceled || !filePath) return;
    const contents = await readFile(filePath, 'utf-8');
    await service.createProfileByJSON(contents);
  });
}
