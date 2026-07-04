import { dirname } from 'path';
import { createWriteStream, mkdirSync } from 'fs';
import { pipeline } from 'stream/promises';
import { unlink } from 'fs/promises';

export interface ISystemService {
  downloadMod(url: string, destination: string): Promise<void>;
  deleteModFile(file: string): Promise<void>;
}

export class SystemService implements ISystemService {
  async downloadMod(url: string, destination: string): Promise<void> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    mkdirSync(dirname(destination), { recursive: true });

    if (!response.body) {
      throw new Error('No response body');
    }

    await pipeline(
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      response.body as any,
      createWriteStream(destination),
    );
  }

  async deleteModFile(file: string): Promise<void> {
    await unlink(file);
  }
}
