import { contextBridge, ipcRenderer } from 'electron';
import { IpcChannel, type Api } from './shared/ipc';
import { sharedHandler } from './shared/handler';

const api: Api = {
  game: {
    listVersions: () => ipcRenderer.invoke(IpcChannel.VersionList),
    listLoaders: () => ipcRenderer.invoke(IpcChannel.LoaderList),
    syncData: () => ipcRenderer.invoke(IpcChannel.SyncData),
    getSettings: () => ipcRenderer.invoke(IpcChannel.GameSettings),
    setSettings: (data) => ipcRenderer.invoke(IpcChannel.SetGameSettings, data),
  },
  mods: {
    addByLink: (link) => ipcRenderer.invoke(IpcChannel.ModsAddByLink, link),
    list: () => ipcRenderer.invoke(IpcChannel.ModsList),
		downloadMod: (mod, gameVersion, loader) => ipcRenderer.invoke(IpcChannel.DownloadMod, mod, gameVersion, loader),
  },
  ...sharedHandler,
};

contextBridge.exposeInMainWorld('api', api);
