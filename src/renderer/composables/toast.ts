import type { ToastServiceMethods } from 'primevue';
export function handleErrorToast(toast: ToastServiceMethods, e: unknown) {
  if (e instanceof Error) {
    toast.add({ severity: 'error', summary: 'Error', detail: e.message, life: 3000 });
  } else {
    toast.add({ severity: 'error', summary: 'Error', detail: String(e), life: 3000 });
  }
  console.error(e);
  return;
}

export const TOAST_TIMEOUT_MS = 5000;
