import { describe, expect, test } from "vitest";
import { validateConfig } from "../../../src/utils/config/configValidator.ts";

describe("config parser", () => {
  describe("parseConfig", () => {
    test("valid", () => {
      const config = {
        vip: {
          filter_field: { type: "genotype", name: "f" },
          params: { vcf: { filter_samples: { classes: "c0,c1" } } },
        },
        sample_variants: {},
        variants: {},
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
