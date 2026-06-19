import { inject, injectable, named } from 'inversify';
import { TYPES } from '../../types';
import type { IModProvider } from '../interface';
import type { IModService } from '../../mod/service';
import type { IGameAPI } from '../api/interface';

function getModSlugFromLink(link: string): string {
  const regex = /\/mods?\/([a-z0-9-]+)/i;

  const match = regex.exec(link);
  if (!match) throw new Error(`Invalid mod link: ${link}`);

  return match[1];
}

@injectable()
export class ModrinthProvider implements IModProvider {
  private readonly service: IModService;

  constructor(
    @inject(TYPES.ModService) service: IModService,
    @inject(TYPES.GameAPI) @named('modrinth') private readonly api: IGameAPI,
  ) {
    this.service = service;
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
      })),
    );
  }
}
