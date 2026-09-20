import { container } from '../container';
import { TYPES } from '../types';
import type { IGameService } from './service';
import type { NewGameSettings } from './schema';

export function gameHandlers() {
  const service = container.get<IGameService>(TYPES.GameService);

  return {
    listVersions: () => service.getVersions(),
    listLoaders: () => service.getLoaders(),
    syncData: () => service.syncData(),
    getSettings: () => service.getSettings(),
    setSettings: (data: NewGameSettings) => service.setSettings(data),
  };
}
