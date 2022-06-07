import { describe, expect, test } from "vitest";
import { abbreviateHeader, findInfoField, isNumerical } from "../utils/field";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Metadata } from "@molgenis/vip-report-vcf/src/Vcf";
import { FieldMetadataContainer } from "@molgenis/vip-report-vcf/src/VcfParser";

describe("field utilities", () => {
  test("FLOAT is numerical", () => {
    expect(isNumerical({ type: "FLOAT" } as FieldMetadata)).toBe(true);
  });

  test("INTEGER is numerical", () => {
    expect(isNumerical({ type: "INTEGER" } as FieldMetadata)).toBe(true);
  });

  test("STRING is not numerical", () => {
    expect(isNumerical({ type: "STRING" } as FieldMetadata)).toBe(false);
  });

  test("abbreviate header long text", () => {
    expect(abbreviateHeader("abcdefghijklmnopqrstuvwxyz")).toBe("abcdefghijk\u2026");
  });

  test("abbreviate header short text", () => {
    expect(abbreviateHeader("abcdef")).toBe("abcdef");
  });

  test("find info field", () => {
    const field = { id: "field" } as FieldMetadata;
    const recordsMetadata = {
      info: {
        field,
      } as FieldMetadataContainer,
    } as Metadata;

    expect(findInfoField(recordsMetadata, ["n", "field"])).toBe(field);
  });

  test("find info field: unknown field", () => {
    const recordsMetadata = {
      info: {} as FieldMetadataContainer,
    } as Metadata;

    expect(findInfoField(recordsMetadata, ["n", "field"])).toThrowError();
  });

  test("find info field: nested", () => {
    const childField0 = { id: "childField0" } as FieldMetadata;
    const childField1 = { id: "childField1" } as FieldMetadata;
    const nestedField = { id: "nestedField", nested: { items: [childField0, childField1] } } as FieldMetadata;

    const recordsMetadata = {
      info: {
        nestedField,
      } as FieldMetadataContainer,
    } as Metadata;

    expect(findInfoField(recordsMetadata, ["n", "nestedField", 1])).toBe(childField1);
  });

  test("find info field: missing 'n' path item", () => {
    const field = { id: "field" } as FieldMetadata;
    const recordsMetadata = {
      info: {
        field,
      } as FieldMetadataContainer,
    } as Metadata;

    expect(() => findInfoField(recordsMetadata, ["field"])).toThrowError();
  });

  test("find info field: missing 'n' path item nested", () => {
    const recordsMetadata = {
      info: {} as FieldMetadataContainer,
    } as Metadata;

    expect(() => findInfoField(recordsMetadata, ["nestedField", 1])).toThrowError();
  });

  test("find info field: nested invalid index", () => {
    const childField0 = { id: "childField0" } as FieldMetadata;
    const childField1 = { id: "childField1" } as FieldMetadata;
    const nestedField = { id: "nestedField", nested: { items: [childField0, childField1] } } as FieldMetadata;

    const recordsMetadata = {
      info: {
        nestedField,
      } as FieldMetadataContainer,
    } as Metadata;

    expect(findInfoField(recordsMetadata, ["n", "nestedField", 2])).toBe(childField1);
  });

  test("find info field: nested invalid index type", () => {
    const childField0 = { id: "childField0" } as FieldMetadata;
    const childField1 = { id: "childField1" } as FieldMetadata;
    const nestedField = { id: "nestedField", nested: { items: [childField0, childField1] } } as FieldMetadata;

    const recordsMetadata = {
      info: {
        nestedField,
      } as FieldMetadataContainer,
    } as Metadata;

    expect(findInfoField(recordsMetadata, ["n", "nestedField", "childField1"])).toBe(childField1);
  });
});
