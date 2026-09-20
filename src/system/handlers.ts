import { dialog, shell, type BrowserWindow, type OpenDialogOptions } from 'electron';

export function systemHandlers(mainWindow: BrowserWindow | null) {
  return {
    openDialog: async (options: OpenDialogOptions = {}) => {
      if (!mainWindow) return undefined;

      const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
        ...options,
      });

      if (result.canceled) return undefined;
      return result.filePaths[0];
    },

    openExternalLink: async (url: string) => {
      await shell.openExternal(url);
    },
  };
}
