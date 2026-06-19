import type { GameVersion, Loader } from './schema';

export const channel = {
  VersionList: 'game:version-list',
  LoaderList: 'game:loader-list',
  SyncData: 'game:sync-data',
} as const;

export type Api = {
  listVersions(): Promise<GameVersion[]>;
  listLoaders(): Promise<Loader[]>;
  syncData(): Promise<void>;
};
