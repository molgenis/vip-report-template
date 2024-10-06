import { FieldMap } from "./ApiUtils";
import {
  ConfigFieldFormat,
  ConfigFieldGroup,
  ConfigFieldItem,
  ConfigFieldInfo,
  FieldGroupId,
  FieldId,
} from "../types/field";
import { SampleContainer } from "./sample";

export function createConfigFieldInfo(id: FieldId, fieldMap: FieldMap): ConfigFieldInfo | null {
  const field = fieldMap[id];

  let fieldConfig: ConfigFieldInfo | null;
  if (field === undefined) {
    fieldConfig = null;
  } else {
    fieldConfig = { type: "info", id, field }; // FIXME continue
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

export function createConfigFieldFormat(
  id: FieldId,
  fieldMap: FieldMap,
  sample: SampleContainer,
): ConfigFieldFormat | null {
  const field = fieldMap[id];
  return field !== undefined ? { type: "format", id, field, sample } : null;
}

export function createConfigFieldGroup(
  id: FieldGroupId,
  fieldConfigs: (ConfigFieldItem | null)[],
): ConfigFieldGroup | null {
  const fieldConfigsNonNull = fieldConfigs.filter((fieldConfig) => fieldConfig !== null);

  let fieldConfig: ConfigFieldGroup | null;
  if (fieldConfigsNonNull.length === 0) {
    fieldConfig = null;
  } else {
    fieldConfig = { type: "group", id, fieldConfigs: fieldConfigsNonNull };
  }
  return fieldConfig;
}
