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
import { FieldMetadata } from "@molgenis/vip-report-vcf";
import { VariantType } from "./variantTypeUtils.ts";

export function initConfigFilters(
  configStaticFields: ConfigStaticField[],
  variantType: VariantType,
  metadata: MetadataContainer,
  sample: SampleContainer | null,
): ConfigFilters {
  return configStaticFields.flatMap((configStaticFilter) => {
    let configFilters: ConfigFilter[];
    if (configStaticFilter.type === "group") {
      throw new Error("filter groups are not supported");
    } else {
      configFilters = createConfigFilterItem(
        configStaticFilter as ConfigStaticFieldItem,
        metadata,
        sample,
        metadata.records.fieldMap,
      );
    }
    return configFilters;
  });
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
  field: FieldMetadata | undefined,
): ConfigFilterFormat | null {
  if (sample === null) return null;
  if (field === undefined) return null;

  return {
    type: "genotype",
    id: configStatic.name,
    label: () => configStatic.label || field.label || field.id,
    description: () => configStatic.description || field.description || null,
    field,
    sample,
  };
}

function createConfigFiltersGenotype(
  configStatic: ConfigStaticFieldGenotype,
  sample: SampleContainer | null,
  fieldMap: FieldMap,
): ConfigFilterFormat[] {
  const id = configStatic.name;

  const configs: (ConfigFilterFormat | null)[] = [];
  if (id.endsWith("*")) {
    const baseId = id.length === 1 ? "FORMAT/" : `FORMAT/${id.substring(0, id.length - 1)}`;
    Object.entries(fieldMap).forEach(([fieldId, field]) => {
      if (fieldId.startsWith(baseId) && !field.nested) {
        const fieldConfig = createConfigFilterGenotype(configStatic, sample, field);
        configs.push(fieldConfig);
      }
    });
  } else {
    const field = fieldMap[`FORMAT/${id}`];
    const config = createConfigFilterGenotype(configStatic, sample, field);
    configs.push(config);
  }

  return configs.filter((config) => config !== null);
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

function createConfigFilterInfo(
  configStatic: ConfigStaticFieldInfo,
  field: FieldMetadata | undefined,
): ConfigFilterField | null {
  if (field === undefined) return null;

  return {
    type: "info",
    id: field.id,
    label: () => configStatic.label || field.label || field.id,
    description: () => configStatic.description || field.description || null,
    field,
  };
}

function createConfigFiltersInfo(configStatic: ConfigStaticFieldInfo, fieldMap: FieldMap): ConfigFilterField[] {
  const id = configStatic.name;

  const filterConfigs: (ConfigFilterField | null)[] = [];
  if (id.endsWith("*")) {
    const baseId = id.length === 1 ? "INFO/" : `INFO/${id.substring(0, id.length - 1)}`;
    Object.entries(fieldMap).forEach(([fieldId, field]) => {
      if (fieldId.startsWith(baseId) && !field.nested) {
        const fieldConfig = createConfigFilterInfo(configStatic, field);
        filterConfigs.push(fieldConfig);
      }
    });
  } else {
    const field = fieldMap[`INFO/${id}`];
    const fieldConfig = createConfigFilterInfo(configStatic, field);
    filterConfigs.push(fieldConfig);
  }

  return filterConfigs.filter((filterConfig) => filterConfig !== null);
}

function createConfigFilterItem(
  configStaticField: ConfigStaticFieldItem,
  metadata: MetadataContainer,
  sample: SampleContainer | null,
  fieldMap: FieldMap,
): ConfigFilter[] {
  let configFilters: (ConfigFilter | null)[];
  switch (configStaticField.type) {
    case "fixed":
      configFilters = [createConfigFilterFixed(configStaticField)];
      break;
    case "info":
      configFilters = createConfigFiltersInfo(configStaticField, fieldMap);
      break;
    case "format":
      throw new Error(`unsupported config filter type '${configStaticField.type}'`); // not exposed by vip-report-api
    case "genotype":
      configFilters = createConfigFiltersGenotype(configStaticField, sample, fieldMap);
      break;
    case "composed":
      configFilters = [createConfigFilterComposed(configStaticField, metadata, sample, fieldMap)];
      break;
    default:
      throw new UnexpectedEnumValueException(configStaticField["type"]);
  }
  return configFilters.filter((configFilter) => configFilter !== null);
}
