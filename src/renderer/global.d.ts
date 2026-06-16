import type { Api } from '../shared/ipc';

// Make the contextBridge-exposed API visible to TypeScript in the renderer.
declare global {
  interface Window {
    api: Api;
  }
}

export {};
