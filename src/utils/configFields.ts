import {
  CellValueAlt,
  CellValueChrom,
  CellValueFilter,
  CellValueGenotype,
  CellValueId,
  CellValueInfo,
  CellValuePos,
  CellValueQual,
  CellValueRef,
  ConfigCell,
  ConfigCellAlt,
  ConfigCellChrom,
  ConfigCellFilter,
  ConfigCellFixed,
  ConfigCellGenotype,
  ConfigCellGroup,
  ConfigCellId,
  ConfigCellInfo,
  ConfigCellItem,
  ConfigCellPos,
  ConfigCellQual,
  ConfigCellRef,
  RecordContext,
} from "../types/configCell";
import { createConfigFieldComposed } from "./configFieldsComposed";
import {
  ConfigCells,
  ConfigStaticField,
  ConfigStaticFieldAlt,
  ConfigStaticFieldChrom,
  ConfigStaticFieldFilter,
  ConfigStaticFieldFixed,
  ConfigStaticFieldGenotype,
  ConfigStaticFieldId,
  ConfigStaticFieldInfo,
  ConfigStaticFieldItem,
  ConfigStaticFieldItemGroup,
  ConfigStaticFieldPos,
  ConfigStaticFieldQual,
  ConfigStaticFieldRef,
} from "../types/config";
import { Item } from "@molgenis/vip-report-api";
import { FieldMetadata, Value, VcfRecord } from "@molgenis/vip-report-vcf";
import { VariantType } from "./variantTypeUtils";
import { SampleContainer } from "../Api.ts";
import { FieldMap, getRecordSample } from "./utils.ts";
import { ArrayIndexOutOfBoundsException, RuntimeError, UnexpectedEnumValueException } from "./error.ts";
import { getInfoValueCount, getRecordSampleValueCount, getRequiredNestedFieldIndex } from "./field.ts";

export function createConfigFields(
  configStaticFields: ConfigStaticField[],
  fieldMap: FieldMap,
  sample: SampleContainer | null,
  variantType: VariantType,
): ConfigCells {
  const configFields: (ConfigCell | null)[] = configStaticFields.flatMap((configStaticField) => {
    let configFields: (ConfigCell | null)[];
    if (configStaticField.type === "group") {
      configFields = [
        createConfigFieldItemGroup(configStaticField as ConfigStaticFieldItemGroup, fieldMap, sample, variantType),
      ];
    } else {
      configFields = createConfigFieldItem(configStaticField as ConfigStaticFieldItem, fieldMap, sample, variantType);
    }
    return configFields;
  });
  return configFields.filter((configField) => configField !== null);
}

function createConfigFieldItemGroup(
  configStaticFieldGroup: ConfigStaticFieldItemGroup,
  fieldMap: FieldMap,
  sample: SampleContainer | null,
  variantType: VariantType,
) {
  const configFields = createConfigFields(
    configStaticFieldGroup.fields,
    fieldMap,
    sample,
    variantType,
  ) as ConfigCellItem[];

  let fieldConfig: ConfigCellGroup | null;
  if (configFields.length === 0) {
    fieldConfig = null;
  } else {
    fieldConfig = { type: "group", fieldConfigs: configFields };
  }
  return fieldConfig;
}

function createConfigFieldChrom(configStatic: ConfigStaticFieldChrom): ConfigCellChrom {
  return {
    type: "chrom",
    label: () => configStatic.label || "Chromosome",
    description: () => configStatic.description || null,
    value: (record: Item<VcfRecord>): CellValueChrom => record.data.c,
    valueCount: () => 1,
  };
}

function createConfigFieldPos(configStatic: ConfigStaticFieldPos): ConfigCellPos {
  return {
    type: "pos",
    label: () => configStatic.label || "Position",
    description: () => configStatic.description || null,
    value: (record: Item<VcfRecord>): CellValuePos => record.data.p,
    valueCount: () => 1,
  };
}

function createConfigFieldId(configStatic: ConfigStaticFieldId): ConfigCellId {
  return {
    type: "id",
    label: () => configStatic.label || "Ids",
    description: () => configStatic.description || null,
    value: (record: Item<VcfRecord>): CellValueId => record.data.i,
    valueCount: () => 1,
  };
}

