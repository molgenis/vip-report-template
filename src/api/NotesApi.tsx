import type {
  Note,
  VariantKey,
  ReportId,
  Classification,
  FeatureIdentifier,
} from "../types/NotesApi";

export interface NotesApi {
  storeNote(note: string, variantKey: VariantKey, reportId: ReportId): Promise<Note>;

  retrieveNote(variantKey: VariantKey, reportId: ReportId): Promise<Note | null>;

  retrieveNotesForVariant(variantKey: VariantKey, reportId: ReportId): Promise<Note[]>;

  retrieveNotes(reportId?: ReportId): Promise<Note[]>;

  storeClassification(
    classification: Omit<Classification, "id" | "createdAt" | "updatedAt">,
  ): Promise<Classification>;

  retrieveClassification(
    variantKey: VariantKey,
    feature: FeatureIdentifier,
    reportId: ReportId,
  ): Promise<Classification | null>;

  retrieveClassifications(reportId: ReportId): Promise<Classification[]>;

  removeNote(noteId: string): Promise<void>;

  removeClassification(classificationId: string): Promise<void>;

  load(excelFile: File): Promise<string>;

  download(reportId: ReportId): Promise<void>;
}