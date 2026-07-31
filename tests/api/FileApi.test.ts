import { beforeEach, describe, expect, it, vi } from "vitest";
import { FileApi } from "../../src/api/FileApi";
import * as XLSX from "xlsx";

vi.mock("xlsx", async () => {
  const actual = await vi.importActual<typeof import("xlsx")>("xlsx");

  return {
    ...actual,
    read: vi.fn(),
    writeFile: vi.fn(),
  };
});

describe("FileApi", () => {
  let notesApi: any;
  let fileApi: FileApi;

  beforeEach(() => {
    vi.clearAllMocks();

    vi.stubGlobal(
      "FileReader",
      class {
        onload: ((event: ProgressEvent<FileReader>) => void) | null = null;
        onerror: (() => void) | null = null;

        readAsArrayBuffer() {
          this.onload?.({
            target: {
              result: new ArrayBuffer(8),
            },
          } as ProgressEvent<FileReader>);
        }
      },
    );

    notesApi = {
      storeNote: vi.fn().mockResolvedValue(undefined),
      storeClassification: vi.fn().mockResolvedValue(undefined),
      retrieveNotes: vi.fn().mockResolvedValue([]),
      retrieveClassifications: vi.fn().mockResolvedValue([]),
      getCurrentUserName: vi.fn().mockReturnValue("test-user"),
      setSavedState: vi.fn(),
      isUsernameFromBackend: vi.fn().mockReturnValue(false),
    };

    fileApi = new FileApi(notesApi);
  });

  function createWorkbookWithNotes() {
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet([
        {
          key: "reportId",
          value: "reportTestId",
        },
      ]),
      "Metadata",
    );

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet([
        {
          id: "testNoteId",
          content: '"testNote"',
          sampleId: "sample1",
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: '"vipper"',
          chromosome: "1",
          position: 123,
          reference: "A",
          alternative: "T",
          end: undefined,
          feature: "",
          hgvsC: "",
          hgvsP: "",
          ru: "",
          ruNr: undefined,
        },
      ]),
      "Notes",
    );

    return workbook;
  }

  function createWorkbookWithClassifications() {
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet([
        {
          key: "reportId",
          value: "testReport",
        },
      ]),
      "Metadata",
    );

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet([
        {
          id: "classificationId",
          value: '"pathogenic"',
          sampleId: "sample1",
          status: "approved",
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: '"vipper"',
          chromosome: "2",
          position: 456,
          reference: "G",
          alternative: "C",
          end: undefined,
          feature: "",
          hgvsC: "",
          hgvsP: "",
          ru: "",
          ruNr: undefined,
        },
      ]),
      "Classifications",
    );

    return workbook;
  }

  describe("load()", () => {
    it("imports notes", async () => {
      vi.mocked(XLSX.read).mockReturnValue(createWorkbookWithNotes());

      const result = await fileApi.load({} as File);

      expect(result).toContain("reportTestId");

      expect(notesApi.storeNote).toHaveBeenCalledTimes(1);

      expect(notesApi.storeNote).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "testNoteId",
          reportId: "reportTestId",
          content: "testNote",
          createdBy: "vipper",
          variantKey: expect.objectContaining({
            chromosome: "1",
            position: 123,
            reference: "A",
            alternative: "T",
          }),
        }),
      );
    });

    it("imports classifications", async () => {
      vi.mocked(XLSX.read).mockReturnValue(createWorkbookWithClassifications());

      const result = await fileApi.load({} as File);

      expect(result).toContain("testReport");

      expect(notesApi.storeClassification).toHaveBeenCalledTimes(1);
    });

    it("throws when metadata sheet is missing", async () => {
      const workbook = XLSX.utils.book_new();

      vi.mocked(XLSX.read).mockReturnValue(workbook);

      await expect(fileApi.load({} as File)).rejects.toThrow(
        "Metadata sheet is missing",
      );
    });

    it("throws when reportId is missing", async () => {
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet([
          {
            key: "otherKey",
            value: "123",
          },
        ]),
        "Metadata",
      );

      vi.mocked(XLSX.read).mockReturnValue(workbook);

      await expect(fileApi.load({} as File)).rejects.toThrow(
        "Metadata sheet does not contain a reportId",
      );
    });
  });

  describe("download()", () => {
    it("writes workbook", async () => {
      await fileApi.download("report");

      expect(XLSX.writeFile).toHaveBeenCalledWith(
        expect.anything(),
        "notes_report.xlsx",
      );

      expect(notesApi.setSavedState).toHaveBeenCalledWith(true, "report");
    });
  });

  describe("getReportIdFromFile()", () => {
    it("returns report id", async () => {
      vi.mocked(XLSX.read).mockReturnValue(createWorkbookWithNotes());

      const file = {
        arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
      } as unknown as File;

      await expect(fileApi.getReportIdFromFile(file)).resolves.toBe(
        "reportTestId",
      );
    });
  });
});