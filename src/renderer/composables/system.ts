async function openDialog(): Promise<string | undefined> {
  return await window.api.system.openDialog({});
}

async function openExternalLink(url: string): Promise<void> {
  await window.api.system.openExternalLink(url);
}

export const useSystem = () => {
  return {
    openDialog,
    openExternalLink,
  };
};
