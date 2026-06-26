import type { Note, Classification, ClassificationOption } from "../types/NotesApi";
import type { NotesApi } from "./NotesApi";
import { generateId, sameVariantAndFeature } from "./NotesApi.utils";
import { StorageAdapter } from "./StorageAdapter";

export class BrowserNotesApi implements NotesApi {
  constructor(private storage: StorageAdapter) {}

  clear(reportId: string) {
    this.storage.remove(this.getNotesKey(reportId));
    this.storage.remove(this.getClassificationsKey(reportId));
    this.storage.remove(this.getStateKey(reportId));

    this.setSavedState(true, reportId);
  }

  getCurrentUserName(): string | undefined {
    return undefined;
  }

  hasUnsavedData(reportId: string): boolean {
    console.log("HERE!");
    const raw = this.storage.get(this.getStateKey(reportId));
    if (raw == null) {
      return false;
    }

    try {
      const saved = JSON.parse(raw) as boolean;
      return !saved;
    } catch {
      //in case of problems assume unsaved data
      return true;
    }
  }

  setSavedState(saved: boolean, reportId: string): void {
    this.storage.set(this.getStateKey(reportId), JSON.stringify(saved));
  }

  private getNotesKey(reportId: string) {
    return `notes_${reportId}`;
  }

  private getStateKey(reportId: string) {
    return `state_${reportId}`;
  }

  private getClassificationsKey(reportId: string) {
    return `classifications_${reportId}`;
  }

  private loadNotes(reportId: string): Note[] {
    const raw = this.storage.get(this.getNotesKey(reportId));
    return raw ? JSON.parse(raw) : [];
  }

  private saveNotes(reportId: string, notes: Note[]) {
    this.setSavedState(false, reportId);
    this.storage.set(this.getNotesKey(reportId), JSON.stringify(notes));
  }

  private loadClassifications(reportId: string): Classification[] {
    const raw = this.storage.get(this.getClassificationsKey(reportId));
    return raw ? JSON.parse(raw) : [];
  }

  private saveClassifications(reportId: string, data: Classification[]) {
    this.setSavedState(false, reportId);
    this.storage.set(this.getClassificationsKey(reportId), JSON.stringify(data));
  }

  async storeNote(note: Note) {
    const notes = this.loadNotes(note.reportId);
    const now = new Date().toISOString();

    const id = note.id ? note.id : generateId();

    const newNote: Note = {
      id,
      content: note.content,
      variantKey: note.variantKey,
      reportId: note.reportId,
      sampleId: note.sampleId,
      createdAt: note.createdAt ? note.createdAt : now,
      updatedAt: now,
      createdBy: "",
    };

    const idx = notes.findIndex((n) => n.id === id);

    if (idx >= 0) {
      notes[idx] = {
        ...notes[idx],
        ...newNote,
        createdAt: notes[idx].createdAt,
      };
    } else {
      notes.push(newNote);
    }

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
    classification: Omit<Classification, "id" | "createdAt" | "updatedAt">,
  ): Promise<Classification> {
    const list = this.loadClassifications(classification.reportId);
    const now = new Date().toISOString();

    const idx = list.findIndex(
      (c) => c.reportId === classification.reportId && sameVariantAndFeature(c.variantKey, classification.variantKey),
    );

    const updated: Classification = {
      id: idx >= 0 ? list[idx].id : generateId(),
      value: classification.value,
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

  async removeNote(id: string, reportId: string) {
    const notes = this.loadNotes(reportId);
    this.saveNotes(
      reportId,
      notes.filter((n) => !(n.id === id)),
    );
  }

  async removeClassification(id: string, sampleId: string, reportId: string) {
    const list = this.loadClassifications(reportId);
    this.saveClassifications(
      reportId,
      list.filter((c) => !(c.id === id && c.sampleId === sampleId)),
    );
  }

  async getClassificationOptions(): Promise<ClassificationOption[]> {
    return undefined;
  }
}
