import { Container } from 'inversify';
import { TYPES } from './types';
import type { IGameRepository } from './game/repository/interface';
import { SQLiteGameRepository } from './game/repository/sqliteRepository';
import { GameService, type IGameService } from './game/service';
import { ModService, type IModService } from './mod/service';
import type {
  IModInfoRepository,
  IModRepository,
  IModVersionRepository,
} from './mod/repository/interface';
import {
  SQLiteModInfoRepository,
  SQLiteModRepository,
  SQLiteModVersionRepository,
} from './mod/repository/sqliteRepository';
import type { IModProvider } from './providers/interface';
import { ModrinthProvider } from './providers/modrinth/provider';
import type { ProviderTypes } from './providers/providers';
import type { IGameAPI } from './providers/api/interface';
import { ModrinthAPI } from './providers/api/modrinthApi';

const container = new Container();

// --- Game (fully wired) ---
container.bind<IGameAPI>(TYPES.GameAPI).to(ModrinthAPI).inSingletonScope();
container.bind<IGameRepository>(TYPES.GameRepository).to(SQLiteGameRepository).inSingletonScope();
container.bind<IGameService>(TYPES.GameService).to(GameService).inSingletonScope();

// --- Mod ---
container.bind<IModRepository>(TYPES.ModRepository).to(SQLiteModRepository).inSingletonScope();
container
  .bind<IModInfoRepository>(TYPES.ModInfoRepository)
  .to(SQLiteModInfoRepository)
  .inSingletonScope();
container
  .bind<IModVersionRepository>(TYPES.ModVersionRepository)
  .to(SQLiteModVersionRepository)
  .inSingletonScope();
container.bind<IModService>(TYPES.ModService).to(ModService).inSingletonScope();

// --- Providers ---
// One service identifier (TYPES.ModProvider), one binding per provider,
// disambiguated by @named. Inject with `@inject(TYPES.ModProvider) @named('modrinth')`
// or resolve dynamically via `getModProvider(name)` below.
container
  .bind<IModProvider>(TYPES.ModProvider)
  .to(ModrinthProvider)
  .inSingletonScope()
  .whenNamed('modrinth');
// TODO: add CurseforgeProvider once implemented:
// container.bind<IModProvider>(TYPES.ModProvider).to(CurseforgeProvider).inSingletonScope().whenNamed('curseforge');

/** Resolve a provider implementation by its name (the @named tag). */
export function getModProvider(provider: ProviderTypes): IModProvider {
  return container.get<IModProvider>(TYPES.ModProvider, { name: provider });
}

export { container };
