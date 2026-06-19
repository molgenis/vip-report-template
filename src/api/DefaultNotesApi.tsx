import type { Note, Classification, VariantKey, ClassificationOption } from "../types/NotesApi";
import type { NotesApi } from "./NotesApi";
import {
  generateId,
  loadNotes,
  saveNotes,
  loadClassifications,
  saveClassifications,
  removeNoteById,
  removeClassificationById,
} from "./NotesApi.utils";

export class BrowserNotesApi implements NotesApi {
  async storeNote(
    note: Omit<Note, "id" | "createdAt" | "updatedAt">,
  ): Promise<void> {
    const notes = loadNotes(note.reportId);
    const now = new Date().toISOString();

    const newNote: Note = {
      id: generateId(),
      content: note.content,
      variantKey: note.variantKey,
      reportId: note.reportId,
      sampleId: note.sampleId,
      createdAt: now,
      updatedAt: now,
      createdBy: "",
    };

    notes.push(newNote);
    saveNotes(note.reportId, notes);
  }

  async storeClassification(
    classification: Omit<Classification, "id" | "createdAt" | "updatedAt">,
  ): Promise<void> {
    const classifications = loadClassifications(classification.reportId);
    const existingIndex = classifications.findIndex(
      (c) => c.feature === classification.feature &&
        c.reportId === classification.reportId &&
        c.sampleId === classification.sampleId &&
        c.variantKey.Chromosome === classification.variantKey.Chromosome &&
        c.variantKey.Position === classification.variantKey.Position &&
        c.variantKey.Reference === classification.variantKey.Reference &&
        c.variantKey.Alternative === classification.variantKey.Alternative &&
        c.variantKey.RU_NR === classification.variantKey.RU_NR &&
        c.variantKey.RU === classification.variantKey.RU &&
        c.variantKey.END === classification.variantKey.END,
    );

    const now = new Date().toISOString();

    const newClassification: Classification = {
      id: generateId(),
      value: classification.value,
      variantKey: classification.variantKey,
      feature: classification.feature,
      reportId: classification.reportId,
      sampleId: classification.sampleId,
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
  }

  async retrieveNotes(reportId?: string): Promise<Note[]> {
    if (reportId) return loadNotes(reportId);

    const allNotes: Note[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("notes_")) {
        allNotes.push(...loadNotes(key.substring("notes_".length)));
      }
    }
    return allNotes;
  }

  async retrieveClassifications(reportId: string): Promise<Classification[]> {
    return loadClassifications(reportId);
  }

  async removeNote(variantKey: VariantKey, sampleId: string, reportId: string): Promise<void> {
    removeNoteById(variantKey, sampleId, reportId);
  }

  async removeClassification(variantKey: VariantKey, sampleId: string, reportId: string): Promise<void> {
    removeClassificationById(variantKey, sampleId, reportId);
  }

  async getClassificationOptions(): Promise<ClassificationOption[]> {
    return [
      {value: "B", description: "Benign"},
      {value: "LB", description: "Likely Benign"},
      {value: "VUS", description: "Variant of Uncertain Significance"},
      {value: "LP", description: "Likely Pathogenic"},
      {value: "P", description: "Pathogenic"},
    ];
  }
}

export function createNotesApi(): NotesApi {
  return new BrowserNotesApi();
}