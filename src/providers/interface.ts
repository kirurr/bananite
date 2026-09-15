import type { FilledMod } from '../mod/schema';

export interface IModProvider {
  addModByLink(link: string): Promise<void>;
  downloadMod(mod: FilledMod, modVersionId: string): Promise<void>;
}
