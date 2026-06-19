export interface IModProvider {
  addModByLink(link: string): Promise<void>;
}
