import type {
  Note,
  VariantKey,
  ReportId,
  Classification,
  FeatureIdentifier,
} from "../types/NotesApi";
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

// ---------- VariantKey helpers ----------

function sameVariantKey(a: VariantKey, b: VariantKey): boolean {
  return (
    a.Chromosome === b.Chromosome &&
    a.Position === b.Position &&
    a.Reference === b.Reference &&
    a.Alternative === b.Alternative &&
    a.RU_NR === b.RU_NR &&
    a.RU === b.RU &&
    a.END === b.END
  );
}

// Flatten VariantKey fields to top-level for storage/Excel
function noteToStored(note: Note): any {
  const vk = note.variantKey;
  return {
    ...note,
    Chromosome: vk.Chromosome,
    Position: vk.Position,
    Reference: vk.Reference,
    Alternative: vk.Alternative,
    RU_NR: vk.RU_NR,
    RU: vk.RU,
    END: vk.END,
  };
}

// Rebuild Note from stored/Excel row
function storedToNote(stored: any): Note {
  const {
    Chromosome,
    Position,
    Reference,
    Alternative,
    RU_NR,
    RU,
    END,
    ...rest
  } = stored;
  return {
    ...rest,
    variantKey: {
      Chromosome,
      Position,
      Reference,
      Alternative,
      RU_NR,
      RU,
      END,
    },
  } as Note;
}

function classificationToStored(c: Classification): any {
  const vk = c.variantKey;
  return {
    ...c,
    Chromosome: vk.Chromosome,
    Position: vk.Position,
    Reference: vk.Reference,
    Alternative: vk.Alternative,
    RU_NR: vk.RU_NR,
    RU: vk.RU,
    END: vk.END,
  };
}

function storedToClassification(stored: any): Classification {
  const {
    Chromosome,
    Position,
    Reference,
    Alternative,
    RU_NR,
    RU,
    END,
    ...rest
  } = stored;
  return {
    ...rest,
    variantKey: {
      Chromosome,
      Position,
      Reference,
      Alternative,
      RU_NR,
      RU,
      END,
    },
  } as Classification;
}

// ---------- load/save using flattened storage ----------

function loadNotes(reportId: ReportId): Note[] {
  const raw = localStorage.getItem(getNotesKey(reportId));
  if (!raw) return [];
  const arr = JSON.parse(raw) as any[];
  return arr.map(storedToNote);
}

function saveNotes(reportId: ReportId, notes: Note[]): void {
  const stored = notes.map(noteToStored);
  localStorage.setItem(getNotesKey(reportId), JSON.stringify(stored));
}

function loadClassifications(reportId: ReportId): Classification[] {
  const raw = localStorage.getItem(getClassificationsKey(reportId));
  if (!raw) return [];
  const arr = JSON.parse(raw) as any[];
  return arr.map(storedToClassification);
}

function saveClassifications(
  reportId: ReportId,
  classifications: Classification[],
): void {
  const stored = classifications.map(classificationToStored);
  localStorage.setItem(getClassificationsKey(reportId), JSON.stringify(stored));
}

// ---------- API implementation ----------

export class BrowserNotesApi implements NotesApi {
  async storeNote(
    note: string,
    variantKey: VariantKey,
    reportId: ReportId,
  ): Promise<Note> {
    console.log("storeNote");
    console.log(variantKey);
    const notes = loadNotes(reportId);
    const now = new Date().toISOString();

    const newNote: Note = {
      id: generateId(),
      content: note,
      variantKey,
      reportId,
      createdAt: now,
      updatedAt: now,
    };

    notes.push(newNote);
    saveNotes(reportId, notes);
    return newNote;
  }

  async retrieveNote(
    variantKey: VariantKey,
    reportId: ReportId,
  ): Promise<Note | null> {
    console.log("retrieveNote");
    const notes = loadNotes(reportId);
    const matchingNotes = notes.filter((n) =>
      sameVariantKey(n.variantKey, variantKey),
    );

    if (matchingNotes.length === 0) return null;

    matchingNotes.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

    return matchingNotes[0];
  }

