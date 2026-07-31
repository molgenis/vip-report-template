import { beforeEach, describe, expect, it, vi } from "vitest";
import { BrowserNotesApi } from "../../src/api/BrowserNotesApi";
import type { StorageAdapter } from "../../src/api/StorageAdapter";

vi.mock("../../src/api/NotesApi.utils", async () => {
    const actual = await vi.importActual<typeof import("../../src/api/NotesApi.utils")>(
      "../../src/api/NotesApi.utils"
    );
    return {
      ...actual,
      generateId: vi.fn(() => "generatedId"),
      sameVariantAndFeature: vi.fn(
        (a, b) => JSON.stringify(a) === JSON.stringify(b)
      ),
    };
  });

describe("BrowserNotesApi", () => {
  let storage: StorageAdapter;
  let api: BrowserNotesApi;

  const map = new Map<string, string>();

  beforeEach(() => {
    map.clear();

    storage = {
      get: vi.fn((key: string) => map.get(key) ?? null),
      set: vi.fn((key: string, value: string) => {
        map.set(key, value);
      }),
      remove: vi.fn((key: string) => {
        map.delete(key);
      }),
      keys: vi.fn(() => [...map.keys()]),
    };

    api = new BrowserNotesApi(storage);
  });

  const variant = {
    chromosome: "1",
    position: 123,
    reference: "A",
    alternative: "T",
    feature: "",
    hgvsC: "",
    hgvsP: "",
    ru: "",
  };

  describe("storeNote", () => {
    it("stores a new note", async () => {
      await api.storeNote({
        id: "",
        reportId: "report1",
        sampleId: "sample1",
        content: "testNote",
        variantKey: variant,
        createdBy: "vipper",
      } as any);

      const notes = await api.retrieveNotes("report1");

      expect(notes).toHaveLength(1);
      expect(notes[0]).toMatchObject({
        id: "generatedId",
        content: "testNote",
        createdBy: "vipper",
      });

      expect(api.hasUnsavedData("report1")).toBe(true);
    });

    it("updates an existing note", async () => {
      await api.storeNote({
        id: "id1",
        reportId: "report1",
        sampleId: "sample1",
        content: "old",
        variantKey: variant,
        createdBy: "vipper",
      } as any);

      await api.storeNote({
        id: "id1",
        reportId: "report1",
        sampleId: "sample1",
        content: "new",
        variantKey: variant,
        createdBy: "vipper",
      } as any);

      const notes = await api.retrieveNotes("report1");

      expect(notes).toHaveLength(1);
      expect(notes[0].content).toBe("new");
    });
  });

  describe("removeNote", () => {
    it("removes a note", async () => {
      await api.storeNote({
        id: "id1",
        reportId: "report1",
        sampleId: "sample1",
        content: "testNote",
        variantKey: variant,
        createdBy: "",
      } as any);

      await api.removeNote("id1", "report1");

      expect(await api.retrieveNotes("report1")).toHaveLength(0);
    });
  });

  describe("storeClassification", () => {
    it("stores a classification", async () => {
      await api.storeClassification({
        reportId: "report1",
        sampleId: "sample1",
        value: "Benign",
        status: "approved",
        variantKey: variant,
      } as any);

      const list = await api.retrieveClassifications("report1");

      expect(list).toHaveLength(1);
      expect(list[0]).toMatchObject({
        id: "generatedId",
        value: "Benign",
      });
    });

    it("updates an existing classification", async () => {
      await api.storeClassification({
        reportId: "report1",
        sampleId: "sample1",
        value: "Benign",
        status: "approved",
        variantKey: variant,
      } as any);

      await api.storeClassification({
        reportId: "report1",
        sampleId: "sample1",
        value: "Pathogenic",
        status: "approved",
        variantKey: variant,
      } as any);

      const list = await api.retrieveClassifications("report1");

      expect(list).toHaveLength(1);
      expect(list[0].value).toBe("Pathogenic");
    });
  });

  describe("removeClassification", () => {
    it("removes a classification", async () => {
      const c = await api.storeClassification({
        reportId: "report1",
        sampleId: "sample1",
        value: "Benign",
        status: "approved",
        variantKey: variant,
      } as any);

      await api.removeClassification(c.id, "sample1", "report1");

      expect(await api.retrieveClassifications("report1")).toHaveLength(0);
    });
  });

  describe("username", () => {
    it("stores current username", () => {
      api.setCurrentUserName("vipper");

      expect(api.getCurrentUserName()).toBe("vipper");
    });
  });

  describe("saved state", () => {
    it("tracks saved state", () => {
      expect(api.hasUnsavedData("report1")).toBe(false);

      api.setSavedState(false, "report1");

      expect(api.hasUnsavedData("report1")).toBe(true);

      api.setSavedState(true, "report1");

      expect(api.hasUnsavedData("report1")).toBe(false);
    });
  });

  describe("clear", () => {
    it("removes all report data", async () => {
      await api.storeNote({
        id: "id1",
        reportId: "report1",
        sampleId: "sample1",
        content: "testNote",
        variantKey: variant,
        createdBy: "",
      } as any);

      await api.storeClassification({
        reportId: "report1",
        sampleId: "sample1",
        value: "Benign",
        status: "approved",
        variantKey: variant,
      } as any);

      api.clear("report1");

      expect(await api.retrieveNotes("report1")).toEqual([]);
      expect(await api.retrieveClassifications("report1")).toEqual([]);
      expect(api.hasUnsavedData("report1")).toBe(false);
    });
  });
});