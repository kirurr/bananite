import { ipcRenderer, type OpenDialogOptions } from 'electron';
import { IpcChannel } from './ipc';

export const systemHandler = {
  openDialog: (options: OpenDialogOptions) => ipcRenderer.invoke(IpcChannel.OpenDialog, options),
  openExternalLink: (url: string) => ipcRenderer.invoke(IpcChannel.OpenExternalLink, url),
};
