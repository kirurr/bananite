import { dialog } from 'electron';
import { readFile, writeFile } from 'fs/promises';
import { container } from '../container';
import { TYPES } from '../types';
import type { IProfileService } from './service';
import type { EditProfile, NewProfile } from './schema';

export function profileHandlers() {
  const service = container.get<IProfileService>(TYPES.ProfileService);

  return {
    create: (profile: NewProfile) => service.create(profile),
    get: (id: number) => service.get(id),
    list: () => service.list(),
    addMod: (profileId: number, modId: string, modVersionId: string) =>
      service.addMod(profileId, modId, modVersionId),
    removeMod: (profileId: number, modId: string) => service.removeMod(profileId, modId),
    update: (profileId: number, data: EditProfile) => service.update(profileId, data),

    exportProfile: async (profileId: number) => {
      const json = await service.getProfileJSON(profileId);
      const { profile } = JSON.parse(json) as { profile: { name: string } };
      const { name } = profile;

      const result = await dialog.showSaveDialog({
        defaultPath: `${name}.json`,
        filters: [{ name: 'JSON', extensions: ['json'] }],
      });

      if (result.canceled || !result.filePath) return;
      await writeFile(result.filePath, json, 'utf-8');
    },

    importProfile: async () => {
      const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'JSON', extensions: ['json'] }],
      });

      const [filePath] = result.filePaths;
      if (result.canceled || !filePath) return;
      const contents = await readFile(filePath, 'utf-8');
      await service.createProfileByJSON(contents);
    },
  };
}
