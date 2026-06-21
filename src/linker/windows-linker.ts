import { link, unlink } from 'fs/promises';
import { join } from 'path';
import type { IGameService } from '../game/service';
import { TYPES } from '../types';
import type { ILinker } from './interface';
import { inject, injectable } from 'inversify';

@injectable()
export class WindowsLinker implements ILinker {
  constructor(@inject(TYPES.GameService) private readonly gameSerivce: IGameService) {}

  async createLink(file: string): Promise<void> {
    const settings = await this.gameSerivce.getSettings();

    if (!settings) throw new Error('Game settings not found');

    await link(join(settings.downloadPath, file), join(settings.gamePath, file));
  }

  async deleteLink(file: string): Promise<void> {
    const settings = await this.gameSerivce.getSettings();

    if (!settings) throw new Error('Game settings not found');

    await unlink(join(settings.gamePath, file));
  }
}
