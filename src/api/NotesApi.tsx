import { Note, VariantKey, ReportId, Classification, FeatureIdentifier, Status } from "../types/NotesApi";

export interface NotesApi {
  storeNote(note: string, variantKey: VariantKey, reportId: ReportId): Promise<Note>;
  retrieveNote(variantKey: VariantKey, reportId: ReportId): Promise<Note | null>;
  storeClassification(
    classification: Omit<Classification, "id" | "createdAt" | "updatedAt">,
    variantKey: VariantKey,
    feature: FeatureIdentifier,
    reportId: ReportId,
    status: Status,
  ): Promise<Classification>;
  retrieveClassification(
    variantKey: VariantKey,
    feature: FeatureIdentifier,
    reportId: ReportId,
  ): Promise<Classification | null>;
  retrieveNotes(reportId?: ReportId): Promise<Note[]>;
  retrieveClassifications(reportId: ReportId): Promise<Classification[]>;
  removeNote(noteId: string): Promise<void>;
  removeClassification(classificationId: string): Promise<void>;
  load(excelFile: File): Promise<string>; // accepts Excel file, returns success message
  download(reportId: ReportId): Promise<void>; // downloads Excel with 2 tabs: notes & classifications
}
