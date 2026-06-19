import type { NotesApi } from "./NotesApi";
import { createNotesApi } from "././DefaultNotesApi";
//import { rd3Api } from "@molgenis/vip-report-rd3";

declare const __EXTERNAL_API__: string | undefined;

export async function createApi(): Promise<NotesApi> {
  if (__EXTERNAL_API__) {
    return undefined; //FIXME rd3Api;
  }
  return createNotesApi();
}
