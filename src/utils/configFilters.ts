import { ConfigFilters, ConfigStaticField, ConfigStaticFieldItem } from "../types/config";
import { ConfigFilter, ConfigFilterField, ConfigFilterFormat } from "../types/configFilter";
import { createConfigFilterComposed } from "./configFiltersComposed";
import { CellId } from "../types/configCell";
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

function createConfigFilterFormat(
  id: CellId,
  sample: SampleContainer | null,
  fieldMap: FieldMap,
): ConfigFilterFormat | null {
  if (sample === null) return null;
  const field = fieldMap[`FORMAT/${id}`];
  return field !== undefined ? { type: "genotype", id, field, sample } : null;
}

function createConfigFilterInfo(id: CellId, fieldMap: FieldMap): ConfigFilterField | null {
  const field = fieldMap[`INFO/${id}`];

  let filterConfig: ConfigFilterField | null;
  if (field === undefined) {
    filterConfig = null;
  } else {
    filterConfig = { type: "info", id, field };
    const parentFilter = field.parent;
    if (parentFilter !== undefined) {
      if (parentFilter.nested !== undefined) {
        const index = parentFilter.nested.items.findIndex((nestedFilter) => nestedFilter.id === field.id);
        if (index === -1) {
          throw new Error(); // should never happen
        }
        filterConfig.parentFieldValueIndex = index;
      }
    }
  }

  return filterConfig;
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
      configFilter = createConfigFilterInfo(configStaticField.name, fieldMap);
      break;
    case "genotype":
      configFilter = createConfigFilterFormat(configStaticField.name, sample, fieldMap);
      break;
    case "composed":
      configFilter = createConfigFilterComposed(configStaticField.name, metadata, sample, fieldMap);
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
