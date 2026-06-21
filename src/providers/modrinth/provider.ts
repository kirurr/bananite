import { inject, injectable, named } from 'inversify';
import { NAMED_CONSTANTS, TYPES } from '../../types';
import type { IModProvider } from '../interface';
import type { IModService } from '../../mod/service';
import type { IProviderAPI } from '../api/interface';
import type { GameVersion, Loader } from '../../game/schema';
import type { FilledMod } from '../../mod/schema';
import type { IGameService } from '../../game/service';
import { dirname, join } from 'path';
import { createWriteStream, mkdirSync } from 'fs';
import { pipeline } from 'stream/promises';

function getModSlugFromLink(link: string): string {
  const regex = /\/mods?\/([a-z0-9-]+)/i;

  const match = regex.exec(link);
  if (!match) throw new Error(`Invalid mod link: ${link}`);

  return match[1];
}

async function downloadMod(url: string, destination: string): Promise<void> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  // создаём папки при необходимости
  mkdirSync(dirname(destination), { recursive: true });

  if (!response.body) {
    throw new Error('No response body');
  }

  await pipeline(
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    response.body as any,
    createWriteStream(destination),
  );
}

@injectable()
export class ModrinthProvider implements IModProvider {
  private readonly service: IModService;
  private readonly gameSerivce: IGameService;
  private readonly api: IProviderAPI;

  constructor(
    @inject(TYPES.ModService) service: IModService,
    @inject(TYPES.GameService) gameSerivce: IGameService,
    @inject(TYPES.ProviderAPI)
    @named(NAMED_CONSTANTS.providers.modrinth)
    api: IProviderAPI,
  ) {
    this.service = service;
    this.gameSerivce = gameSerivce;
    this.api = api;
  }

  async downloadMod(mod: FilledMod, gameVersion: GameVersion, loader: Loader): Promise<void> {
    const settings = await this.gameSerivce.getSettings();

    if (!settings) throw new Error('Game settings not found');

    const version = mod.versions.find(
      (v) => v.gameVersion === gameVersion.version && v.loader === loader.name,
    );
    if (!version) throw new Error('Version for gameVersion and loader not found');

    await downloadMod(version.downloadUrl, join(settings.downloadPath, version.fileName));
  }

  async addModByLink(link: string): Promise<void> {
    const slug = getModSlugFromLink(link);
    const mod = await this.api.getFilledModFromSlug(slug);

    this.service.createMod(
      {
        id: mod.id,
        slug,
        url: mod.url,
        rawName: mod.rawName,
        provider: 'modrinth',
      },
      {
        id: mod.id,
        modId: mod.id,
        title: mod.info?.title,
        description: mod.info?.description,
        iconUrl: mod.info?.iconUrl,
      },
      mod.versions.map((v) => ({
        id: v.id,
        modId: mod.id,
        name: v.name,
        version: v.version,
        date: v.date,
        gameVersion: v.gameVersion,
        loader: v.loader,
        downloadUrl: v.downloadUrl,
        fileName: v.fileName,
        fileSize: v.fileSize,
      })),
    );
  }
}
