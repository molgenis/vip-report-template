import {
  ConfigFilters,
  ConfigStaticField,
  ConfigStaticFieldComposed,
  ConfigStaticFieldGenotype,
  ConfigStaticFieldInfo,
  ConfigStaticFieldItem,
} from "../types/config";
import { ConfigFilter, ConfigFilterField, ConfigFilterFormat } from "../types/configFilter";
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
    case "info":
      configFilter = createConfigFilterInfo(configStaticField as ConfigStaticFieldInfo, fieldMap);
      break;
    case "genotype":
      configFilter = createConfigFilterGenotype(configStaticField as ConfigStaticFieldGenotype, sample, fieldMap);
      break;
    case "composed":
      configFilter = createConfigFilterComposed(
        configStaticField as ConfigStaticFieldComposed,
        metadata,
        sample,
        fieldMap,
      );
      break;
    case "chrom": // TODO discuss: support some of these such as 'filter'?
    case "pos":
    case "id":
    case "ref":
    case "alt":
    case "qual":
    case "filter":
    case "format":
      throw new Error(`unsupported config filter type '${configStaticField.type}'`);
    default:
      throw new UnexpectedEnumValueException(configStaticField["type"]);
  }
  return configFilter;
}
