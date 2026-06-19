import type { NewGameVersion, NewLoader } from "../../game/schema";
import type { FilledMod } from "../../mod/schema";

export interface IGameAPI {
	getGameVersions(): Promise<NewGameVersion[]>;
	getGameLoaders(): Promise<NewLoader[]>;
	getFilledModFromSlug(slug: string): Promise<FilledMod>;
}
