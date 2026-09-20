import { ipcMain, type BrowserWindow } from 'electron';
import type { Contract } from '../ipc/contract';
import { gameHandlers } from '../game/handlers';
import { modsHandlers } from '../mod/handlers';
import { profileHandlers } from '../profile/handlers';
import { systemHandlers } from '../system/handlers';

// `never[]` accepts any signature; `unknown[]` is needed to call one.
type Handler = (...args: never[]) => unknown;
type InvokeHandler = (...args: unknown[]) => unknown;

// `satisfies`, not an annotation: the inferred type is what types window.api.
// Catches a contract method with no handler.
function createHandlers(mainWindow: BrowserWindow | null) {
  return {
    game: gameHandlers(),
    mods: modsHandlers(),
    profile: profileHandlers(),
    system: systemHandlers(mainWindow),
  } satisfies { [N in keyof Contract]: Record<Contract[N][number], Handler> };
}

export type HandlerMap = ReturnType<typeof createHandlers>;

// Catches the reverse: a handler missing from the contract, so unreachable from
// preload. Each such name becomes a compile error naming it.
type AssertNever<T extends never> = T;

export type ContractCoversHandlers = AssertNever<
  {
    [N in keyof HandlerMap]: Exclude<keyof HandlerMap[N], Contract[N][number]>;
  }[keyof HandlerMap]
>;

// One ipcMain.handle per method, on the channels preload derives from contract.
export function registerIpcHandlers(mainWindow: BrowserWindow | null): void {
  for (const [namespace, handlers] of Object.entries(createHandlers(mainWindow))) {
    // The union of signatures is not callable; the checks above guarantee shape.
    const entries = Object.entries(handlers as unknown as Record<string, InvokeHandler>);

    for (const [method, handler] of entries) {
      ipcMain.handle(`${namespace}:${method}`, (_event, ...args: unknown[]) => handler(...args));
    }
  }
}
