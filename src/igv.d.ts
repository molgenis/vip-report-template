declare module "igv" {
  export class Browser {
    loadTrack(config: unknown): Promise<unknown>;
  }

  export function createBrowser(div: HTMLDivElement, config: unknown): Browser;
  export function removeBrowser(browser: Browser): void;
}
