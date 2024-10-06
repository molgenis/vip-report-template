import { ConfigFilterField, ConfigFilterFormat, FilterId } from "../types/filter";
import { FieldMap } from "./ApiUtils";
import { SampleContainer } from "./sample";

export function createConfigFilterInfo(id: FilterId, fieldMap: FieldMap): ConfigFilterField | null {
  const field = fieldMap[id];
  return field !== undefined ? { type: "info", id, field } : null;
}

export function createConfigFilterFormat(
  id: FilterId,
  fieldMap: FieldMap,
  sample: SampleContainer,
): ConfigFilterFormat | null {
  const field = fieldMap[id];
  return field !== undefined ? { type: "format", id, field, sample } : null;
}
