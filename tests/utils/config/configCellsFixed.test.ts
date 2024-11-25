import { describe, expect, test } from "vitest";
import { initConfigCellFixed } from "../../../src/utils/config/configCellsFixed.ts";
import { Item } from "@molgenis/vip-report-api";
import { VcfRecord } from "@molgenis/vip-report-vcf";

describe("config cells fixed", () => {
  describe("initConfigCellFixed", () => {
    test("chrom", () => {
      const cell = initConfigCellFixed({ type: "fixed", name: "chrom" });
      const record: Partial<Item<Partial<VcfRecord>>> = { data: { c: "chr1" } };

      expect(cell.type).toStrictEqual("chrom");
      expect(cell.label()).toStrictEqual("Chromosome");
      expect(cell.description()).toStrictEqual(null);
      expect(cell.value(record as Item<VcfRecord>, 0)).toStrictEqual("chr1");
      expect(cell.valueCount(record as Item<VcfRecord>)).toStrictEqual(1);
    });

    test("pos", () => {
      const cell = initConfigCellFixed({ type: "fixed", name: "pos" });
      const record: Partial<Item<Partial<VcfRecord>>> = { data: { p: 1 } };

      expect(cell.type).toStrictEqual("pos");
      expect(cell.label()).toStrictEqual("Position");
      expect(cell.description()).toStrictEqual(null);
      expect(cell.value(record as Item<VcfRecord>, 0)).toStrictEqual(1);
      expect(cell.valueCount(record as Item<VcfRecord>)).toStrictEqual(1);
    });

    test("id", () => {
      const cell = initConfigCellFixed({ type: "fixed", name: "id" });
      const record: Partial<Item<Partial<VcfRecord>>> = { data: { i: ["id0", "id1"] } };

      expect(cell.type).toStrictEqual("id");
      expect(cell.label()).toStrictEqual("Ids");
      expect(cell.description()).toStrictEqual(null);
      expect(cell.value(record as Item<VcfRecord>, 0)).toStrictEqual(["id0", "id1"]);
      expect(cell.valueCount(record as Item<VcfRecord>)).toStrictEqual(1);
    });

    test("ref", () => {
      const cell = initConfigCellFixed({ type: "fixed", name: "ref" });
      const record: Partial<Item<Partial<VcfRecord>>> = { data: { r: "A" } };

      expect(cell.type).toStrictEqual("ref");
      expect(cell.label()).toStrictEqual("Reference");
      expect(cell.description()).toStrictEqual("Reference base(s)");
      expect(cell.value(record as Item<VcfRecord>, 0)).toStrictEqual("A");
      expect(cell.valueCount(record as Item<VcfRecord>)).toStrictEqual(1);
    });

    test("alt", () => {
      const cell = initConfigCellFixed({ type: "fixed", name: "alt" });
      const record: Partial<Item<Partial<VcfRecord>>> = { data: { a: ["C", "T"] } };

      expect(cell.type).toStrictEqual("alt");
      expect(cell.label()).toStrictEqual("Alternate(s)");
      expect(cell.description()).toStrictEqual("Alternate base(s): list of alternate non-reference alleles");
      expect(cell.value(record as Item<VcfRecord>, 0)).toStrictEqual(["C", "T"]);
      expect(cell.valueCount(record as Item<VcfRecord>)).toStrictEqual(1);
    });

    test("qual", () => {
      const cell = initConfigCellFixed({ type: "fixed", name: "qual" });
      const record: Partial<Item<Partial<VcfRecord>>> = { data: { q: 123 } };

      expect(cell.type).toStrictEqual("qual");
      expect(cell.label()).toStrictEqual("Qual");
      expect(cell.description()).toStrictEqual("Quality: phred-scaled quality score for the 'Alt' assertions");
      expect(cell.value(record as Item<VcfRecord>, 0)).toStrictEqual(123);
      expect(cell.valueCount(record as Item<VcfRecord>)).toStrictEqual(1);
    });

    test("filter", () => {
      const cell = initConfigCellFixed({ type: "fixed", name: "filter" });
      const record: Partial<Item<Partial<VcfRecord>>> = { data: { f: ["PASS"] } };

      expect(cell.type).toStrictEqual("filter");
      expect(cell.label()).toStrictEqual("Filters");
      expect(cell.description()).toStrictEqual(
        "Filter status: PASS if this position has passed all filter, otherwise a list of codes for filters that fail",
      );
      expect(cell.value(record as Item<VcfRecord>, 0)).toStrictEqual(["PASS"]);
      expect(cell.valueCount(record as Item<VcfRecord>)).toStrictEqual(1);
    });

    test("cell with custom label and description", () => {
      const cell = initConfigCellFixed({
        type: "fixed",
        name: "chrom",
        label: "custom_label",
        description: "custom_description",
      });

      expect(cell.label()).toStrictEqual("custom_label");
      expect(cell.description()).toStrictEqual("custom_description");
    });
  });
});
