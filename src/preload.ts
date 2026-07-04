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
    downloadMod: (mod, gameVersion, loader) =>
      ipcRenderer.invoke(IpcChannel.DownloadMod, mod, gameVersion, loader),
  },
  profile: {
    create: (profile) => ipcRenderer.invoke(IpcChannel.CreateProfile, profile),
    get: (id) => ipcRenderer.invoke(IpcChannel.GetProfile, id),
    list: () => ipcRenderer.invoke(IpcChannel.ListProfiles),
    addMod: (profileId, modId) => ipcRenderer.invoke(IpcChannel.AddModToProfile, profileId, modId),
    removeMod: (profileId, modId) =>
      ipcRenderer.invoke(IpcChannel.RemoveModFromProfile, profileId, modId),
    update: (profileId, data) => ipcRenderer.invoke(IpcChannel.UpdateProfile, profileId, data),
    exportProfile: (profileId) => ipcRenderer.invoke(IpcChannel.ExportProfile, profileId),
    importProfile: () => ipcRenderer.invoke(IpcChannel.ImportProfile),
  },
  ...sharedHandler,
};

contextBridge.exposeInMainWorld('api', api);
