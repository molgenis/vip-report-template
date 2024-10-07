import { ConfigFilters, ConfigStaticField, ConfigStaticFieldItem } from "../types/config";
import { FieldMap, MetadataContainer } from "./ApiUtils";
import { SampleContainer } from "./sample";
import { ConfigFilter, ConfigFilterField, ConfigFilterFormat } from "../types/configFilter";
import { createConfigFilterCustom } from "./configFiltersCustom";
import { FieldId } from "../types/configField";

export function createConfigFilters(
  configStaticFields: ConfigStaticField[],
  metadata: MetadataContainer,
  sample: SampleContainer,
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

function createConfigFilterFormat(id: FieldId, sample: SampleContainer, fieldMap: FieldMap): ConfigFilterFormat | null {
  const field = fieldMap[`FORMAT/${id}`];
  return field !== undefined ? { type: "format", id, field, sample } : null;
}

function createConfigFilterInfo(id: FieldId, fieldMap: FieldMap): ConfigFilterField | null {
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
  sample: SampleContainer,
  fieldMap: FieldMap,
) {
  let configFilter: ConfigFilter | null;
  switch (configStaticField.type) {
    case "custom":
      configFilter = createConfigFilterCustom(configStaticField.name, metadata);
      break;
    case "format":
      configFilter = createConfigFilterFormat(configStaticField.name, sample, fieldMap);
      break;
    case "info":
      configFilter = createConfigFilterInfo(configStaticField.name, fieldMap);
      break;
  }
  return configFilter;
}
