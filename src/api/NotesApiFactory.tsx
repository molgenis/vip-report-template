import { BrowserNotesApi } from "./BrowserNotesApi";
import { LocalStorageAdapter } from "./LocalStorageAdapter";
import type { NotesApi } from "./NotesApi";
//import { rd3Api } from "@molgenis/vip-report-rd3";

declare const __EXTERNAL_API__: string | undefined;

export function createNotesApi(): NotesApi {
  if (__EXTERNAL_API__) {
    return undefined; //FIXME rd3Api;
  }
  return new BrowserNotesApi(new LocalStorageAdapter());
}
