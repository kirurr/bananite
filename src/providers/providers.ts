export const providers = ['modrinth', 'curseforge'] as const;
export type ProviderTypes = (typeof providers)[number];
