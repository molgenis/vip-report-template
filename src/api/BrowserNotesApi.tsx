import type { Note, Classification, ClassificationOption } from "../types/NotesApi";
import type { NotesApi } from "./NotesApi";
import {
  generateId,
  sameVariantAndAllele,
} from "./NotesApi.utils";
import { StorageAdapter } from "./StorageAdapter";

export class BrowserNotesApi implements NotesApi {
  constructor(private storage: StorageAdapter) {}

  private getNotesKey(reportId: string) {
    return `notes_${reportId}`;
  }

  private getClassificationsKey(reportId: string) {
    return `classifications_${reportId}`;
  }

  private loadNotes(reportId: string): Note[] {
    const raw = this.storage.get(this.getNotesKey(reportId));
    return raw ? JSON.parse(raw) : [];
  }

  private saveNotes(reportId: string, notes: Note[]) {
    this.storage.set(
      this.getNotesKey(reportId),
      JSON.stringify(notes)
    );
  }

  private loadClassifications(reportId: string): Classification[] {
    const raw = this.storage.get(this.getClassificationsKey(reportId));
    return raw ? JSON.parse(raw) : [];
  }

  private saveClassifications(reportId: string, data: Classification[]) {
    this.storage.set(
      this.getClassificationsKey(reportId),
      JSON.stringify(data)
    );
  }

  async storeNote(note: Omit<Note, "id" | "createdAt" | "updatedAt">) {
    const notes = this.loadNotes(note.reportId);
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
    this.saveNotes(note.reportId, notes);
  }

  async retrieveNotes(reportId?: string): Promise<Note[]> {
    if (!reportId) {
      const all: Note[] = [];

      this.storage.keys?.().forEach((key) => {
        if (key.startsWith("notes_")) {
          const raw = this.storage.get(key);
          if (raw) all.push(...JSON.parse(raw));
        }
      });

      return all;
    }

    return this.loadNotes(reportId);
  }

  async retrieveClassifications(reportId: string) {
    return this.loadClassifications(reportId);
  }

  async storeClassification(
    classification: Omit<Classification, "id" | "createdAt" | "updatedAt">
  ): Promise<Classification> {
    const list = this.loadClassifications(classification.reportId);
    const now = new Date().toISOString();

    const idx = list.findIndex(
      c =>
        c.reportId === classification.reportId &&
        sameVariantAndAllele(c.variantKey, classification.variantKey)
    );

    const updated: Classification = {
      id: idx >= 0 ? list[idx].id : generateId(),
      value: classification.value,
      feature: classification.feature,
      variantKey: classification.variantKey,
      reportId: classification.reportId,
      sampleId: classification.sampleId,
      status: classification.status,
      createdAt: idx >= 0 ? list[idx].createdAt : now,
      updatedAt: now,
      createdBy: "",
    };

    if (idx >= 0) list[idx] = updated;
    else list.push(updated);

    this.saveClassifications(classification.reportId, list);
    return updated;
  }

  async removeNote(id: string, sampleId: string, reportId: string) {
    const notes = this.loadNotes(reportId);
    this.saveNotes(
      reportId,
      notes.filter(n => !(n.id === id && n.sampleId === sampleId))
    );
  }

  async removeClassification(id: string, sampleId: string, reportId: string) {
    const list = this.loadClassifications(reportId);
    this.saveClassifications(
      reportId,
      list.filter(c => !(c.id === id && c.sampleId === sampleId))
    );
  }

  async getClassificationOptions(): Promise<ClassificationOption[]> {
    return [
      { value: "B", description: "Benign" },
      { value: "LB", description: "Likely Benign" },
      { value: "VUS", description: "Variant of Uncertain Significance" },
      { value: "LP", description: "Likely Pathogenic" },
      { value: "P", description: "Pathogenic" },
    ];
  }
}