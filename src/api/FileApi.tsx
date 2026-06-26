import type { Note, Classification, VariantKey } from "../types/NotesApi";
import type { NotesApi } from "./NotesApi";
import type XLSX from "xlsx";

type FlatNote = Omit<Note, "variantKey"> & VariantKey;
type FlatClassification = Omit<Classification, "variantKey"> & VariantKey;

const NOTE_COLUMNS = [
  "id",
  "content",
  "reportId",
  "sampleId",
  "createdAt",
  "updatedAt",
  "createdBy",
  "Chromosome",
  "Position",
  "Reference",
  "Alternative",
  "END",
  "feature",
  "hgvsC",
  "hgvsP",
] as const;

const CLASSIFICATION_COLUMNS = [
  "id",
  "value",
  "reportId",
  "sampleId",
  "status",
  "createdAt",
  "updatedAt",
  "createdBy",
  "Chromosome",
  "Position",
  "Reference",
  "Alternative",
  "END",
  "feature",
  "hgvsC",
  "hgvsP",
] as const;

export class FileApi {
  constructor(private readonly notesApi: NotesApi) {}

  private flattenVariantKey<T extends { variantKey: VariantKey }>(item: T): Omit<T, "variantKey"> & VariantKey {
    const { variantKey, ...rest } = item;

    return {
      ...rest,
      Chromosome: variantKey.Chromosome,
      Position: variantKey.Position,
      Reference: variantKey.Reference,
      Alternative: variantKey.Alternative,
      END: variantKey.END,
      feature: variantKey.feature,
      hgvsC: variantKey.hgvsC,
      hgvsP: variantKey.hgvsP,
    };
  }

  private unflattenNote(row: FlatNote): Note {
    const { Chromosome, Position, Reference, Alternative, END, feature, hgvsC, hgvsP, ...rest } = row;

    return {
      ...rest,
      variantKey: {
        Chromosome,
        Position: Number(Position),
        Reference,
        Alternative,
        END: END == null ? undefined : Number(END),
        feature: feature ?? "",
        hgvsC: hgvsC ?? "",
        hgvsP: hgvsP ?? "",
      },
    };
  }

  private unflattenClassification(row: FlatClassification): Classification {
    const { Chromosome, Position, Reference, Alternative, END, feature, hgvsC, hgvsP, ...rest } = row;

    return {
      ...rest,
      variantKey: {
        Chromosome,
        Position: Number(Position),
        Reference,
        Alternative,
        END: END == null ? undefined : Number(END),
        feature: feature ?? "",
        hgvsC: hgvsC ?? "",
        hgvsP: hgvsP ?? "",
      },
    };
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

    const missing = expectedColumns.filter((column) => !headers.includes(column));

    if (missing.length > 0) {
      throw new Error(`${sheetName} sheet is missing required columns: ${missing.join(", ")}`);
    }
  }

  async load(excelFile: File): Promise<string> {
    const { read, utils } = await import("xlsx");

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

          // Validate metadata sheet and reportId before importing
          const reportIdFromFile = this.getReportIdFromWorkbook(utils, workbook);

          // Optional: you could compare reportIdFromFile with current reportId if needed

          const notesSheet = workbook.Sheets["Notes"];

          if (notesSheet) {
            this.validateSheet(utils, notesSheet, NOTE_COLUMNS, "Notes");

            const rows = utils.sheet_to_json<FlatNote>(notesSheet);

            const seen = new Set<string>();

            for (const row of rows) {
              if (!row.id || seen.has(row.id)) continue;

              seen.add(row.id);

              await this.notesApi.storeNote(this.unflattenNote(row));
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

              await this.notesApi.storeClassification(this.unflattenClassification(row));
            }
          }

          resolve(`Successfully imported notes and classifications from Excel for reportId ${reportIdFromFile}`);
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
      const flatNotes = notes.map((note) => this.flattenVariantKey(note));

      const notesSheet = utils.json_to_sheet(flatNotes);

      utils.book_append_sheet(workbook, notesSheet, "Notes");
    }

    if (classifications.length > 0) {
      const flatClassifications = classifications.map((classification) => this.flattenVariantKey(classification));

      const classificationsSheet = utils.json_to_sheet(flatClassifications);

      utils.book_append_sheet(workbook, classificationsSheet, "Classifications");
    }

    // Always add a Metadata sheet with reportId
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

  /**
   * Extracts and validates reportId from the Metadata sheet of a workbook.
   * Throws if the sheet is missing or reportId is not present.
   */
  private getReportIdFromWorkbook(utils: typeof import("xlsx").utils, workbook: XLSX.WorkBook): string {
    const metadataSheet = workbook.Sheets["Metadata"];
    if (!metadataSheet) {
      throw new Error("Metadata sheet is missing");
    }

    const rows = utils.sheet_to_json<{ key: string; value: string }>(metadataSheet);

    if (!rows || rows.length === 0) {
      throw new Error("Metadata sheet is empty");
    }

    const reportRow = rows.find((row) => row.key === "reportId");
    if (!reportRow || !reportRow.value) {
      throw new Error("Metadata sheet does not contain a reportId");
    }

    return String(reportRow.value);
  }

  /**
   * Public helper: read a File and return the reportId from its Metadata sheet.
   */
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
