import { Value, ValueArray } from "@molgenis/vip-report-vcf/src/ValueParser";
import { ConfigFieldInfo } from "../types/configField";
import { Record, RecordSample } from "@molgenis/vip-report-vcf/src/Vcf";
import { Item } from "@molgenis/vip-report-api/src/Api";
import { SampleContainer } from "./sample";

export function getRecordSample(record: Item<Record>, sample: SampleContainer): RecordSample {
  return record.data.s[sample.item.data.index];
}

export function isMultilineValue(fieldConfig: ConfigFieldInfo) {
  return (fieldConfig.field.parent && fieldConfig.field.parent.number.count !== 1) || false;
}

export function getInfoValue(record: Item<Record>, fieldConfig: ConfigFieldInfo): Value {
  const infoContainer = record.data.n;
  const parentField = fieldConfig.field.parent;

  let value: Value;
  if (parentField) {
    const parentValue = infoContainer[parentField.id] as ValueArray;
    const parentValueIndex = fieldConfig.parentFieldValueIndex as number; // FIXME remove cast
    if (isMultilineValue(fieldConfig)) {
      value = parentValue.map((value) => (value as ValueArray)[parentValueIndex]) as ValueArray;
    } else {
      value = parentValue[parentValueIndex];
    }
  } else {
    value = infoContainer[fieldConfig.field.id];
  }

  return value;
}
