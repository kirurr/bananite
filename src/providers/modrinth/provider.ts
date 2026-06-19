import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import type { IModProvider } from "../interface";
import type { IModService } from "../../mod/service";

@injectable()
export class ModrinthProvider implements IModProvider {
	private readonly service: IModService;

	constructor(@inject(TYPES.ModService) service: IModService) {
		this.service = service;
	}

	async addModByLink(link: string): Promise<void> {
		console.log('Adding mod by link:', link);
	}

}