function createConfigFieldRef(configStatic: ConfigStaticFieldRef): ConfigCellRef {
  return {
    type: "ref",
    label: () => configStatic.label || "Ref",
    description: () => configStatic.description || "Reference base(s)",
    value: (record: Item<VcfRecord>): CellValueRef => record.data.r,
    valueCount: () => 1,
  };
}

function createConfigFieldAlt(configStatic: ConfigStaticFieldAlt): ConfigCellAlt {
  return {
    type: "alt",
    label: () => configStatic.label || "Alt",
    description: () => configStatic.description || "Alternate base(s): list of alternate non-reference alleles",
    value: (record: Item<VcfRecord>): CellValueAlt => record.data.a,
    valueCount: () => 1,
  };
}

function createConfigFieldQual(configStatic: ConfigStaticFieldQual): ConfigCellQual {
  return {
    type: "qual",
    label: () => configStatic.label || "Qual",
    description: () => configStatic.description || "Quality: phred-scaled quality score for the 'Alt' assertions",
    value: (record: Item<VcfRecord>): CellValueQual => record.data.q,
    valueCount: () => 1,
  };
}

function createConfigFieldFilter(configStatic: ConfigStaticFieldFilter): ConfigCellFilter {
  return {
    type: "filter",
    label: () => configStatic.label || "Filters",
    description: () =>
      configStatic.description ||
      "Filter status: PASS if this position has passed all filter, otherwise a list of codes for filters that fail",
    value: (record: Item<VcfRecord>): CellValueFilter => record.data.f,
    valueCount: () => 1,
  };
}

function createConfigFieldFixed(configStaticField: ConfigStaticFieldFixed): ConfigCellFixed {
  let configField: ConfigCellFixed;
  switch (configStaticField.name) {
    case "chrom":
      configField = createConfigFieldChrom(configStaticField);
      break;
    case "pos":
      configField = createConfigFieldPos(configStaticField);
      break;
    case "id":
      configField = createConfigFieldId(configStaticField);
      break;
    case "ref":
      configField = createConfigFieldRef(configStaticField);
      break;
    case "alt":
      configField = createConfigFieldAlt(configStaticField);
      break;
    case "qual":
      configField = createConfigFieldQual(configStaticField);
      break;
    case "filter":
      configField = createConfigFieldFilter(configStaticField);
      break;
    default:
      throw new UnexpectedEnumValueException(configStaticField["name"]);
  }
  return configField;
}

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

function createConfigFieldsInfo(configStatic: ConfigStaticFieldInfo, fieldMap: FieldMap): ConfigCellInfo[] {
  const id = configStatic.name;

  const fieldConfigs: (ConfigCellInfo | null)[] = [];
  if (id.endsWith("*")) {
    const baseId = id.length === 1 ? "INFO/" : `INFO/${id.substring(0, id.length - 1)}`;
    Object.entries(fieldMap).forEach(([fieldId, field]) => {
      if (fieldId.startsWith(baseId) && !field.nested) {
        console.log(fieldId);
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

function createConfigFieldsGenotype(
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
        console.log(fieldId);
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

function createConfigFieldItem(
  configStaticField: ConfigStaticFieldItem,
  fieldMap: FieldMap,
  sample: SampleContainer | null,
  variantType: VariantType,
): ConfigCell[] {
  const type = configStaticField.type;

  let configFields: (ConfigCell | null)[];
  switch (type) {
    case "fixed":
      configFields = [createConfigFieldFixed(configStaticField)];
      break;
    case "info":
      configFields = createConfigFieldsInfo(configStaticField, fieldMap);
      break;
    case "format":
      throw new Error(`unsupported field type '${type}', did you mean to use 'genotype'?`);
    case "genotype":
      if (sample === null) throw new Error(`cannot create field, field type ${type} requires sample`);
      configFields = createConfigFieldsGenotype(configStaticField, fieldMap, sample);
      break;
    case "composed":
      configFields = [createConfigFieldComposed(configStaticField, fieldMap, sample, variantType)];
      break;
  }
  return configFields.filter((configField) => configField !== null);
}
