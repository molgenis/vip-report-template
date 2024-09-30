import {
  CellId,
  CellValueAlt,
  CellValueChrom,
  CellValueFilter,
  CellValueGenotype,
  CellValueId,
  CellValuePos,
  CellValueQual,
  CellValueRef,
  ConfigCell,
  ConfigCellAlt,
  ConfigCellChrom,
  ConfigCellCustom,
  ConfigCellFilter,
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
import { ConfigCells, ConfigStaticField, ConfigStaticFieldItem, ConfigStaticFieldItemGroup } from "../types/config";
import { ValueDescription } from "@molgenis/vip-report-vcf/src/types/Metadata";
import { Item } from "@molgenis/vip-report-api/src/Api";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { Value, ValueArray } from "@molgenis/vip-report-vcf/src/ValueParser";
import { CellValueCustom } from "../types/configCellComposed";
import { RecordSampleType } from "@molgenis/vip-report-vcf/src/SampleDataParser";
import { UnexpectedEnumValueException } from "./error";
import { VariantType } from "./variantTypeUtils";
import { SampleContainer } from "../Api.ts";
import { FieldMap, getRecordSample } from "./utils.ts";

export function createConfigFields(
  configStaticFields: ConfigStaticField[],
  fieldMap: FieldMap,
  sample: SampleContainer | null,
  variantType: VariantType,
): ConfigCells {
  const configFields: (ConfigCell | null)[] = configStaticFields.map((configStaticField) => {
    let configField: ConfigCell | null;
    if (configStaticField.type === "group") {
      configField = createConfigFieldItemGroup(
        configStaticField as ConfigStaticFieldItemGroup,
        fieldMap,
        sample,
        variantType,
      );
    } else {
      configField = createConfigFieldItem(configStaticField as ConfigStaticFieldItem, fieldMap, sample, variantType);
    }
    return configField;
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

function createConfigFieldChrom(): ConfigCellChrom {
  return {
    type: "chrom",
    value: (record: Item<Record>): CellValueChrom => record.data.c,
    valueCount: () => 1,
  };
}

function createConfigFieldPos(): ConfigCellPos {
  return {
    type: "pos",
    value: (record: Item<Record>): CellValuePos => record.data.p,
    valueCount: () => 1,
  };
}

function createConfigFieldId(): ConfigCellId {
  return {
    type: "id",
    value: (record: Item<Record>): CellValueId => record.data.i,
    valueCount: () => 1,
  };
}

function createConfigFieldRef(): ConfigCellRef {
  return {
    type: "ref",
    value: (record: Item<Record>): CellValueRef => record.data.r,
    valueCount: () => 1,
  };
}

function createConfigFieldAlt(): ConfigCellAlt {
  return {
    type: "alt",
    value: (record: Item<Record>): CellValueAlt => record.data.a,
    valueCount: () => 1,
  };
}

function createConfigFieldQual(): ConfigCellQual {
  return {
    type: "qual",
    value: (record: Item<Record>): CellValueQual => record.data.q,
    valueCount: () => 1,
  };
}

function createConfigFieldFilter(): ConfigCellFilter {
  return {
    type: "filter",
    value: (record: Item<Record>): CellValueFilter => record.data.f,
    valueCount: () => 1,
  };
}

function createConfigFieldInfo(id: CellId, fieldMap: FieldMap): ConfigCellInfo | null {
  const field = fieldMap[`INFO/${id}`];

  let fieldConfig: ConfigCellInfo | null;
  if (field === undefined) {
    fieldConfig = null;
  } else {
    const fieldParent = field.parent;
    const fieldParentIndex = fieldParent?.nested!.items.findIndex((nestedField) => nestedField.id === field.id);
    const fieldParentCount = fieldParent?.number.count;

    fieldConfig = {
      type: "info",
      valueCount: (record: Item<Record>) => {
        return fieldParent
          ? fieldParent.number.count !== 1
            ? (record.data.n[fieldParent.id] as ValueArray).length
            : 1
          : 1;
      },
      field,
      value(record: Item<Record>, recordContext: RecordContext): Value | undefined {
        let value: Value | undefined;
        if (fieldParent) {
          const parentValue = record.data.n[fieldParent.id] as ValueArray;
          if (fieldParentCount === 1) {
            value = parentValue[fieldParentIndex!];
          } else {
            const valueIndex = recordContext.valueIndex!;
            value = parentValue[valueIndex][fieldParentIndex!];
          }
        } else {
          value = record.data.n[field.id];
        }
        return value;
      },
    };
  }

  return fieldConfig;
}

function createConfigFieldGenotype(id: CellId, fieldMap: FieldMap, sample: SampleContainer): ConfigCellGenotype | null {
  const field = fieldMap[`FORMAT/${id}`];

  let fieldConfig: ConfigCellGenotype | null;
  if (field === undefined) {
    fieldConfig = null;
  } else {
    const fieldParent = field.parent;
    const fieldParentIndex = fieldParent?.nested!.items.findIndex((nestedField) => nestedField.id === field.id);
    const fieldParentCount = fieldParent?.number.count;

    fieldConfig = {
      type: "genotype",
      valueCount: (record: Item<Record>) => {
        const fieldParent = field.parent;
        return fieldParent
          ? fieldParent.number.count !== 1
            ? (getRecordSample(record, sample)[fieldParent.id] as ValueArray).length
            : 1
          : 1;
      },
      field,
      value(record: Item<Record>, recordContext: RecordContext): CellValueGenotype | undefined {
        let value: RecordSampleType | undefined;
        if (fieldParent) {
          const parentValue = getRecordSample(record, sample)[field.id];
          if (fieldParentCount === 1) {
            value = (parentValue as ValueArray)[fieldParentIndex!];
          } else {
            value = (parentValue as ValueArray)[recordContext.valueIndex][fieldParentIndex!];
          }
        } else {
          value = getRecordSample(record, sample)[field.id];
        }
        return value;
      },
    };
  }
  return fieldConfig;
}

function createConfigFieldItem(
  configStaticField: ConfigStaticFieldItem,
  fieldMap: FieldMap,
  sample: SampleContainer | null,
  variantType: VariantType,
) {
  let configField: ConfigCell | null;
  switch (configStaticField.type) {
    case "chrom":
      configField = createConfigFieldChrom();
      break;
    case "pos":
      configField = createConfigFieldPos();
      break;
    case "id":
      configField = createConfigFieldId();
      break;
    case "ref":
      configField = createConfigFieldRef();
      break;
    case "alt":
      configField = createConfigFieldAlt();
      break;
    case "qual":
      configField = createConfigFieldQual();
      break;
    case "filter":
      configField = createConfigFieldFilter();
      break;
    case "info":
      configField = createConfigFieldInfo(configStaticField.name, fieldMap);
      break;
    case "format":
      throw new Error(`unsupported field type '${configStaticField.type}', did you mean to use 'genotype'?`);
    case "genotype":
      if (sample === null) throw new Error(`cannot create field, field type ${configStaticField.type} requires sample`);
      configField = createConfigFieldGenotype(configStaticField.name, fieldMap, sample);
      break;
    case "composed":
      configField = createConfigFieldComposed(configStaticField.name, fieldMap, sample, variantType);
      break;
  }
  return configField;
}

export function getConfigFieldLabelAndDescription(configField: ConfigCell): ValueDescription {
  let valueDescription: ValueDescription;
  switch (configField.type) {
    case "chrom":
      valueDescription = { label: "Chromosome" };
      break;
    case "pos":
      valueDescription = { label: "Position" };
      break;
    case "id":
      valueDescription = { label: "Identifier" };
      break;
    case "ref":
      valueDescription = { label: "Reference allele" };
      break;
    case "alt":
      valueDescription = { label: "Alternate alleles" };
      break;
    case "qual":
      valueDescription = { label: "Quality" };
      break;
    case "filter":
      valueDescription = { label: "Filter" };
      break;
    case "info":
    case "genotype": {
      const field = (configField as ConfigCellInfo | ConfigCellGenotype).field;
      valueDescription = { label: field.label || field.id, description: field.description };
      break;
    }
    case "composed": {
      const field = configField as ConfigCellCustom<CellValueCustom>;
      valueDescription = { label: field.label, description: field.description };
      break;
    }
    case "format":
    default:
      throw new UnexpectedEnumValueException(configField.type);
  }
  return valueDescription;
}
