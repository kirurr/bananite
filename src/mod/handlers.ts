import { ipcMain } from 'electron';
import { container, getModProvider } from '../container';
import { TYPES } from '../types';
import type { ProviderTypes } from '../providers/providers';
import type { IModRepository } from './repository/interface';
import { channel } from './ipc';
import type { FilledMod } from './schema';
import type { GameVersion, Loader } from '../game/schema';

/** Pick the provider (the @named binding) from a mod URL. */
function providerFromLink(link: string): ProviderTypes {
  const host = new URL(link).hostname;
  if (host.includes('modrinth.com')) return 'modrinth';
  if (host.includes('curseforge.com')) return 'curseforge';
  throw new Error(`Unsupported provider for link: ${link}`);
}

export function registerModsIpcHandlers(): void {
  const modRepo = container.get<IModRepository>(TYPES.ModRepository);

  ipcMain.handle(channel.ModsAddByLink, (_event, link: string) => {
    const provider = getModProvider(providerFromLink(link));
    return provider.addModByLink(link);
  });

  ipcMain.handle(
    channel.DownloadMod,
    (_event, mod: FilledMod, gameVersion: GameVersion, loader: Loader) => {
      const provider = getModProvider(mod.provider);
      return provider.downloadMod(mod, gameVersion, loader);
    },
  );

  ipcMain.handle(channel.ModsList, () => modRepo.list());
}
