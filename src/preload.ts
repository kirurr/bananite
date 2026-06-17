// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';
import { IpcChannel, type Api } from './shared/ipc';
import type { NewMod } from './mod/schema';

// Everything the renderer is allowed to call goes through this typed bridge.
const api: Api = {
  mods: {
    list: () => ipcRenderer.invoke(IpcChannel.ModsList),
    add: (mod: NewMod) => ipcRenderer.invoke(IpcChannel.ModsAdd, mod),
    setEnabled: (id, enabled) => ipcRenderer.invoke(IpcChannel.ModsSetEnabled, id, enabled),
    delete: (id) => ipcRenderer.invoke(IpcChannel.ModsDelete, id),
  },
};

contextBridge.exposeInMainWorld('api', api);
