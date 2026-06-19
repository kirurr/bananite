import { injectable } from 'inversify';
import type { IGameAPI } from './interface';
import { z } from 'zod';
import {
  type GameVersion,
  type NewGameVersion,
  type NewLoader,
  newLoaderSchema,
} from '../../game/schema';

const modrinthVersionSchema = z.object({
  version: z.string(),
  version_type: z.string(),
});

type ModrinthVersion = z.infer<typeof modrinthVersionSchema>;

function modrinthToGameVersion(v: ModrinthVersion): GameVersion {
  if (v.version_type !== 'release' && v.version_type !== 'snapshot') {
    v.version_type = 'release';
  }

  return {
    version: v.version,
    type: v.version_type as GameVersion['type'],
  };
}

@injectable()
export class ModrinthAPI implements IGameAPI {
  async getVersions(): Promise<NewGameVersion[]> {
    try {
      const req = await fetch('https://api.modrinth.com/v2/tag/game_version');
      const data = await req.json();

      const versions = z.array(modrinthVersionSchema).parse(data);

      return versions.map(modrinthToGameVersion);
    } catch (e) {
      console.error('fetch versions from modrinth failed');
      console.error(e);
      return [];
    }
  }

  async getLoaders(): Promise<NewLoader[]> {
    try {
      const req = await fetch('https://api.modrinth.com/v2/tag/loader');
      const data = await req.json();

      return z.array(newLoaderSchema).parse(data);
    } catch (e) {
      console.error('fetch versions from modrinth failed');
      console.error(e);
      return [];
    }
  }
}
