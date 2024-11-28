import { describe, expect, test } from "vitest";
import { initConfigFilterFixed } from "../../../src/utils/config/configFiltersFixed.ts";

describe("config filters fixed", () => {
  describe("initConfigFilterFixed", () => {
    test("chrom", () => {
      const filter = initConfigFilterFixed({ type: "fixed", name: "chrom" });

      expect(filter.type).toStrictEqual("fixed");
      expect(filter.id).toStrictEqual("chrom");
      expect(filter.label()).toStrictEqual("Chromosome");
      expect(filter.description()).toStrictEqual(null);
    });

    test("pos", () => {
      const filter = initConfigFilterFixed({ type: "fixed", name: "pos" });

      expect(filter.type).toStrictEqual("fixed");
      expect(filter.id).toStrictEqual("pos");
      expect(filter.label()).toStrictEqual("Position");
      expect(filter.description()).toStrictEqual(null);
    });

    test("id", () => {
      const filter = initConfigFilterFixed({ type: "fixed", name: "id" });

      expect(filter.type).toStrictEqual("fixed");
      expect(filter.id).toStrictEqual("id");
      expect(filter.label()).toStrictEqual("Identifiers");
      expect(filter.description()).toStrictEqual(null);
    });

    test("ref", () => {
      const filter = initConfigFilterFixed({ type: "fixed", name: "ref" });

      expect(filter.type).toStrictEqual("fixed");
      expect(filter.id).toStrictEqual("ref");
      expect(filter.label()).toStrictEqual("Reference");
      expect(filter.description()).toStrictEqual(null);
    });

    test("alt", () => {
      const filter = initConfigFilterFixed({ type: "fixed", name: "alt" });

      expect(filter.type).toStrictEqual("fixed");
      expect(filter.id).toStrictEqual("alt");
      expect(filter.label()).toStrictEqual("Alt");
      expect(filter.description()).toStrictEqual(null);
    });

    test("qual", () => {
      const filter = initConfigFilterFixed({ type: "fixed", name: "qual" });

      expect(filter.type).toStrictEqual("fixed");
      expect(filter.id).toStrictEqual("qual");
      expect(filter.label()).toStrictEqual("Quality");
      expect(filter.description()).toStrictEqual(null);
    });

    test("filter", () => {
      const filter = initConfigFilterFixed({ type: "fixed", name: "filter" });

      expect(filter.type).toStrictEqual("fixed");
      expect(filter.id).toStrictEqual("filter");
      expect(filter.label()).toStrictEqual("Filter");
      expect(filter.description()).toStrictEqual(null);
    });

    test("filter with custom label and description", () => {
      const filter = initConfigFilterFixed({
        type: "fixed",
        name: "chrom",
        label: "custom_label",
        description: "custom_description",
      });

      expect(filter.label()).toStrictEqual("custom_label");
      expect(filter.description()).toStrictEqual("custom_description");
    });
  });
});
