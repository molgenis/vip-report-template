import { BrowserNotesApi } from "./BrowserNotesApi";
import { MemoryStorageAdapter } from "./MemoryStorageAdapter";
import type { NotesApi } from "./NotesApi";

let browserNotesApi : NotesApi = undefined;

export function getNotesApi(): NotesApi {
  //In the future switching to integration with rd3 buildtime can be managed here
  if(browserNotesApi === undefined){
    browserNotesApi = new BrowserNotesApi(new MemoryStorageAdapter());
  }
  return browserNotesApi
}
