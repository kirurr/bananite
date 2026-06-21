import type { GameVersion, Loader } from "../game/schema";
import type { FilledMod } from "../mod/schema";

export interface IModProvider {
  addModByLink(link: string): Promise<void>;
	downloadMod(mod: FilledMod, gameVersion: GameVersion, loader: Loader): Promise<void>;
}
