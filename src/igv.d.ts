declare module "igv" {
  export class Browser {
    loadTrack(config: unknown): Promise<unknown>;
    removeAllTracks(): void;
    root: HTMLDivElement;
  }

  export function createBrowser(div: HTMLDivElement, config: unknown): Promise<Browser>;
}
