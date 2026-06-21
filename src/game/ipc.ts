import type { GameSettings, GameVersion, Loader, NewGameSettings } from './schema';

export const channel = {
  VersionList: 'game:version-list',
  LoaderList: 'game:loader-list',
  SyncData: 'game:sync-data',
  GameSettings: 'game:settings',
  SetGameSettings: 'game:set-settings',
} as const;

export type Api = {
  listVersions(): Promise<GameVersion[]>;
  listLoaders(): Promise<Loader[]>;
  syncData(): Promise<void>;
  getSettings(): Promise<GameSettings>;
  setSettings(data: NewGameSettings): Promise<void>;
};
