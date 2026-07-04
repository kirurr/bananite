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
  ProfileService: Symbol.for('ProfileService'),
  Linker: Symbol.for('Linker'),
  ProviderAPI: Symbol.for('ProviderAPI'),
  GameRepository: Symbol.for('GameRepository'),
  GameService: Symbol.for('GameService'),
  ModRepository: Symbol.for('ModRepository'),
  ModInfoRepository: Symbol.for('ModInfoRepository'),
  ModVersionRepository: Symbol.for('ModVersionRepository'),
  ModService: Symbol.for('ModService'),
  // Single token for every provider implementation; disambiguated with @named
  // ('modrinth', 'curseforge', ...) at bind- and inject-time.
  ModProvider: Symbol.for('ModProvider'),
  SystemService: Symbol.for('SystemService'),
};
