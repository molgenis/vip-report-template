import type {
  Note,
  Classification,
  VariantKey,
} from "../types/NotesApi";
import { NotesApi } from "./NotesApi";

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function sameVariant(a: VariantKey, b: VariantKey): boolean {
  return (
    a.Chromosome === b.Chromosome &&
    a.Position === b.Position &&
    a.Reference === b.Reference &&
    a.END === b.END
  );
}

export function sameVariantAndFeature(
  a: VariantKey,
  b: VariantKey
): boolean {
  return (
    sameVariant(a, b) &&
    a.Alternative === b.Alternative &&
    a.feature === b.feature
  );
}

export async function retrieveNotesForVariant(
  api: NotesApi,
  variantKey: VariantKey,
  reportId: string,
  sampleId: string | undefined,
  filterOnAlt: boolean
): Promise<Note[]> {
  const notes = await api.retrieveNotes(reportId, sampleId);

  if (filterOnAlt) {
    return notes.filter((note) =>
    sameVariantAndFeature(note.variantKey, variantKey)
    );
  }

  return notes.filter((note) =>
    sameVariant(note.variantKey, variantKey)
  );
}

export async function retrieveClassification(
  api: NotesApi,
  variantKey: VariantKey,
  reportId: string,
  sampleId: string | undefined,
): Promise<Classification | null> {
  const all = await api.retrieveClassifications(reportId, sampleId);

  return (
    all.find((c) =>
      sameVariantAndFeature(c.variantKey, variantKey)
    ) ?? null
  );
}