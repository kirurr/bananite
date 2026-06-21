export const useDialog = () => {
  async function openDialog(): Promise<string | undefined> {
    return await window.api.openDialog({});
  }

  return {
    openDialog,
  };
};
