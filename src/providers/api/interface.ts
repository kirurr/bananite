import type { NewGameVersion, NewLoader } from "../../game/schema";

export interface IGameAPI {
	getVersions(): Promise<NewGameVersion[]>;
	getLoaders(): Promise<NewLoader[]>;
}
