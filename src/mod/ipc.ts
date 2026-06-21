import type { GameVersion, Loader } from '../game/schema';
import type { FilledMod, Mod } from './schema';

export const channel = {
  ModsAddByLink: 'mods:add-by-link',
  ModsList: 'mods:list',
	DownloadMod: 'mods:download-mod',
} as const;

export type Api = {
  addByLink(link: string): Promise<Mod>;
  list(): Promise<FilledMod[]>;
	downloadMod(mod: FilledMod, gameVersion: GameVersion, loader: Loader): Promise<void>;
};
