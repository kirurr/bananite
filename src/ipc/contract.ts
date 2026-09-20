// Imported by preload: must stay dependency-free.
// Channels are `${namespace}:${method}`.
export const contract = {
  game: ['listVersions', 'listLoaders', 'syncData', 'getSettings', 'setSettings'],
  mods: ['addByLink', 'list'],
  profile: [
    'create',
    'get',
    'list',
    'addMod',
    'removeMod',
    'update',
    'exportProfile',
    'importProfile',
  ],
  system: ['openDialog', 'openExternalLink'],
} as const;

export type Contract = typeof contract;
