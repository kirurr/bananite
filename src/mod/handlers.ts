import { container, getModProvider } from '../container';
import { TYPES } from '../types';
import type { ProviderTypes } from '../providers/providers';
import type { IModRepository } from './repository/interface';

function providerFromLink(link: string): ProviderTypes {
  const host = new URL(link).hostname;
  if (host.includes('modrinth.com')) return 'modrinth';
  if (host.includes('curseforge.com')) return 'curseforge';
  throw new Error(`Unsupported provider for link: ${link}`);
}

export function modsHandlers() {
  const modRepo = container.get<IModRepository>(TYPES.ModRepository);

  return {
    addByLink: (link: string) => getModProvider(providerFromLink(link)).addModByLink(link),
    list: () => modRepo.list(),
  };
}
