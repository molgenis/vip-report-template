import { Container, FormatMetadataContainer, Genotype, Metadata, Record, RecordSample } from "./Vcf";
import { MISSING } from "./Constants";
import { FieldMetadataContainer, InfoContainer } from "./VcfParser";
import { FieldMetadata, FormatMetadata, NestedFieldMetadata } from "./MetadataParser";
import { Value } from "./ValueParser";
import { RecordSampleType } from "./SampleDataParser";

export type Filter = {
  samples?: string[];
};

export function writeVcf(container: Container, filter: Filter = {}): string {
  let vcf = [];
  vcf.push(writeHeader(container.metadata, filter));

  for (const record of container.data) {
    const line = writeRecord(container.metadata, record, filter);
    vcf.push(line);
  }
  return vcf.join("\n") + "\n";
}

function writeHeader(metadata: Metadata, filter: Filter): string {
  let vcf = [];
  for (const [index, line] of metadata.lines.entries()) {
    if (index !== metadata.lines.length - 1) {
      vcf.push(line);
    } else if (filter.samples !== undefined) {
      vcf.push(
        line
          .split("\t")
          .filter((token, index) => index <= 8 || filter.samples?.indexOf(token) !== -1)
          .join("\t")
      );
    } else {
      vcf.push(line);
    }
  }
  return vcf.join("\n");
}

function writeRecord(metadata: Metadata, record: Record, filter: Filter): string {
  let vcf = [];
  vcf.push(writeChr(record.c));
  vcf.push(writePos(record.p));
  vcf.push(writeIds(record.i));
  vcf.push(writeRef(record.r));
  vcf.push(writeAlts(record.a));
  vcf.push(writeQual(record.q));
  vcf.push(writeFilters(record.f));
  vcf.push(writeInfo(metadata.info, record.n));

  const samples = filter.samples ? filterSamples(metadata.samples, record.s, filter.samples) : record.s;
  if (samples.length > 0) {
    vcf.push(writeFormat(samples));
    for (const sample of samples) {
      vcf.push(writeSample(metadata.format, sample));
    }
  }

  return vcf.join("\t");
}

function filterSamples(sampleIds: string[], samples: RecordSample[], filterSampleIds: string[]): RecordSample[] {
  const filterSamples = [];
  for (const [index, sample] of sampleIds.entries()) {
    if (filterSampleIds.indexOf(sample) !== -1) {
      filterSamples.push(samples[index]);
    }
  }
  console.log(filterSamples);
  return filterSamples;
}

function writeChr(chr: string): string {
  return writeString(chr);
}

function writePos(pos: number): string {
  return pos.toString();
}

function writeIds(ids: string[]): string {
  return ids.length > 0 ? ids.map(writeString).join(";") : MISSING;
}

function writeRef(ref: string): string {
  return writeString(ref);
}

function writeAlts(alts: (string | null)[]): string {
  return alts.length > 0 ? alts.map((alt) => (alt !== null ? writeString(alt) : MISSING)).join(",") : MISSING;
}

function writeQual(quality: number | null): string {
  return quality !== null ? quality.toString() : MISSING;
}

function writeFilters(filters: string[]): string {
  return filters.length > 0 ? filters.map(writeString).join(";") : MISSING;
}

function writeInfo(infoFields: FieldMetadataContainer, infoValues: InfoContainer): string {
  if (Object.keys(infoFields).length === 0) {
    return MISSING;
  }

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
  if (infoField.number.count === 0) {
    vcf = infoField.id;
  } else if (infoField.number.count === 1) {
    vcf = infoField.id + "=" + writeFieldValueSingle(infoField, infoValue as Value);
  } else {
    vcf = infoField.id + "=" + writeFieldValueMultiple(infoField, infoValue as Value[], ",");
  }
  return vcf;
}

function writeFieldValueSingle(field: FieldMetadata, value: Value, missingValue = MISSING): string {
  let vcf;
  if (field.nested) {
    vcf = writeFieldValueNested(field.nested, value as unknown as Value[]);
  } else {
    vcf = writeFieldValue(field, value, missingValue);
  }
  return vcf;
}

function writeFieldValueMultiple(field: FieldMetadata, values: Value[], separator: string): string {
  const vcf = [];

  for (const infoValue of values) {
    if (field.nested) {
      vcf.push(writeFieldValueNested(field.nested, infoValue as unknown as Value[]));
    } else {
      vcf.push(writeFieldValue(field, infoValue, ""));
    }
  }

  return vcf.join(separator);
}

function writeFieldValueNested(nestedField: NestedFieldMetadata, nestedValues: Value[]): string {
  const vcf = [];
  for (const [index, infoField] of nestedField.items.entries()) {
    if (infoField.number.count === 1) {
      vcf.push(writeFieldValueSingle(infoField, nestedValues[index], ""));
    } else {
      vcf.push(writeFieldValueMultiple(infoField, nestedValues[index] as unknown as Value[], "&"));
    }
  }
  return vcf.join(nestedField.separator);
}

function writeFieldValue(field: FieldMetadata, value: Value, missingValue: string = MISSING): string {
  let vcf;
  switch (field.type) {
    case "CATEGORICAL":
    case "CHARACTER":
    case "STRING":
      vcf = value !== null ? writeString(value as string) : missingValue;
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

function writeString(value: string) {
  return value
    .replace("%", "%25")
    .replace(":", "%3A")
    .replace(";", "%3B")
    .replace("=", "%3D")
    .replace(",", "%2C")
    .replace("\r", "%0D")
    .replace("\n", "%0A")
    .replace("\t", "%09");
}

function writeFormat(samples: RecordSample[]): string {
  const keys = Object.keys(samples[0]);
  return keys.length > 0 ? keys.map(writeString).join(":") : MISSING;
}

function writeSample(formatFields: FormatMetadataContainer, sample: RecordSample): string {
  const vcf = [];
  for (const [key, value] of Object.entries(sample)) {
    vcf.push(writeSampleValue(formatFields[key], value));
  }
  return vcf.join(":");
}

function writeSampleValue(formatField: FormatMetadata, value: RecordSampleType): string {
  let vcf;
  if (formatField.id === "GT") {
    vcf = writeSampleValueGt(formatField, value as Genotype);
  } else {
    if (formatField.number.count === 0) {
      vcf = formatField.id;
    } else if (formatField.number.count === 1) {
      vcf = writeFieldValueSingle(formatField, value as Value);
    } else {
      vcf = writeFieldValueMultiple(formatField, value as Value[], ",");
    }
  }
  return vcf;
}

function writeSampleValueGt(formatField: FormatMetadata, value: Genotype) {
  return value.a.join(value.p ? "|" : "/");
}
