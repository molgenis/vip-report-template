import type {
  Note,
  Classification,
  ClassificationOption,
} from "../types/NotesApi";

export interface NotesApi {
  storeNote(note: Note): Promise<void>;

  storeClassification(
    classification: Classification,
  ): Promise<Classification>;

  retrieveNotes(reportId: string, sampleId: string | undefined): Promise<Note[]>;

  retrieveClassifications(reportId: string, sampleId: string | undefined): Promise<Classification[]>;

  removeNote(id: string, reportId: string): Promise<void>;

  removeClassification(id: string, sampleId: string, reportId: string): Promise<void>;

  getClassificationOptions(): Promise<ClassificationOption[]>;

  getCurrentUserName(): string | undefined;

  hasUnsavedData(reportId: string): boolean;

  setSavedState(saved: boolean, reportId: string): void;

  clear(reportId: string);
}