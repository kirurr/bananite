import { contextBridge, ipcRenderer } from 'electron';
import { IpcChannel, type Api } from './shared/ipc';

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
  },
};

contextBridge.exposeInMainWorld('api', api);
