import type { Note, Classification, VariantKey } from "../types/NotesApi";
import type { NotesApi } from "./NotesApi";
import type XLSX from "xlsx";
import { stripOuterQuotes } from "./NotesApi.utils";

type FlatNote = Omit<Note, "variantKey" | "reportId"> &
  VariantKey & {
    createdAt: number;
    updatedAt: number;
  };
type FlatClassification = Omit<Classification, "variantKey" | "reportId"> &
  VariantKey & {
    createdAt: number;
    updatedAt: number;
  };

const NOTE_COLUMNS = [
  "id",
  "content",
  "sampleId",
  "createdAt",
  "updatedAt",
  "createdBy",
  "chromosome",
  "position",
  "reference",
  "alternative",
  "end",
  "feature",
  "hgvsC",
  "hgvsP",
  "ru",
  "ruNr",
] as const;

const CLASSIFICATION_COLUMNS = [
  "id",
  "value",
  "sampleId",
  "status",
  "createdAt",
  "updatedAt",
  "createdBy",
  "chromosome",
  "position",
  "reference",
  "alternative",
  "end",
  "feature",
  "hgvsC",
  "hgvsP",
  "ru",
  "ruNr",
] as const;

function parseOptionalNumber(value: number | string | null | undefined): number | undefined {
  if (value === null || value === undefined) return undefined;
  const cleaned = stripOuterQuotes(value) as number | string;
  const num = Number(cleaned);
  return Number.isNaN(num) ? undefined : num;
}

function buildVariantKey(row: {
  chromosome: string;
  position: number | string;
  reference: string;
  alternative: string | null;
  end?: number | string | null;
  feature?: string;
  hgvsC?: string;
  hgvsP?: string;
  ru?: string;
  ruNr?: number | string | null;
}): VariantKey {
  const { chromosome, position, reference, alternative, end, feature, hgvsC, hgvsP, ru, ruNr } = row;

  return {
    chromosome,
    position: parseOptionalNumber(position)!,
    reference,
    alternative,
    end: parseOptionalNumber(end),
    feature: feature ?? "",
    hgvsC: hgvsC ?? "",
    hgvsP: hgvsP ?? "",
    ru: ru ?? "",
    ruNr: parseOptionalNumber(ruNr),
  };
}

export class FileApi {
  constructor(private readonly notesApi: NotesApi) {}

  private flattenVariantKey(item: {
    id: string;
    content?: string;
    value?: string;
    sampleId?: string;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    chromosome: string;
    position: number;
    reference: string;
    alternative: string | null;
    end?: number;
    feature?: string;
    hgvsC?: string;
    hgvsP?: string;
    ru?: string;
    ruNr?: number;
  }): FlatNote | FlatClassification {
    return item as FlatNote | FlatClassification;
  }

  private unflattenNote(row: FlatNote, reportId: string): Note {
    const {
      chromosome,
      position,
      reference,
      alternative,
      end,
      feature,
      hgvsC,
      hgvsP,
      ru,
      ruNr,
      createdBy,
      content,
      createdAt,
      updatedAt,
      ...rest
    } = row;

    return {
      ...rest,
      reportId,
      content: stripOuterQuotes(content) as string,
      createdBy: (stripOuterQuotes(createdBy) as string) || this.notesApi.getCurrentUserName() || "",
      createdAt: this.excelSerialToDate(createdAt),
      updatedAt: this.excelSerialToDate(updatedAt),
      variantKey: buildVariantKey({
        chromosome,
        position,
        reference,
        alternative,
        end,
        feature,
        hgvsC,
        hgvsP,
        ru,
        ruNr,
      }),
    };
  }

  private unflattenClassification(row: FlatClassification, reportId: string): Classification {
    const {
      chromosome,
      position,
      reference,
      alternative,
      end,
      feature,
      hgvsC,
      hgvsP,
      ru,
      ruNr,
      createdBy,
      value,
      createdAt,
      updatedAt,
      ...rest
    } = row;

    return {
      ...rest,
      createdAt: this.excelSerialToDate(createdAt),
      updatedAt: this.excelSerialToDate(updatedAt),
      reportId,
      value: stripOuterQuotes(value) as string,
      createdBy: (stripOuterQuotes(createdBy) as string) || "",
      variantKey: buildVariantKey({
        chromosome,
        position,
        reference,
        alternative,
        end,
        feature,
        hgvsC,
        hgvsP,
        ru,
        ruNr,
      }),
    };
  }

  private excelSerialToDate(serial: number): Date {
    const excelEpochUTC = Date.UTC(1899, 11, 30);
    const utcDate = new Date(excelEpochUTC + serial * 86400 * 1000);

    // Reinterpret the UTC-based components as local time
    return new Date(
      utcDate.getUTCFullYear(),
      utcDate.getUTCMonth(),
      utcDate.getUTCDate(),
      utcDate.getUTCHours(),
      utcDate.getUTCMinutes(),
      utcDate.getUTCSeconds(),
      utcDate.getUTCMilliseconds(),
    );
  }

  private validateSheet(
    utils: typeof import("xlsx").utils,
    sheet: unknown,
    expectedColumns: readonly string[],
    sheetName: string,
  ): void {
    const rows = utils.sheet_to_json<(string | number)[]>(sheet, {
      header: 1,
    });

    if (rows.length === 0) {
      throw new Error(`${sheetName} sheet is empty`);
    }

    const headers = (rows[0] ?? []).map(String);

    const effectiveExpectedColumns =
      sheetName === "Classifications" ? expectedColumns.filter((c) => c !== "createdBy") : expectedColumns;

    const missing = effectiveExpectedColumns.filter((column) => !headers.includes(column));

    if (missing.length > 0) {
      throw new Error(`${sheetName} sheet is missing required columns: ${missing.join(", ")}`);
    }
  }

