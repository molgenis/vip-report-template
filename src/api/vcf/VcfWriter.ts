import { Container, FormatMetadataContainer, Genotype, Metadata, Record, RecordSample } from "./Vcf";
import { MISSING } from "./Constants";
import { FieldMetadataContainer, InfoContainer } from "./VcfParser";
import { FieldMetadata, FormatMetadata, NestedFieldMetadata } from "./MetadataParser";
import { Value } from "./ValueParser";
import { RecordSampleType } from "./SampleDataParser";

export function writeVcf(container: Container): string {
  let lines = [];
  for (const line of container.metadata.lines) {
    lines.push(line);
  }
  for (const record of container.data) {
    const line = writeRecord(container.metadata, record);
    lines.push(line);
  }
  return lines.join("\n");
}

function writeRecord(metadata: Metadata, record: Record): string {
  let vcf = [];
  vcf.push(record.c);
  vcf.push(record.p);
  vcf.push(record.i.length > 0 ? record.i.join(",") : MISSING);
  vcf.push(record.r);
  vcf.push(record.a.map((alt) => (alt !== null ? alt : MISSING)));
  vcf.push(record.q !== null ? record.q : MISSING);
  vcf.push(record.f.length > 0 ? record.f.join(",") : MISSING);
  vcf.push(writeInfo(metadata.info, record.n));

  for (const [index, sample] of record.s.entries()) {
    if (index === 0) {
      vcf.push(writeFormat(Object.keys(sample)));
    }
    vcf.push(writeSample(metadata.format, sample));
  }

  return vcf.join("\t");
}

function writeInfo(infoFields: FieldMetadataContainer, infoValues: InfoContainer): string {
  let vcf = [];
  for (const infoField of Object.values(infoFields)) {
    if (infoField.id in infoValues) {
      vcf.push(writeInfoField(infoField, infoValues[infoField.id]));
    }
  }
  return vcf.join(";");
}

function writeInfoField(infoField: FieldMetadata, infoValue: Value | Value[]): string {
  let vcf;
  if (infoField.number.count === 1) {
    vcf = writeInfoFieldSingle(infoField, infoValue as Value);
  } else {
    vcf = writeInfoFieldMultiple(infoField, infoValue as Value[]);
  }
  return vcf;
}

function writeInfoFieldSingle(infoField: FieldMetadata, infoValue: Value): string {
  let vcf;
  if (infoField.nested) {
    vcf = infoField.id + "=" + writeFieldValueNested(infoField.nested, infoValue as unknown as Value[]);
  } else if (infoField.type === "FLAG") {
    vcf = infoField.id;
  } else {
    vcf = infoField.id + "=" + writeFieldValue(infoField, infoValue, MISSING);
  }
  return vcf;
}

function writeInfoFieldMultiple(infoField: FieldMetadata, infoValues: Value[]): string {
  const vcf = [];

  for (const infoValue of infoValues) {
    if (infoField.nested) {
      vcf.push(writeFieldValueNested(infoField.nested, infoValue as unknown as Value[]));
    } else {
      vcf.push(writeFieldValue(infoField, infoValue, ""));
    }
  }

  return infoField.id + "=" + vcf.join(",");
}

function writeFieldValueNested(nestedField: NestedFieldMetadata, nestedValues: Value[]): string {
  const vcf = [];
  for (const [index, infoField] of nestedField.items.entries()) {
    vcf.push(writeFieldValue(infoField, nestedValues[index], ""));
  }
  return vcf.join(nestedField.separator);
}

function writeFieldValue(field: FieldMetadata, value: Value, missingValue: string): string {
  let vcf;
  switch (field.type) {
    case "CATEGORICAL":
    case "CHARACTER":
    case "STRING":
      // TODO escaping
      vcf = value !== null ? (value as string) : missingValue;
      break;
    case "FLOAT":
    case "INTEGER":
      vcf = value !== null ? `${value as number}` : missingValue;
      break;
    case "FLAG":
    case "NESTED":
      throw new Error(`unexpected info value type '${field.type}'`);
    default:
      throw new Error(`invalid info value type '${field.type}'`);
  }
  return vcf;
}

function writeFormat(keys: string[]) {
  return keys.join(":");
}

function writeSample(formatFields: FormatMetadataContainer, sample: RecordSample) {
  const vcf = [];
  for (const [key, value] of Object.entries(sample)) {
    vcf.push(writeSampleValue(formatFields[key], value));
  }
  return vcf.join(":");
}

function writeSampleValue(formatField: FormatMetadata, value: RecordSampleType) {
  let vcf;
  if (formatField.id === "GT") {
    vcf = writeSampleValueGt(formatField, value as Genotype);
  } else {
    if (formatField.number.count === 1) {
      vcf = writeSampleValueSingle(formatField, value as Value);
    } else {
      vcf = writeSampleValueMultiple(formatField, value as Value[]);
    }
  }
  return vcf;
}

function writeSampleValueGt(formatField: FormatMetadata, value: Genotype) {
  return value.a.join(value.p ? "|" : "/");
}

function writeSampleValueSingle(formatField: FormatMetadata, value: Value) {
  let vcf;
  if (formatField.type === "FLAG") {
    vcf = formatField.id;
  } else {
    vcf = writeFieldValue(formatField, value, MISSING);
  }
  return vcf;
}

function writeSampleValueMultiple(formatField: FormatMetadata, values: Value[]) {
  const vcf = [];
  for (const value of values) {
    vcf.push(writeFieldValue(formatField, value, ""));
  }
  return vcf.join(",");
}
