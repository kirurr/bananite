import type { NewGameVersion, NewLoader } from '../../game/schema';
import type { FilledMod } from '../../mod/schema';

export interface IProviderAPI {
  getGameVersions(): Promise<NewGameVersion[]>;
  getGameLoaders(): Promise<NewLoader[]>;
  getFilledModFromSlug(slug: string): Promise<FilledMod>;
}
