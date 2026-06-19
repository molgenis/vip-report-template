import type {
  Note,
  Classification,
  ClassificationOption,
  VariantKey,
} from "../types/NotesApi";

export interface NotesApi {
  storeNote(note: Note): Promise<void>;

  storeClassification(
    classification: Classification,
  ): Promise<void>;

  retrieveNotes(reportId: string, sampleId: string): Promise<Note[]>;

  retrieveClassifications(reportId: string, sampleId: string): Promise<Classification[]>;

  removeNote(variantKey: VariantKey, sampleId: string, reportId: string): Promise<void>;

  removeClassification(variantKey: VariantKey, sampleId: string, reportId: string): Promise<void>;

  getClassificationOptions(): Promise<ClassificationOption[]>;
}