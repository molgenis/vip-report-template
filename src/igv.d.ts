declare module "igv" {
  export function createBrowser(div: HTMLDivElement, config: unknown): unknown;
  export function removeBrowser(browser: unknown): void;
}
