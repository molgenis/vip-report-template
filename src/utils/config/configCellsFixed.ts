import { ConfigJsonFieldFixed } from "../../types/config";
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
} from "../../types/configCells";
import { Item } from "@molgenis/vip-report-api";
import { VcfRecord } from "@molgenis/vip-report-vcf";
import { UnexpectedEnumValueException } from "../error.ts";
import { getDescription, getLabel } from "./config.ts";

export function initConfigCellFixed(config: ConfigJsonFieldFixed): ConfigCellFixed {
  let configField: ConfigCellFixed;
  switch (config.name) {
    case "chrom":
      configField = createConfigFieldChrom(config);
      break;
    case "pos":
      configField = createConfigFieldPos(config);
      break;
    case "id":
      configField = createConfigFieldId(config);
      break;
    case "ref":
      configField = createConfigFieldRef(config);
      break;
    case "alt":
      configField = createConfigFieldAlt(config);
      break;
    case "qual":
      configField = createConfigFieldQual(config);
      break;
    case "filter":
      configField = createConfigFieldFilter(config);
      break;
    default:
      throw new UnexpectedEnumValueException(config["name"]);
  }
  return configField;
}

function createConfigFieldChrom(config: ConfigJsonFieldFixed): ConfigCellChrom {
  return {
    type: "chrom",
    label: () => getLabel(config, "Chromosome"),
    description: () => getDescription(config),
    value: (record: Item<VcfRecord>): CellValueChrom => record.data.c,
    valueCount: () => 1,
  };
}

function createConfigFieldPos(config: ConfigJsonFieldFixed): ConfigCellPos {
  return {
    type: "pos",
    label: () => getLabel(config, "Position"),
    description: () => getDescription(config),
    value: (record: Item<VcfRecord>): CellValuePos => record.data.p,
    valueCount: () => 1,
  };
}

function createConfigFieldId(config: ConfigJsonFieldFixed): ConfigCellId {
  return {
    type: "id",
    label: () => getLabel(config, "Ids"),
    description: () => getDescription(config),
    value: (record: Item<VcfRecord>): CellValueId => record.data.i,
    valueCount: () => 1, // one list value
  };
}

function createConfigFieldRef(config: ConfigJsonFieldFixed): ConfigCellRef {
  return {
    type: "ref",
    label: () => getLabel(config, "Ref"),
    description: () => getDescription(config, "Reference base(s)"),
    value: (record: Item<VcfRecord>): CellValueRef => record.data.r,
    valueCount: () => 1,
  };
}

function createConfigFieldAlt(config: ConfigJsonFieldFixed): ConfigCellAlt {
  return {
    type: "alt",
    label: () => getLabel(config, "Alt"),
    description: () => getDescription(config, "Alternate base(s): list of alternate non-reference alleles"),
    value: (record: Item<VcfRecord>): CellValueAlt => record.data.a,
    valueCount: () => 1, // one list value
  };
}

function createConfigFieldQual(config: ConfigJsonFieldFixed): ConfigCellQual {
  return {
    type: "qual",
    label: () => getLabel(config, "Qual"),
    description: () => getDescription(config, "Quality: phred-scaled quality score for the 'Alt' assertions"),
    value: (record: Item<VcfRecord>): CellValueQual => record.data.q,
    valueCount: () => 1,
  };
}

function createConfigFieldFilter(config: ConfigJsonFieldFixed): ConfigCellFilter {
  return {
    type: "filter",
    label: () => getLabel(config, "Filters"),
    description: () =>
      getDescription(
        config,
        "Filter status: PASS if this position has passed all filter, otherwise a list of codes for filters that fail",
      ),
    value: (record: Item<VcfRecord>): CellValueFilter => record.data.f,
    valueCount: () => 1, // one list value
  };
}
