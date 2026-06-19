export const NAMED_CONSTANTS = {
  providers: {
    modrinth: 'modrinth',
    curseforge: 'curseforge',
  } as const,
  system: {
    windows: 'windows',
  } as const,
};

export const TYPES = {
  ProfileRepository: Symbol.for('Profile'),
  Linker: Symbol.for('Linker'),
  GameAPI: Symbol.for('GameAPI'),
  GameRepository: Symbol.for('GameRepository'),
  GameService: Symbol.for('GameService'),
  ModRepository: Symbol.for('ModRepository'),
  ModInfoRepository: Symbol.for('ModInfoRepository'),
  ModVersionRepository: Symbol.for('ModVersionRepository'),
  ModService: Symbol.for('ModService'),
  // Single token for every provider implementation; disambiguated with @named
  // ('modrinth', 'curseforge', ...) at bind- and inject-time.
  ModProvider: Symbol.for('ModProvider'),
};
