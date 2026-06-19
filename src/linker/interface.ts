export interface ILinker {
  createLink(from_path: string, to_path: string): Promise<void>;
}
