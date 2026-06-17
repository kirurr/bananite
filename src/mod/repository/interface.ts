import { Mod, NewMod } from "../schema";

export interface ModRepository {
	list(): Promise<Mod[]>;
	add(mod: NewMod): Promise<Mod>;
	setEnabled(id: number, enabled: boolean): Promise<void>;
	delete(id: number): Promise<void>;
}
