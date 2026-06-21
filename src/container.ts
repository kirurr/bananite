import { Container } from 'inversify';
import { NAMED_CONSTANTS, TYPES } from './types';
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
import type { IProviderAPI } from './providers/api/interface';
import { ModrinthAPIv270 } from './providers/api/modrinthApiv270';
import type { ILinker } from './linker/interface';
import { WindowsLinker } from './linker/windows-linker';
import type { IProfileRepository } from './profile/repository/interface';
import { SQLiteProfileRepository } from './profile/repository/sqliteRepository';

const container = new Container();

container
  .bind<IProfileRepository>(TYPES.ProfileRepository)
  .to(SQLiteProfileRepository)
  .inSingletonScope();

container
  .bind<ILinker>(TYPES.Linker)
  .to(WindowsLinker)
  .inSingletonScope()
  .whenNamed(NAMED_CONSTANTS.system.windows);

container
  .bind<IProviderAPI>(TYPES.ProviderAPI)
  .to(ModrinthAPIv270)
  .inSingletonScope()
  .whenNamed(NAMED_CONSTANTS.providers.modrinth);
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
  .whenNamed(NAMED_CONSTANTS.providers.modrinth);
// TODO: add CurseforgeProvider once implemented:
// container.bind<IModProvider>(TYPES.ModProvider).to(CurseforgeProvider).inSingletonScope().whenNamed('curseforge');

/** Resolve a provider implementation by its name (the @named tag). */
export function getModProvider(provider: ProviderTypes): IModProvider {
  return container.get<IModProvider>(TYPES.ModProvider, { name: provider });
}

/** Resolve a game-API implementation by its name (the @named tag). */
export function getGameAPI(provider: ProviderTypes): IProviderAPI {
  return container.get<IProviderAPI>(TYPES.ProviderAPI, { name: provider });
}

/** Resolve the linker implementation for the current platform. */
export function getLinker(): ILinker {
  // TODO: pick linux/mac linker once implemented; only windows for now.
  return container.get<ILinker>(TYPES.Linker, { name: NAMED_CONSTANTS.system.windows });
}

export { container };
