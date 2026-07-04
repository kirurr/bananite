export interface ILinker {
  createLink(file: string): Promise<void>;
  deleteLink(file: string): Promise<void>;
}
