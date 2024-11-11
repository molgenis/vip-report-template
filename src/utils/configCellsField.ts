import { ConfigStaticFieldGenotype, ConfigStaticFieldInfo } from "../types/config";
import { FieldMap, getRecordSample } from "./utils.ts";
import {
  CellValueGenotype,
  CellValueInfo,
  ConfigCellGenotype,
  ConfigCellInfo,
  RecordContext,
} from "../types/configCell";
import { FieldMetadata, Value, VcfRecord } from "@molgenis/vip-report-vcf";
import { getInfoValueCount, getRecordSampleValueCount, getRequiredNestedFieldIndex } from "./field.ts";
import { Item } from "@molgenis/vip-report-api";
import { ArrayIndexOutOfBoundsException, RuntimeError } from "./error.ts";
import { SampleContainer } from "../Api.ts";

function createConfigFieldInfo(
  configStatic: ConfigStaticFieldInfo,
  field: FieldMetadata | undefined,
): ConfigCellInfo | null {
  let fieldConfig: ConfigCellInfo | null;
  if (field === undefined) {
    fieldConfig = null;
  } else {
    const fieldParent = field.parent;
    const fieldParentIndex = fieldParent ? getRequiredNestedFieldIndex(fieldParent, field.id) : undefined;
    const fieldParentCount = fieldParent?.number.count;

    fieldConfig = {
      type: "info",
      label: () => configStatic.label || field.label || field.id,
      description: () => configStatic.description || field.description || null,
      valueCount: (record: Item<VcfRecord>) => getInfoValueCount(fieldParent, record),
      field,
      value(record: Item<VcfRecord>, recordContext: RecordContext): CellValueInfo {
        const valueContainer = record.data.n;

        let value: Value | undefined;
        if (fieldParent) {
          value = valueContainer[fieldParent.id];
          if (value !== undefined) {
            let valueArray = value as Value[];
            if (fieldParentCount !== 1) {
              if (recordContext.valueIndex === undefined) throw new RuntimeError();

              const valueArrayElement = valueArray[recordContext.valueIndex];
              if (valueArrayElement === undefined) throw new ArrayIndexOutOfBoundsException();
              valueArray = valueArrayElement as Value[];
            }

            value = valueArray[fieldParentIndex!] as CellValueInfo;
            if (value === undefined) throw new ArrayIndexOutOfBoundsException();
          }
        } else {
          value = valueContainer[field.id];
        }
        return value;
      },
    };
  }
  return fieldConfig;
}

export function initConfigCellInfo(configStatic: ConfigStaticFieldInfo, fieldMap: FieldMap): ConfigCellInfo[] {
  const id = configStatic.name;

  const fieldConfigs: (ConfigCellInfo | null)[] = [];
  if (id.endsWith("*")) {
    const baseId = id.length === 1 ? "INFO/" : `INFO/${id.substring(0, id.length - 1)}`;
    Object.entries(fieldMap).forEach(([fieldId, field]) => {
      if (fieldId.startsWith(baseId) && !field.nested) {
        const fieldConfig = createConfigFieldInfo(configStatic, field);
        fieldConfigs.push(fieldConfig);
      }
    });
  } else {
    const field = fieldMap[`INFO/${id}`];
    const fieldConfig = createConfigFieldInfo(configStatic, field);
    fieldConfigs.push(fieldConfig);
  }

  return fieldConfigs.filter((fieldConfig) => fieldConfig !== null);
}

function createConfigFieldGenotype(
  configStatic: ConfigStaticFieldGenotype,
  field: FieldMetadata | undefined,
  sample: SampleContainer,
): ConfigCellGenotype | null {
  let fieldConfig: ConfigCellGenotype | null;
  if (field === undefined) {
    fieldConfig = null;
  } else {
    const fieldParent = field.parent;
    const fieldParentIndex = fieldParent ? getRequiredNestedFieldIndex(fieldParent, field.id) : undefined;
    const fieldParentCount = fieldParent?.number.count;

    fieldConfig = {
      type: "genotype",
      label: () => configStatic.label || field.label || field.id,
      description: () => configStatic.description || field.description || null,
      valueCount: (record: Item<VcfRecord>) => getRecordSampleValueCount(fieldParent, record, sample),
      field,
      value(record: Item<VcfRecord>, recordContext: RecordContext): CellValueGenotype | undefined {
        const recordSample = getRecordSample(record, sample);

        let value: CellValueGenotype | undefined;
        if (fieldParent) {
          value = recordSample[fieldParent.id];
          if (value !== undefined) {
            let valueArray = value as Value[];
            if (fieldParentCount !== 1) {
              if (recordContext.valueIndex === undefined) throw new RuntimeError();

              const valueArrayElement = valueArray[recordContext.valueIndex];
              if (valueArrayElement === undefined) throw new ArrayIndexOutOfBoundsException();
              valueArray = valueArrayElement as Value[];
            }

            value = valueArray[fieldParentIndex!] as CellValueGenotype;
            if (value === undefined) throw new ArrayIndexOutOfBoundsException();
          }
        } else {
          value = recordSample[field.id];
        }
        return value;
      },
    };
  }
  return fieldConfig;
}

export function initConfigCellGenotype(
  configStatic: ConfigStaticFieldGenotype,
  fieldMap: FieldMap,
  sample: SampleContainer,
): ConfigCellGenotype[] {
  const id = configStatic.name;

  const fieldConfigs: (ConfigCellGenotype | null)[] = [];
  if (id.endsWith("*")) {
    const baseId = id.length === 1 ? "FORMAT/" : `FORMAT/${id.substring(0, id.length - 1)}`;
    Object.entries(fieldMap).forEach(([fieldId, field]) => {
      if (fieldId.startsWith(baseId) && !field.nested) {
        const fieldConfig = createConfigFieldGenotype(configStatic, field, sample);
        fieldConfigs.push(fieldConfig);
      }
    });
  } else {
    const field = fieldMap[`FORMAT/${id}`];
    const fieldConfig = createConfigFieldGenotype(configStatic, field, sample);
    fieldConfigs.push(fieldConfig);
  }

  return fieldConfigs.filter((fieldConfig) => fieldConfig !== null);
}
