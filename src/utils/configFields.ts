import { FieldMap } from "./ApiUtils";
import {
  ConfigField,
  ConfigFieldFormat,
  ConfigFieldGroup,
  ConfigFieldInfo,
  ConfigFieldItem,
  FieldId,
} from "../types/configField";
import { SampleContainer } from "./sample";
import { createConfigFieldCustom } from "./configFieldsCustom";
import { ConfigFields, ConfigStaticField, ConfigStaticFieldItem, ConfigStaticFieldItemGroup } from "../types/config";

export function createConfigFields(
  configStaticFields: ConfigStaticField[],
  fieldMap: FieldMap,
  sample: SampleContainer,
): ConfigFields {
  const configFields: (ConfigField | null)[] = configStaticFields.map((configStaticField) => {
    let configField: ConfigField | null;
    if (configStaticField.type === "group") {
      configField = createConfigFieldItemGroup(configStaticField as ConfigStaticFieldItemGroup, fieldMap, sample);
    } else {
      configField = createConfigFieldItem(configStaticField as ConfigStaticFieldItem, fieldMap, sample);
    }
    return configField;
  });
  return configFields.filter((configField) => configField !== null);
}

function createConfigFieldItemGroup(
  configStaticFieldGroup: ConfigStaticFieldItemGroup,
  fieldMap: FieldMap,
  sample: SampleContainer,
) {
  const configFields = createConfigFields(configStaticFieldGroup.fields, fieldMap, sample) as ConfigFieldItem[];

  let fieldConfig: ConfigFieldGroup | null;
  if (configFields.length === 0) {
    fieldConfig = null;
  } else {
    fieldConfig = { type: "group", fieldConfigs: configFields };
  }
  return fieldConfig;
}

function createConfigFieldFormat(id: FieldId, fieldMap: FieldMap, sample: SampleContainer): ConfigFieldFormat | null {
  const field = fieldMap[`FORMAT/${id}`];
  return field !== undefined ? { type: "format", field, sample } : null;
}

function createConfigFieldInfo(id: FieldId, fieldMap: FieldMap): ConfigFieldInfo | null {
  const field = fieldMap[`INFO/${id}`];

  let fieldConfig: ConfigFieldInfo | null;
  if (field === undefined) {
    fieldConfig = null;
  } else {
    fieldConfig = { type: "info", field };
    const parentField = field.parent;
    if (parentField !== undefined) {
      if (parentField.nested !== undefined) {
        const index = parentField.nested.items.findIndex((nestedField) => nestedField.id === field.id);
        if (index === -1) {
          throw new Error(); // should never happen
        }
        fieldConfig.parentFieldValueIndex = index;
      }
    }
  }

  return fieldConfig;
}

function createConfigFieldItem(configStaticField: ConfigStaticFieldItem, fieldMap: FieldMap, sample: SampleContainer) {
  let configField: ConfigField | null;
  switch (configStaticField.type) {
    case "custom":
      configField = createConfigFieldCustom(configStaticField.name, sample);
      break;
    case "format":
      configField = createConfigFieldFormat(configStaticField.name, fieldMap, sample);
      break;
    case "info":
      configField = createConfigFieldInfo(configStaticField.name, fieldMap);
      break;
  }
  return configField;
}
