import { describe, expect, test } from "vitest";
import { validateConfig } from "../../../src/utils/config/configValidator.ts";

describe("config parser", () => {
  describe("parseConfig", () => {
    test("valid", () => {
      const config = {
        vip: {
          filter_field: { type: "genotype", name: "f" },
          params: { vcf: { filter: { classes: "c0,c1", consequences: true }, filter_samples: { classes: "cs0,cs1" } } },
        },
        sample_variants: { cells: {} },
        variants: { cells: {} },
      };
      expect(validateConfig(config)).toStrictEqual(config);
    });

    test("valid with additional vip.params properties", () => {
      const config = {
        vip: {
          filter_field: { type: "genotype", name: "f" },
          params: {
            vcf: {
              filter: { classes: "c0,c1", consequences: true, new_prop: true },
              filter_samples: { classes: "cs0,cs1", new_prop: true },
            },
            new_prop: true,
          },
        },
        sample_variants: { cells: {} },
        variants: { cells: {} },
      };
      expect(validateConfig(config)).toStrictEqual(config);
    });

    test("invalid", () => {
      const config = {};

      // suppress logging
      const old = console.error;
      console.error = () => {};
      try {
        expect(() => validateConfig(config)).toThrow(/^config invalid$/);
      } finally {
        console.error = old;
      }
    });
  });
});