  async load(excelFile: File, reportId: string): Promise<string> {
    const { read, utils } = await import("xlsx");

    this.notesApi.clear(reportId);

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const data = e.target?.result;

          if (!data) {
            reject("Failed to read Excel file");
            return;
          }

          const workbook = read(data, { type: "array" });
          const notesSheet = workbook.Sheets["Notes"];

          if (notesSheet) {
            this.validateSheet(utils, notesSheet, NOTE_COLUMNS, "Notes");

            const rows = utils.sheet_to_json<FlatNote>(notesSheet);
            const seen = new Set<string>();

            for (const row of rows) {
              if (!row.id || seen.has(row.id)) continue;

              seen.add(row.id);
              await this.notesApi.storeNote(this.unflattenNote(row, reportId));
            }
          }

          const classificationsSheet = workbook.Sheets["Classifications"];

          if (classificationsSheet) {
            this.validateSheet(utils, classificationsSheet, CLASSIFICATION_COLUMNS, "Classifications");

            const rows = utils.sheet_to_json<FlatClassification>(classificationsSheet);
            const seen = new Set<string>();

            for (const row of rows) {
              if (!row.id || seen.has(row.id)) continue;

              seen.add(row.id);
              await this.notesApi.storeClassification(this.unflattenClassification(row, reportId));
            }
          }

          resolve(`Successfully imported notes and classifications from Excel`);
        } catch (error) {
          console.error(error);

          reject(error instanceof Error ? error.message : "Failed to parse Excel file");
        }
      };

      reader.onerror = () => reject("Failed to read Excel file");

      reader.readAsArrayBuffer(excelFile);
    });
  }

  async download(reportId: string): Promise<void> {
    const { utils, writeFile } = await import("xlsx");

    const notes = await this.notesApi.retrieveNotes(reportId, undefined);
    const classifications = await this.notesApi.retrieveClassifications(reportId, undefined);

    const workbook = utils.book_new();

    if (notes.length > 0) {
      const flatNotes = notes.map((note) =>
        this.flattenVariantKey({
          id: note.id,
          content: note.content,
          sampleId: note.sampleId,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt,
          createdBy: (stripOuterQuotes(note.createdBy) as string) ?? "",
          chromosome: note.variantKey.chromosome,
          position: note.variantKey.position,
          reference: note.variantKey.reference,
          alternative: note.variantKey.alternative,
          end: note.variantKey.end,
          feature: note.variantKey.feature,
          hgvsC: note.variantKey.hgvsC,
          hgvsP: note.variantKey.hgvsP,
          ru: note.variantKey.ru,
          ruNr: note.variantKey.ruNr,
        }),
      );

      const notesSheet = utils.json_to_sheet(flatNotes);
      utils.book_append_sheet(workbook, notesSheet, "Notes");
    }

    if (classifications.length > 0) {
      const useBackendUsername = this.notesApi.isUsernameFromBackend?.() ?? false;

      const flatClassifications = classifications.map((classification) => {
        return this.flattenVariantKey({
          id: classification.id,
          value: classification.value,
          sampleId: classification.sampleId,
          status: classification.status,
          createdAt: classification.createdAt,
          updatedAt: classification.updatedAt,
          createdBy:
            useBackendUsername && classification.createdBy
              ? ((stripOuterQuotes(classification.createdBy) as string) ?? "")
              : "",
          chromosome: classification.variantKey.chromosome,
          position: classification.variantKey.position,
          reference: classification.variantKey.reference,
          alternative: classification.variantKey.alternative,
          end: classification.variantKey.end,
          feature: classification.variantKey.feature,
          hgvsC: classification.variantKey.hgvsC,
          hgvsP: classification.variantKey.hgvsP,
          ru: classification.variantKey.ru,
          ruNr: classification.variantKey.ruNr,
        });
      });

      const classificationsSheet = utils.json_to_sheet(flatClassifications);

      utils.book_append_sheet(workbook, classificationsSheet, "Classifications");
    }

    const metadataSheet = utils.json_to_sheet([
      {
        key: "reportId",
        value: reportId,
      },
    ]);

    utils.book_append_sheet(workbook, metadataSheet, "Metadata");

    writeFile(workbook, `notes_${reportId}.xlsx`);
    this.notesApi.setSavedState(true, reportId);
  }

  private getReportIdFromWorkbook(utils: typeof import("xlsx").utils, workbook: XLSX.WorkBook): string {
    const metadataSheet = workbook.Sheets["Metadata"];
    if (!metadataSheet) {
      throw new Error("Metadata sheet is missing");
    }

    const rows = utils.sheet_to_json<{
      key: string;
      value: string;
    }>(metadataSheet);

    if (!rows || rows.length === 0) {
      throw new Error("Metadata sheet is empty");
    }

    const reportRow = rows.find((row) => row.key === "reportId");
    if (!reportRow || !reportRow.value) {
      throw new Error("Metadata sheet does not contain a reportId");
    }

    return String(reportRow.value);
  }

  async getReportIdFromFile(excelFile: File): Promise<string> {
    const { read, utils } = await import("xlsx");

    const data = await excelFile.arrayBuffer();
    const workbook = read(data, { type: "array" });

    return this.getReportIdFromWorkbook(utils, workbook);
  }
}

export function createFileApi(notesApi: NotesApi): FileApi {
  return new FileApi(notesApi);
}
