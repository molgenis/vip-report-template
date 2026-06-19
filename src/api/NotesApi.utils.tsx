import type { Note, VariantKey, Classification } from "../types/NotesApi";

const NOTES_PREFIX = "notes_";
const CLASSIFICATIONS_PREFIX = "classifications_";

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function getNotesKey(reportId: string): string {
  return `${NOTES_PREFIX}${reportId}`;
}

export function getClassificationsKey(reportId: string): string {
  return `${CLASSIFICATIONS_PREFIX}${reportId}`;
}

export function sameVariantKey(a: VariantKey, b: VariantKey): boolean {
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

export function noteToStored(note: Note): any {
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

export function storedToNote(stored: any): Note {
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

export function classificationToStored(c: Classification): any {
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

export function storedToClassification(stored: any): Classification {
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

export function loadNotes(reportId: string): Note[] {
  const raw = localStorage.getItem(getNotesKey(reportId));
  if (!raw) return [];
  return (JSON.parse(raw) as any[]).map(storedToNote);
}

export function saveNotes(reportId: string, notes: Note[]): void {
  localStorage.setItem(getNotesKey(reportId), JSON.stringify(notes.map(noteToStored)));
}

export function loadClassifications(reportId: string): Classification[] {
  const raw = localStorage.getItem(getClassificationsKey(reportId));
  if (!raw) return [];
  return (JSON.parse(raw) as any[]).map(storedToClassification);
}

export function saveClassifications(
  reportId: string,
  classifications: Classification[],
): void {
  localStorage.setItem(
    getClassificationsKey(reportId),
    JSON.stringify(classifications.map(classificationToStored)),
  );
}

export function retrieveNotesForVariant(
  variantKey: VariantKey,
  reportId: string,
): Note[] {
  return loadNotes(reportId).filter((note) => sameVariantKey(note.variantKey, variantKey));
}

export function retrieveClassification(
  variantKey: VariantKey,
  feature: string,
  reportId: string,
): Classification | null {
  return (
    loadClassifications(reportId).find(
      (c) => sameVariantKey(c.variantKey, variantKey) && c.feature === feature,
    ) ?? null
  );
}

export function removeItemFromAllReports<T extends { id: string }>(
  prefix: string,
  loader: (reportId: string) => T[],
  saver: (reportId: string, items: T[]) => void,
  itemId: string,
): void {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith(prefix)) continue;

    const reportId = key.substring(prefix.length);
    const items = loader(reportId);
    const filtered = items.filter((item) => item.id !== itemId);

    if (filtered.length < items.length) {
      saver(reportId, filtered);
      return;
    }
  }
}

export function removeNoteById(
    variantKey: VariantKey,
    sampleId: string,
    reportId: string,
  ): void {
    const key = getNotesKey(reportId);
    const raw = localStorage.getItem(key);
    if (!raw) return;
  
    const notes = loadNotes(reportId);
    const index = notes.findIndex(
      (note) =>
        note.sampleId === sampleId &&
        note.reportId === reportId &&
        sameVariantKey(note.variantKey, variantKey),
    );
  
    if (index === -1) return;
  
    const filtered = notes.filter((_, i) => i !== index);
    saveNotes(reportId, filtered);
  }

  export function removeClassificationById(
    variantKey: VariantKey,
    sampleId: string,
    reportId: string,
  ): void {
    const classifications = loadClassifications(reportId);
    const index = classifications.findIndex(
      (c) =>
        c.sampleId === sampleId &&
        c.reportId === reportId &&
        sameVariantKey(c.variantKey, variantKey),
    );
  
    if (index === -1) return;
  
    const filtered = classifications.filter((_, i) => i !== index);
    saveClassifications(reportId, filtered);
  }