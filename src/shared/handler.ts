import { ipcRenderer, type OpenDialogOptions } from "electron";
import { IpcChannel } from "./ipc";

export const sharedHandler = {
  openDialog: (options: OpenDialogOptions) => ipcRenderer.invoke(IpcChannel.OpenDialog, options),
};
