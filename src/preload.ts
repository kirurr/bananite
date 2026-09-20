import { contextBridge, ipcRenderer } from 'electron';
import { contract } from './ipc/contract';

// { game: ['listVersions'] } -> { game: { listVersions: (...args) => invoke('game:listVersions', ...args) } }
// Plain objects only: contextBridge copies own properties, a Proxy arrives empty.
const api = Object.fromEntries(
  Object.entries(contract).map(([namespace, methods]) => [
    namespace,
    Object.fromEntries(
      methods.map((method) => [
        method,
        (...args: unknown[]) => ipcRenderer.invoke(`${namespace}:${method}`, ...args),
      ]),
    ),
  ]),
);

contextBridge.exposeInMainWorld('api', api);
