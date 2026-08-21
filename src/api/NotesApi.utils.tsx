import type { Note, Classification, VariantKey } from "../types/NotesApi";
import { NotesApi } from "./NotesApi";

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function sameVariant(a: VariantKey, b: VariantKey): boolean {
  return a.chromosome === b.chromosome && a.position === b.position && a.reference === b.reference && a.end === b.end;
}

export function sameVariantAndFeature(a: VariantKey, b: VariantKey): boolean {
  return (
    sameVariant(a, b) &&
    a.alternative === b.alternative &&
    a.ruNr === b.ruNr &&
    a.ru === b.ru &&
    a.feature === b.feature
  );
}

export async function retrieveNotesForVariant(
  api: NotesApi,
  variantKey: VariantKey,
  reportId: string,
  sampleId: string | undefined,
  filterOnAlt: boolean,
): Promise<Note[]> {
  const notes = await api.retrieveNotes(reportId, sampleId);
  if (filterOnAlt) {
    return notes
      .filter((note) => note.sampleId === sampleId && sameVariantAndFeature(note.variantKey, variantKey))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  return notes
    .filter((note) => note.sampleId === sampleId && sameVariant(note.variantKey, variantKey))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function retrieveClassification(
  api: NotesApi,
  variantKey: VariantKey,
  reportId: string,
  sampleId: string | undefined,
): Promise<Classification | null> {
  const all = await api.retrieveClassifications(reportId, sampleId);
  return all.find((c) => c.sampleId === sampleId && sameVariantAndFeature(c.variantKey, variantKey)) ?? null;
}

export function stripOuterQuotes(value: string | number | undefined): string | number | undefined {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (trimmed.length >= 2 && trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export function formatNoteLabel(note: Note): string {
  const feature = note.variantKey.feature ?? "";
  const hgvsC = note.variantKey.hgvsC ?? "";
  const hgvsP = note.variantKey.hgvsP ?? "";

  if (!feature && !hgvsC && !hgvsP) return "";
  if (!hgvsC && !hgvsP) return feature;

  const hgvsPart = hgvsC && hgvsP ? `${hgvsC}(${hgvsP})` : hgvsC ? hgvsC : "";

  return feature ? `${feature}:${hgvsPart}` : hgvsPart;
}
