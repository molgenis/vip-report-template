import {
  ConfigFilters,
  ConfigStaticField,
  ConfigStaticFieldAlt,
  ConfigStaticFieldChrom,
  ConfigStaticFieldFilter,
  ConfigStaticFieldFixed,
  ConfigStaticFieldGenotype,
  ConfigStaticFieldId,
  ConfigStaticFieldInfo,
  ConfigStaticFieldItem,
  ConfigStaticFieldPos,
  ConfigStaticFieldQual,
  ConfigStaticFieldRef,
} from "../types/config";
import {
  ConfigFilter,
  ConfigFilterAlt,
  ConfigFilterChrom,
  ConfigFilterField,
  ConfigFilterFilter,
  ConfigFilterFixed,
  ConfigFilterFormat,
  ConfigFilterId,
  ConfigFilterPos,
  ConfigFilterQual,
  ConfigFilterRef,
} from "../types/configFilter";
import { createConfigFilterComposed } from "./configFiltersComposed";
import { UnexpectedEnumValueException } from "./error";
import { MetadataContainer, SampleContainer } from "../Api.ts";
import { FieldMap } from "./utils.ts";

export function createConfigFilters(
  configStaticFields: ConfigStaticField[],
  metadata: MetadataContainer,
  sample: SampleContainer | null,
  filterMap: FieldMap,
): ConfigFilters {
  const configFilters: (ConfigFilter | null)[] = configStaticFields.map((configStaticFilter) => {
    let configFilter: ConfigFilter | null;
    if (configStaticFilter.type === "group") {
      throw new Error("filter groups are not supported");
    } else {
      configFilter = createConfigFilterItem(configStaticFilter as ConfigStaticFieldItem, metadata, sample, filterMap);
    }
    return configFilter;
  });
  return configFilters.filter((configFilter) => configFilter !== null);
}

function createConfigFilterChrom(configStatic: ConfigStaticFieldChrom): ConfigFilterChrom {
  return {
    type: "fixed",
    id: "chrom",
    label: () => configStatic.label || "Chromosome",
    description: () => configStatic.description || null,
  };
}

function createConfigFilterPos(configStatic: ConfigStaticFieldPos): ConfigFilterPos {
  return {
    type: "fixed",
    id: "pos",
    label: () => configStatic.label || "Position",
    description: () => configStatic.description || null,
  };
}

function createConfigFilterId(configStatic: ConfigStaticFieldId): ConfigFilterId {
  return {
    type: "fixed",
    id: "id",
    label: () => configStatic.label || "Identifiers",
    description: () => configStatic.description || null,
  };
}

function createConfigFilterRef(configStatic: ConfigStaticFieldRef): ConfigFilterRef {
  return {
    type: "fixed",
    id: "ref",
    label: () => configStatic.label || "Reference",
    description: () => configStatic.description || null,
  };
}

function createConfigFilterAlt(configStatic: ConfigStaticFieldAlt): ConfigFilterAlt {
  return {
    type: "fixed",
    id: "alt",
    label: () => configStatic.label || "Alt",
    description: () => configStatic.description || null,
  };
}

function createConfigFilterQual(configStatic: ConfigStaticFieldQual): ConfigFilterQual {
  return {
    type: "fixed",
    id: "qual",
    label: () => configStatic.label || "Quality",
    description: () => configStatic.description || null,
  };
}

function createConfigFilterFilter(configStatic: ConfigStaticFieldFilter): ConfigFilterFilter {
  return {
    type: "fixed",
    id: "filter",
    label: () => configStatic.label || "Filter",
    description: () => configStatic.description || null,
  };
}

function createConfigFilterGenotype(
  configStatic: ConfigStaticFieldGenotype,
  sample: SampleContainer | null,
  fieldMap: FieldMap,
): ConfigFilterFormat | null {
  if (sample === null) return null;

  const id = configStatic.name;
  const field = fieldMap[`INFO/${id}`];
  if (field === undefined) return null;

  return {
    type: "genotype",
    id,
    label: () => configStatic.label || field.label || field.id,
    description: () => configStatic.description || field.description || null,
    field,
    sample,
  };
}

function createConfigFilterFixed(configStaticField: ConfigStaticFieldFixed): ConfigFilterFixed {
  let configFilter: ConfigFilterFixed;
  switch (configStaticField.name) {
    case "chrom":
      configFilter = createConfigFilterChrom(configStaticField);
      break;
    case "pos":
      configFilter = createConfigFilterPos(configStaticField);
      break;
    case "id":
      configFilter = createConfigFilterId(configStaticField);
      break;
    case "ref":
      configFilter = createConfigFilterRef(configStaticField);
      break;
    case "alt":
      configFilter = createConfigFilterAlt(configStaticField);
      break;
    case "qual":
      configFilter = createConfigFilterQual(configStaticField);
      break;
    case "filter":
      configFilter = createConfigFilterFilter(configStaticField);
      break;
    default:
      throw new UnexpectedEnumValueException(configStaticField["name"]);
  }
  return configFilter;
}

function createConfigFilterInfo(configStatic: ConfigStaticFieldInfo, fieldMap: FieldMap): ConfigFilterField | null {
  const id = configStatic.name;
  const field = fieldMap[`INFO/${id}`];
  if (field === undefined) return null;

  return {
    type: "info",
    id,
    label: () => configStatic.label || field.label || field.id,
    description: () => configStatic.description || field.description || null,
    field,
  };
}

function createConfigFilterItem(
  configStaticField: ConfigStaticFieldItem,
  metadata: MetadataContainer,
  sample: SampleContainer | null,
  fieldMap: FieldMap,
) {
  let configFilter: ConfigFilter | null;
  switch (configStaticField.type) {
    case "fixed":
      configFilter = createConfigFilterFixed(configStaticField);
      break;
    case "info":
      configFilter = createConfigFilterInfo(configStaticField, fieldMap);
      break;
    case "format":
      throw new Error(`unsupported config filter type '${configStaticField.type}'`); // not exposed by vip-report-api
    case "genotype":
      configFilter = createConfigFilterGenotype(configStaticField, sample, fieldMap);
      break;
    case "composed":
      configFilter = createConfigFilterComposed(configStaticField, metadata, sample, fieldMap);
      break;
    default:
      throw new UnexpectedEnumValueException(configStaticField["type"]);
  }
  return configFilter;
}
