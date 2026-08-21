import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRoot } from "solid-js";
import { useUpload } from "../../../src/utils/upload/useUpload";

const { mockNotesApi, mockFileApi, notifyDataChanged } = vi.hoisted(() => {
    return {
      mockNotesApi: {
        hasUnsavedData: vi.fn(),
        setSavedState: vi.fn(),
      },
      mockFileApi: {
        getReportIdFromFile: vi.fn(),
        load: vi.fn(),
      },
      notifyDataChanged: vi.fn(),
    };
  });
  
  vi.mock("../../../src/api/NotesApiFactory", () => ({
    getNotesApi: () => mockNotesApi,
  }));
  
  vi.mock("../../../src/api/FileApi", () => ({
    createFileApi: () => mockFileApi,
  }));
  
  vi.mock("../../../src/utils/upload/uploadSignal", () => ({
    notifyDataChanged: () => notifyDataChanged(),
  }));

vi.mock("./uploadSignal", () => ({
  notifyDataChanged: () => notifyDataChanged(),
}));

function makeFile(name = "test.xlsx"): File {
  return new File(["dummy content"], name, {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

function makeChangeEvent(file: File | null): Event {
  const input = document.createElement("input");
  input.type = "file";

  if (file) {
    Object.defineProperty(input, "files", {
      value: [file],
      writable: false,
      configurable: true,
    });
  }

  return { target: input } as unknown as Event;
}

describe("useUpload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("trigger() clicks the hidden file input when not uploading", () => {
    createRoot((dispose) => {
      const { trigger, setInputRef } = useUpload({ reportId: "report-1" });
      const input = document.createElement("input");
      input.type = "file";
      const clickSpy = vi.spyOn(input, "click");
      setInputRef(input);

      trigger();

      expect(clickSpy).toHaveBeenCalledOnce();
      dispose();
    });
  });

  it("trigger() does nothing while an upload is already in progress", () => {
    createRoot((dispose) => {
      mockFileApi.getReportIdFromFile.mockReturnValue(new Promise(() => {})); // never resolves
      const { trigger, handleFileSelect, setInputRef, uploading } = useUpload({ reportId: "report-1" });
  
      const input = document.createElement("input");
      const clickSpy = vi.spyOn(input, "click");
      setInputRef(input);
  
      void handleFileSelect(makeChangeEvent(makeFile())); // fire and forget — intentionally never resolves
      expect(uploading()).toBe(true);
  
      trigger();
      expect(clickSpy).not.toHaveBeenCalled();
  
      dispose();
    });
  });

  it("handleFileSelect does nothing when no file is selected", async () => {
    await createRoot(async (dispose) => {
      const { handleFileSelect, uploading, message } = useUpload({ reportId: "report-1" });

      await handleFileSelect(makeChangeEvent(null));

      expect(uploading()).toBe(false);
      expect(message()).toBeNull();
      expect(mockFileApi.getReportIdFromFile).not.toHaveBeenCalled();
      dispose();
    });
  });

  it("sets a failure message and does not call fileApi when reportId is null", async () => {
    await createRoot(async (dispose) => {
      const { handleFileSelect, message } = useUpload({ reportId: null });

      await handleFileSelect(makeChangeEvent(makeFile()));

      expect(message()).toBe("Upload failed: report is not ready yet.");
      expect(mockFileApi.getReportIdFromFile).not.toHaveBeenCalled();
      dispose();
    });
  });

  it("loads the file and notifies data changed when the report ids match", async () => {
    await createRoot(async (dispose) => {
      mockFileApi.getReportIdFromFile.mockResolvedValue("report-1");
      mockFileApi.load.mockResolvedValue("Loaded 3 notes");
      mockNotesApi.hasUnsavedData.mockReturnValue(false);

      const { handleFileSelect, message, uploading } = useUpload({ reportId: "report-1" });

      await handleFileSelect(makeChangeEvent(makeFile()));

      expect(mockFileApi.load).toHaveBeenCalledWith(expect.any(File), "report-1");
      expect(mockNotesApi.setSavedState).toHaveBeenCalledWith(true, "report-1");
      expect(message()).toBe("Loaded 3 notes");
      expect(notifyDataChanged).toHaveBeenCalledOnce();
      expect(uploading()).toBe(false);
      dispose();
    });
  });

  it("passes the inverse of hasUnsavedData as the saved state", async () => {
    await createRoot(async (dispose) => {
      mockFileApi.getReportIdFromFile.mockResolvedValue("report-1");
      mockFileApi.load.mockResolvedValue("ok");
      mockNotesApi.hasUnsavedData.mockReturnValue(true);

      const { handleFileSelect } = useUpload({ reportId: "report-1" });
      await handleFileSelect(makeChangeEvent(makeFile()));

      expect(mockNotesApi.setSavedState).toHaveBeenCalledWith(false, "report-1");
      dispose();
    });
  });

  it("prompts for confirmation when the file's reportId differs, and proceeds on confirm", async () => {
    await createRoot(async (dispose) => {
      const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
      mockFileApi.getReportIdFromFile.mockResolvedValue("report-2");
      mockFileApi.load.mockResolvedValue("Loaded anyway");
      mockNotesApi.hasUnsavedData.mockReturnValue(false);

      const { handleFileSelect, message } = useUpload({ reportId: "report-1" });
      await handleFileSelect(makeChangeEvent(makeFile()));

      expect(confirmSpy).toHaveBeenCalledOnce();
      expect(mockFileApi.load).toHaveBeenCalledWith(expect.any(File), "report-1");
      expect(message()).toBe("Loaded anyway");
      expect(notifyDataChanged).toHaveBeenCalledOnce();

      confirmSpy.mockRestore();
      dispose();
    });
  });

  it("cancels the upload when the user declines the mismatched-report confirmation", async () => {
    await createRoot(async (dispose) => {
      const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);
      mockFileApi.getReportIdFromFile.mockResolvedValue("report-2");

      const { handleFileSelect, message, uploading } = useUpload({ reportId: "report-1" });
      await handleFileSelect(makeChangeEvent(makeFile()));

      expect(mockFileApi.load).not.toHaveBeenCalled();
      expect(message()).toBeNull();
      expect(uploading()).toBe(false);
      expect(notifyDataChanged).not.toHaveBeenCalled();

      confirmSpy.mockRestore();
      dispose();
    });
  });

  it("sets a failure message when fileApi.load rejects", async () => {
    await createRoot(async (dispose) => {
      mockFileApi.getReportIdFromFile.mockResolvedValue("report-1");
      mockFileApi.load.mockRejectedValue(new Error("network error"));
      mockNotesApi.hasUnsavedData.mockReturnValue(false);

      const { handleFileSelect, message, uploading } = useUpload({ reportId: "report-1" });
      await handleFileSelect(makeChangeEvent(makeFile()));

      expect(message()).toBe("Upload failed: Error: network error");
      expect(uploading()).toBe(false);
      expect(notifyDataChanged).not.toHaveBeenCalled();
      dispose();
    });
  });

  it("clears the input value after a completed upload attempt", async () => {
    await createRoot(async (dispose) => {
      mockFileApi.getReportIdFromFile.mockResolvedValue("report-1");
      mockFileApi.load.mockResolvedValue("ok");
      mockNotesApi.hasUnsavedData.mockReturnValue(false);

      const { handleFileSelect } = useUpload({ reportId: "report-1" });
      const event = makeChangeEvent(makeFile());
      await handleFileSelect(event);

      expect((event.target as HTMLInputElement).value).toBe("");
      dispose();
    });
  });
});