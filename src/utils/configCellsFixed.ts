import {
  ConfigStaticFieldAlt,
  ConfigStaticFieldChrom,
  ConfigStaticFieldFilter,
  ConfigStaticFieldFixed,
  ConfigStaticFieldId,
  ConfigStaticFieldPos,
  ConfigStaticFieldQual,
  ConfigStaticFieldRef,
} from "../types/config";
import {
  CellValueAlt,
  CellValueChrom,
  CellValueFilter,
  CellValueId,
  CellValuePos,
  CellValueQual,
  CellValueRef,
  ConfigCellAlt,
  ConfigCellChrom,
  ConfigCellFilter,
  ConfigCellFixed,
  ConfigCellId,
  ConfigCellPos,
  ConfigCellQual,
  ConfigCellRef,
} from "../types/configCell";
import { Item } from "@molgenis/vip-report-api";
import { VcfRecord } from "@molgenis/vip-report-vcf";
import { UnexpectedEnumValueException } from "./error.ts";

export function initConfigCellFixed(configStaticField: ConfigStaticFieldFixed): ConfigCellFixed {
  let configField: ConfigCellFixed;
  switch (configStaticField.name) {
    case "chrom":
      configField = createConfigFieldChrom(configStaticField);
      break;
    case "pos":
      configField = createConfigFieldPos(configStaticField);
      break;
    case "id":
      configField = createConfigFieldId(configStaticField);
      break;
    case "ref":
      configField = createConfigFieldRef(configStaticField);
      break;
    case "alt":
      configField = createConfigFieldAlt(configStaticField);
      break;
    case "qual":
      configField = createConfigFieldQual(configStaticField);
      break;
    case "filter":
      configField = createConfigFieldFilter(configStaticField);
      break;
    default:
      throw new UnexpectedEnumValueException(configStaticField["name"]);
  }
  return configField;
}

function createConfigFieldChrom(configStatic: ConfigStaticFieldChrom): ConfigCellChrom {
  return {
    type: "chrom",
    label: () => configStatic.label || "Chromosome",
    description: () => configStatic.description || null,
    value: (record: Item<VcfRecord>): CellValueChrom => record.data.c,
    valueCount: () => 1,
  };
}

function createConfigFieldPos(configStatic: ConfigStaticFieldPos): ConfigCellPos {
  return {
    type: "pos",
    label: () => configStatic.label || "Position",
    description: () => configStatic.description || null,
    value: (record: Item<VcfRecord>): CellValuePos => record.data.p,
    valueCount: () => 1,
  };
}

function createConfigFieldId(configStatic: ConfigStaticFieldId): ConfigCellId {
  return {
    type: "id",
    label: () => configStatic.label || "Ids",
    description: () => configStatic.description || null,
    value: (record: Item<VcfRecord>): CellValueId => record.data.i,
    valueCount: () => 1,
  };
}

function createConfigFieldRef(configStatic: ConfigStaticFieldRef): ConfigCellRef {
  return {
    type: "ref",
    label: () => configStatic.label || "Ref",
    description: () => configStatic.description || "Reference base(s)",
    value: (record: Item<VcfRecord>): CellValueRef => record.data.r,
    valueCount: () => 1,
  };
}

function createConfigFieldAlt(configStatic: ConfigStaticFieldAlt): ConfigCellAlt {
  return {
    type: "alt",
    label: () => configStatic.label || "Alt",
    description: () => configStatic.description || "Alternate base(s): list of alternate non-reference alleles",
    value: (record: Item<VcfRecord>): CellValueAlt => record.data.a,
    valueCount: () => 1,
  };
}

function createConfigFieldQual(configStatic: ConfigStaticFieldQual): ConfigCellQual {
  return {
    type: "qual",
    label: () => configStatic.label || "Qual",
    description: () => configStatic.description || "Quality: phred-scaled quality score for the 'Alt' assertions",
    value: (record: Item<VcfRecord>): CellValueQual => record.data.q,
    valueCount: () => 1,
  };
}

function createConfigFieldFilter(configStatic: ConfigStaticFieldFilter): ConfigCellFilter {
  return {
    type: "filter",
    label: () => configStatic.label || "Filters",
    description: () =>
      configStatic.description ||
      "Filter status: PASS if this position has passed all filter, otherwise a list of codes for filters that fail",
    value: (record: Item<VcfRecord>): CellValueFilter => record.data.f,
    valueCount: () => 1,
  };
}
