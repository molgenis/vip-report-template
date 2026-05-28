import type { Note, VariantKey, ReportId, Classification, FeatureIdentifier, Status } from "../types/NotesApi";
import type { NotesApi } from "./NotesApi";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function getNotesKey(reportId: ReportId): string {
  return `notes_${reportId}`;
}

function getClassificationsKey(reportId: ReportId): string {
  return `classifications_${reportId}`;
}

function loadNotes(reportId: ReportId): Note[] {
  const raw = localStorage.getItem(getNotesKey(reportId));
  return raw ? JSON.parse(raw) : [];
}

function saveNotes(reportId: ReportId, notes: Note[]): void {
  localStorage.setItem(getNotesKey(reportId), JSON.stringify(notes));
}

function loadClassifications(reportId: ReportId): Classification[] {
  const raw = localStorage.getItem(getClassificationsKey(reportId));
  return raw ? JSON.parse(raw) : [];
}

function saveClassifications(reportId: ReportId, classifications: Classification[]): void {
  localStorage.setItem(getClassificationsKey(reportId), JSON.stringify(classifications));
}

function variantKeyToString(variantKey: VariantKey): string {
  return `${variantKey.Chromosome}:${variantKey.Position}:${variantKey.Reference}:${variantKey.Alternative}:${variantKey.Identifier}`;
}

export class BrowserNotesApi implements NotesApi {
  async storeNote(note: string, variantKey: VariantKey, reportId: ReportId): Promise<Note> {
    const notes = loadNotes(reportId);
    const existingIndex = notes.findIndex((n) => variantKeyToString(n.variantKey) === variantKeyToString(variantKey));

    const now = new Date().toISOString();
    const newNote: Note = {
      id: generateId(),
      content: note,
      variantKey,
      reportId,
      createdAt: existingIndex >= 0 ? notes[existingIndex].createdAt : now,
      updatedAt: now,
    };

    if (existingIndex >= 0) {
      notes[existingIndex] = newNote;
    } else {
      notes.push(newNote);
    }

    saveNotes(reportId, notes);
    return newNote;
  }

  async retrieveNote(variantKey: VariantKey, reportId: ReportId): Promise<Note | null> {
    const notes = loadNotes(reportId);
    const note = notes.find((n) => variantKeyToString(n.variantKey) === variantKeyToString(variantKey));
    return note ?? null;
  }

  async storeClassification(
    classification: Omit<Classification, "id" | "createdAt" | "updatedAt">,
    variantKey: VariantKey,
    feature: FeatureIdentifier,
    reportId: ReportId,
    status: Status,
  ): Promise<Classification> {
    const classifications = loadClassifications(reportId);
    const existingIndex = classifications.findIndex(
      (c) => variantKeyToString(c.variantKey) === variantKeyToString(variantKey) && c.feature === feature,
    );

    const now = new Date().toISOString();
    const newClassification: Classification = {
      id: generateId(),
      value: classification.value,
      variantKey,
      feature,
      reportId,
      status,
      createdAt: existingIndex >= 0 ? classifications[existingIndex].createdAt : now,
      updatedAt: now,
    };

    if (existingIndex >= 0) {
      classifications[existingIndex] = newClassification;
    } else {
      classifications.push(newClassification);
    }

    saveClassifications(reportId, classifications);
    return newClassification;
  }

  async retrieveClassification(
    variantKey: VariantKey,
    feature: FeatureIdentifier,
    reportId: ReportId,
  ): Promise<Classification | null> {
    const classifications = loadClassifications(reportId);
    const classification = classifications.find(
      (c) => variantKeyToString(c.variantKey) === variantKeyToString(variantKey) && c.feature === feature,
    );
    return classification ?? null;
  }

  async retrieveNotes(reportId?: ReportId): Promise<Note[]> {
    if (reportId) {
      return loadNotes(reportId);
    }
    // Retrieve notes from all reports
    const allNotes: Note[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("notes_")) {
        const notesReportId = key.substring(6);
        allNotes.push(...loadNotes(notesReportId));
      }
    }
    return allNotes;
  }

  async retrieveClassifications(reportId: ReportId): Promise<Classification[]> {
    return loadClassifications(reportId);
  }

  async removeNote(noteId: string): Promise<void> {
    // Find and remove note from all reports
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("notes_")) {
        const reportId = key.substring(6);
        const notes = loadNotes(reportId);
        const filtered = notes.filter((n) => n.id !== noteId);
        if (filtered.length < notes.length) {
          saveNotes(reportId, filtered);
          return;
        }
      }
    }
  }

  async removeClassification(classificationId: string): Promise<void> {
    // Find and remove classification from all reports
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("classifications_")) {
        const reportId = key.substring(16);
        const classifications = loadClassifications(reportId);
        const filtered = classifications.filter((c) => c.id !== classificationId);
        if (filtered.length < classifications.length) {
          saveClassifications(reportId, filtered);
          return;
        }
      }
    }
  }

  async load(excelFile: File): Promise<string> {
    // Requires 'xlsx' library: npm install xlsx
    const { read, utils } = await import("xlsx");

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = e.target?.result;
          const workbook = read(data, { type: "array" });

          // Parse Notes sheet
          if (workbook.Sheets["Notes"]) {
            const notesData = utils.sheet_to_json(workbook.Sheets["Notes"]) as unknown as Note[];
            for (const note of notesData) {
              if (note.reportId) {
                saveNotes(note.reportId, [...loadNotes(note.reportId), note]);
              }
            }
          }
          // Parse Classifications sheet
          if (workbook.Sheets["Classifications"]) {
            const classificationsData = utils.sheet_to_json<Classification>(workbook.Sheets["Classifications"]);
            for (const classification of classificationsData) {
              if (classification.reportId) {
                saveClassifications(classification.reportId, [
                  ...loadClassifications(classification.reportId),
                  classification,
                ]);
              }
            }
          }

          resolve("Successfully imported notes and classifications from Excel");
        } catch (error) {
          reject(`Failed to parse Excel file: ${error}`);
        }
      };
      reader.onerror = () => reject("Failed to read Excel file");
      reader.readAsArrayBuffer(excelFile);
    });
  }

  async download(reportId: ReportId): Promise<void> {
    console.log("Download API!!!");
    // Requires 'xlsx' library: npm install xlsx
    const { utils, writeFile } = await import("xlsx");

    const notes = loadNotes(reportId);
    const classifications = loadClassifications(reportId);

    const notesSheet = utils.json_to_sheet(notes);
    const classificationsSheet = utils.json_to_sheet(classifications);

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, notesSheet, "Notes");
    utils.book_append_sheet(workbook, classificationsSheet, "Classifications");

    writeFile(workbook, `notes_${reportId}.xlsx`);
  }
}

// Factory function for easier instantiation
export function createNotesApi(): NotesApi {
  return new BrowserNotesApi();
}
