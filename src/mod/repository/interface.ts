import type { FilledMod, Mod, ModInfo, ModVersion, NewMod, NewModInfo, NewModVersion } from '../schema';

export interface IModRepository {
  getById(id: string): Promise<Mod | undefined>;
  list(): Promise<FilledMod[]>;
  add(mod: NewMod): Promise<Mod>;
  delete(id: string): Promise<void>;
}

export interface IModInfoRepository {
  get(id: number): Promise<ModInfo | undefined>;
  list(): Promise<ModInfo[]>;
  add(modInfo: NewModInfo): Promise<ModInfo>;
}

export interface IModVersionRepository {
  get(id: string): Promise<ModVersion | undefined>;
  list(): Promise<ModVersion[]>;
  add(modVersion: NewModVersion): Promise<ModVersion>;
}
