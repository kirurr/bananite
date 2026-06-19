import type { ILinker } from './interface';
import { injectable } from 'inversify';

@injectable()
export class WindowsLinker implements ILinker {
  createLink(from_path: string, to_path: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