  async retrieveNotesForVariant(
    variantKey: VariantKey,
    reportId: ReportId,
  ): Promise<Note[]> {
    console.log("retrieveNotesForVariant");
    const notes = loadNotes(reportId);
    return notes.filter((n) => sameVariantKey(n.variantKey, variantKey));
  }

  async storeClassification(
    classification: Omit<Classification, "id" | "createdAt" | "updatedAt">,
  ): Promise<Classification> {
    console.log("storeClassification");
    const classifications = loadClassifications(classification.reportId);
    const existingIndex = classifications.findIndex(
      (c) =>
        sameVariantKey(c.variantKey, classification.variantKey) &&
        c.feature === classification.feature,
    );
    const now = new Date().toISOString();

    const newClassification: Classification = {
      id: generateId(),
      value: classification.value,
      variantKey: classification.variantKey,
      feature: classification.feature,
      reportId: classification.reportId,
      status: classification.status,
      createdAt: existingIndex >= 0 ? classifications[existingIndex].createdAt : now,
      updatedAt: now,
    };

    if (existingIndex >= 0) {
      classifications[existingIndex] = newClassification;
    } else {
      classifications.push(newClassification);
    }

    saveClassifications(classification.reportId, classifications);
    return newClassification;
  }

  async retrieveClassification(
    variantKey: VariantKey,
    feature: FeatureIdentifier,
    reportId: ReportId,
  ): Promise<Classification | null> {
    console.log("retrieveClassification");
    const classifications = loadClassifications(reportId);
    const classification = classifications.find(
      (c) => sameVariantKey(c.variantKey, variantKey) && c.feature === feature,
    );
    return classification ?? null;
  }

  async retrieveNotes(reportId?: ReportId): Promise<Note[]> {
    if (reportId) {
      return loadNotes(reportId);
    }

    const allNotes: Note[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("notes_")) {
        const notesReportId = key.substring(6) as ReportId;
        allNotes.push(...loadNotes(notesReportId));
      }
    }
    return allNotes;
  }

  async retrieveClassifications(reportId: ReportId): Promise<Classification[]> {
    return loadClassifications(reportId);
  }

  async removeNote(noteId: string): Promise<void> {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("notes_")) {
        const reportId = key.substring(6) as ReportId;
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
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("classifications_")) {
        const reportId = key.substring(16) as ReportId;
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
    const { read, utils } = await import("xlsx");

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const data = e.target?.result;
          const workbook = read(data, { type: "array" });

          // Notes sheet
          if (workbook.Sheets["Notes"]) {
            const rawNotes = utils.sheet_to_json<any>(workbook.Sheets["Notes"]);
            for (const stored of rawNotes) {
              const note = storedToNote(stored);
              if (note.reportId) {
                saveNotes(note.reportId, [...loadNotes(note.reportId), note]);
              }
            }
          }

          // Classifications sheet
          if (workbook.Sheets["Classifications"]) {
            const rawClassifications =
              utils.sheet_to_json<any>(workbook.Sheets["Classifications"]);
            for (const stored of rawClassifications) {
              const classification = storedToClassification(stored);
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
    const { utils, writeFile } = await import("xlsx");
    const notes = loadNotes(reportId);
    const classifications = loadClassifications(reportId);

    // Flatten to stored form so VariantKey fields are top-level columns
    const storedNotes = notes.map(noteToStored);
    const storedClassifications = classifications.map(classificationToStored);

    const notesSheet = utils.json_to_sheet(storedNotes);
    const classificationsSheet = utils.json_to_sheet(storedClassifications);
    const workbook = utils.book_new();

    utils.book_append_sheet(workbook, notesSheet, "Notes");
    utils.book_append_sheet(workbook, classificationsSheet, "Classifications");

    writeFile(workbook, `notes_${reportId}.xlsx`);
  }
}

export function createNotesApi(): NotesApi {
  return new BrowserNotesApi();
}