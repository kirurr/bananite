import type { FilledMod, Mod } from './schema';

export const channel = {
  ModsAddByLink: 'mods:add-by-link',
	ModsList: 'mods:list',
} as const;

export type Api = {
  addByLink(link: string): Promise<Mod>;
	list(): Promise<FilledMod[]>;
};
