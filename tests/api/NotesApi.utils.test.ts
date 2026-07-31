import { describe, expect, it, vi } from "vitest";
import {
  generateId,
  sameVariant,
  sameVariantAndFeature,
  retrieveNotesForVariant,
  retrieveClassification,
  stripOuterQuotes,
} from "../../src/api/NotesApi.utils";
import { VariantKey } from "../../src/types/NotesApi";

describe("NotesApi.utils", () => {
  describe("generateId", () => {
    it("generates a non-empty id", () => {
      const id = generateId();

      expect(id).toBeTruthy();
      expect(typeof id).toBe("string");
    });

    it("generates different ids", () => {
      const first = generateId();
      const second = generateId();

      expect(first).not.toBe(second);
    });
  });

  describe("sameVariant", () => {
    const baseVariant: VariantKey = {
      chromosome: "1",
      position: 123,
      reference: "A",
      end: 123,
      alternative: "T",
      ruNr: undefined,
      ru: undefined,
      feature: "",
      hgvsC: "",
      hgvsP: "",
    };

    it("returns true for variants with the same core fields", () => {
      expect(
        sameVariant(baseVariant, {
          ...baseVariant,
          alternative: "G",
          feature: "different",
        })
      ).toBe(true);
    });

    it("returns false when chromosome differs", () => {
      expect(
        sameVariant(baseVariant, {
          ...baseVariant,
          chromosome: "2",
        })
      ).toBe(false);
    });

    it("returns false when position differs", () => {
      expect(
        sameVariant(baseVariant, {
          ...baseVariant,
          position: 124,
        })
      ).toBe(false);
    });

    it("returns false when reference differs", () => {
      expect(
        sameVariant(baseVariant, {
          ...baseVariant,
          reference: "G",
        })
      ).toBe(false);
    });

    it("returns false when end differs", () => {
      expect(
        sameVariant(baseVariant, {
          ...baseVariant,
          end: 999,
        })
      ).toBe(false);
    });
  });

  describe("sameVariantAndFeature", () => {
    const variant: VariantKey = {
      chromosome: "1",
      position: 123,
      reference: "A",
      end: 123,
      alternative: "T",
      ruNr: 1,
      ru: "repeat",
      feature: "GENE1",
      hgvsC: "",
      hgvsP: "",
    };

    it("returns true for identical variants", () => {
      expect(sameVariantAndFeature(variant, variant)).toBe(true);
    });

    it("returns false when alternative differs", () => {
      expect(
        sameVariantAndFeature(variant, {
          ...variant,
          alternative: "G",
        })
      ).toBe(false);
    });

    it("returns false when repeat unit number differs", () => {
      expect(
        sameVariantAndFeature(variant, {
          ...variant,
          ruNr: 2,
        })
      ).toBe(false);
    });

    it("returns false when repeat unit differs", () => {
      expect(
        sameVariantAndFeature(variant, {
          ...variant,
          ru: "other",
        })
      ).toBe(false);
    });

    it("returns false when feature differs", () => {
      expect(
        sameVariantAndFeature(variant, {
          ...variant,
          feature: "GENE2",
        })
      ).toBe(false);
    });
  });

  describe("retrieveNotesForVariant", () => {
    const variant: VariantKey = {
        chromosome: "1",
        position: 123,
        reference: "A",
        end: 123,
        alternative: "T",
        ruNr: 1,
        ru: "repeat",
        feature: "GENE1",
        hgvsC: "",
        hgvsP: ""
    };

    it("filters notes using sameVariantAndFeature when filterOnAlt is true", async () => {
      const api = {
        retrieveNotes: vi.fn().mockResolvedValue([
          {
            sampleId: "sample1",
            variantKey: variant,
            content: "match",
          },
          {
            sampleId: "sample1",
            variantKey: {
              ...variant,
              feature: "OTHER",
            },
            content: "no match",
          },
        ]),
      } as any;

      const result = await retrieveNotesForVariant(
        api,
        variant,
        "report1",
        "sample1",
        true
      );

      expect(result).toHaveLength(1);
      expect(result[0].content).toBe("match");
    });

    it("filters notes using sameVariant when filterOnAlt is false", async () => {
      const api = {
        retrieveNotes: vi.fn().mockResolvedValue([
          {
            sampleId: "sample1",
            variantKey: {
              ...variant,
              alternative: "G",
              feature: "OTHER",
            },
          },
        ]),
      } as any;

      const result = await retrieveNotesForVariant(
        api,
        variant,
        "report1",
        "sample1",
        false
      );

      expect(result).toHaveLength(1);
    });

    it("ignores notes from other samples", async () => {
      const api = {
        retrieveNotes: vi.fn().mockResolvedValue([
          {
            sampleId: "sample2",
            variantKey: variant,
          },
        ]),
      } as any;

      const result = await retrieveNotesForVariant(
        api,
        variant,
        "report1",
        "sample1",
        true
      );

      expect(result).toEqual([]);
    });
  });

  describe("retrieveClassification", () => {
    it("returns matching classification", async () => {
      const variant: VariantKey = {
          chromosome: "1",
          position: 123,
          reference: "A",
          end: 123,
          alternative: "T",
          ruNr: undefined,
          ru: undefined,
          feature: "GENE1",
          hgvsC: "",
          hgvsP: ""
      };

      const classification = {
        sampleId: "sample1",
        variantKey: variant,
        value: "Pathogenic",
      };

      const api = {
        retrieveClassifications: vi.fn().mockResolvedValue([
          classification,
        ]),
      } as any;

      const result = await retrieveClassification(
        api,
        variant,
        "report1",
        "sample1"
      );

      expect(result).toEqual(classification);
    });

    it("returns null when no classification exists", async () => {
      const api = {
        retrieveClassifications: vi.fn().mockResolvedValue([]),
      } as any;

      const result = await retrieveClassification(
        api,
        {} as any,
        "report1",
        "sample1"
      );

      expect(result).toBeNull();
    });
  });

    describe("stripOuterQuotes", () => {
    it("removes surrounding quotes from a string", () => {
        expect(stripOuterQuotes('"testString"')).toBe("testString");
    });

    it("removes quotes and trims whitespace", () => {
        expect(stripOuterQuotes('  "test String"  ')).toBe("test String");
    });

    it("keeps strings without surrounding quotes unchanged", () => {
        expect(stripOuterQuotes("testString")).toBe("testString");
    });

    it("keeps partially quoted strings unchanged", () => {
        expect(stripOuterQuotes('"testString')).toBe('"testString');
        expect(stripOuterQuotes('testString"')).toBe('testString"');
    });

    it("handles empty quoted strings", () => {
        expect(stripOuterQuotes('""')).toBe("");
    });

    it("trims unquoted strings", () => {
        expect(stripOuterQuotes("  testString  ")).toBe("testString");
    });

    it("returns numbers unchanged", () => {
        expect(stripOuterQuotes(123)).toBe(123);
    });

    it("returns undefined unchanged", () => {
        expect(stripOuterQuotes(undefined)).toBeUndefined();
    });
    });
});