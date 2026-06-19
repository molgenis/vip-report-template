import type { Note, Classification } from "../types/NotesApi";
import type { NotesApi } from "./NotesApi";

export class FileApi {
  constructor(private readonly notesApi: NotesApi) {}

  async load(excelFile: File): Promise<string> {
    const { read, utils } = await import("xlsx");

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const data = e.target?.result;
          const workbook = read(data, { type: "array" });

            //FIXME: validate

          if (workbook.Sheets["Notes"]) {
            const rawNotes = utils.sheet_to_json<Note>(workbook.Sheets["Notes"]);
            for (const note of rawNotes) {
              await this.notesApi.storeNote(
                note
              );
            }
          }

          if (workbook.Sheets["Classifications"]) {
            const classifications =
              utils.sheet_to_json<Classification>(
                workbook.Sheets["Classifications"],
              );
            for (const classification of classifications) {
              await this.notesApi.storeClassification(classification);
          }

          resolve("Successfully imported notes and classifications from Excel");
        }
      }
      catch(e) {
        console.log("FIXME")
    };

      reader.onerror = () => reject("Failed to read Excel file");
      reader.readAsArrayBuffer(excelFile);
    }
  });
}

  async download(reportId: string): Promise<void> {
    const { utils, writeFile } = await import("xlsx");

    const notes = await this.notesApi.retrieveNotes(reportId);
    const classifications = await this.notesApi.retrieveClassifications(reportId);

    // For Excel, you probably want flattened variant fields.
    // Here I assume you’re OK with nested variantKey; if not,
    // you can replicate the flattening from DefaultNotesApi.
    const notesSheet = utils.json_to_sheet(notes);
    const classificationsSheet = utils.json_to_sheet(classifications);
    const workbook = utils.book_new();

    utils.book_append_sheet(workbook, notesSheet, "Notes");
    utils.book_append_sheet(workbook, classificationsSheet, "Classifications");

    writeFile(workbook, `notes_${reportId}.xlsx`);
  }
}

export function createFileApi(notesApi: NotesApi): FileApi {
  return new FileApi(notesApi);
}