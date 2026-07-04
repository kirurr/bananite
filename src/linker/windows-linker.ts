import { link, unlink } from 'fs/promises';
import { join } from 'path';
import type { IGameService } from '../game/service';
import { TYPES } from '../types';
import type { ILinker } from './interface';
import { inject, injectable } from 'inversify';

function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && 'code' in error;
}

@injectable()
export class WindowsLinker implements ILinker {
  constructor(@inject(TYPES.GameService) private readonly gameSerivce: IGameService) {}

  async createLink(file: string): Promise<void> {
    const settings = await this.gameSerivce.getSettings();

    if (!settings) throw new Error('Game settings not found');

    try {
      await link(join(settings.downloadPath, file), join(settings.gamePath, file));
    } catch (err) {
      if (isErrnoException(err) && err.code === 'EEXIST') {
        console.warn(`File already exists: ${file}`);
        return;
      }
      throw err;
    }
  }

  async deleteLink(file: string): Promise<void> {
    const settings = await this.gameSerivce.getSettings();

    if (!settings) throw new Error('Game settings not found');

    try {
      await unlink(join(settings.gamePath, file));
    } catch (err) {
      if (isErrnoException(err) && err.code === 'ENOENT') {
        console.warn(`File not found: ${file}`);
        return;
      }
      throw err;
    }
  }
}
