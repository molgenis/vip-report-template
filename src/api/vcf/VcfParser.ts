import {
  parseFloatValue,
  parseIntegerValueNonNull,
  parseStringArray,
  parseStringArrayNonNullValues,
  parseStringValueNonNull,
  Value,
  ValueInteger,
  ValueString,
} from "./ValueParser";
import { MISSING } from "./Constants";
import { FieldMetadata, parseFormatMetadata, parseInfoMetadata } from "./MetadataParser";
import { parseValue } from "./DataParser";
import { FormatMetadataContainer, parseRecordSample, RecordSample } from "./SampleDataParser";
import { Metadata, Record } from "./Vcf";

export interface Container {
  metadata: Metadata;
  data: Record[];
}

export interface FieldMetadataContainer {
  [key: string]: FieldMetadata;
}

export interface InfoContainer {
  [key: string]: Value | Value[];
}

export function parseVcf(vcf: string): Container {
  const container = {
    metadata: {
      lines: [],
      info: {},
      format: {},
      samples: [],
    },
    data: [],
  };

  for (const line of vcf.split(/\r?\n/)) {
    if (line.length !== 0) {
      parseLine(line, container);
    }
  }
  return container;
}

function parseLine(line: string, vcf: Container) {
  if (line.charAt(0) === "#") {
    vcf.metadata.lines.push(line);

    if (line.charAt(1) === "#") {
      parseMetadataLine(line, vcf.metadata);
    } else {
      parseHeaderLine(line, vcf.metadata);
    }
  } else {
    const record = parseDataLine(line, vcf.metadata);
    vcf.data.push(record);
  }
}

function parseMetadataLine(line: string, metadata: Metadata) {
  if (line.startsWith("##INFO")) {
    const infoMetadata = parseInfoMetadata(line);
    metadata.info[infoMetadata.id] = infoMetadata;
  } else if (line.startsWith("##FORMAT")) {
    const formatMetadata = parseFormatMetadata(line);
    metadata.format[formatMetadata.id] = formatMetadata;
  }
}

function parseHeaderLine(line: string, metadata: Metadata): void {
  const tokens = line.split("\t");
  metadata.samples = tokens.length > 9 ? tokens.slice(9) : [];
}

function parseDataLine(line: string, metadata: Metadata): Record {
  const tokens = line.split("\t");

  return {
    c: parseStringValueNonNull(tokens[0]),
    p: parseIntegerValueNonNull(tokens[1]),
    i: parseStringArrayNonNullValues(tokens[2], ";"),
    r: parseStringValueNonNull(tokens[3]),
    a: parseStringArray(tokens[4], ","),
    q: parseFloatValue(tokens[5]),
    f: parseStringArrayNonNullValues(tokens[6], ";"),
    n: parseInfoContainer(tokens[7], metadata.info),
    s: tokens.length > 8 ? parseRecordSamples(tokens, metadata.format) : [],
  };
}

function parseInfoContainer(token: string, infoMetadataContainer: FieldMetadataContainer): InfoContainer {
  if (token === MISSING) {
    return {};
  }
  const info: InfoContainer = {};
  for (const part of parseStringArray(token, ";", false)) {
    if (part !== null) {
      const idx = part.indexOf("=");
      const key = idx !== -1 ? part.substring(0, idx) : part;
      const value = idx !== -1 ? part.substring(idx + 1) : true.toString();
      info[key] = parseValue(value, infoMetadataContainer[key]);
    }
  }
  return info;
}

function parseRecordSamples(tokens: string[], formatMetadataContainer: FormatMetadataContainer): RecordSample[] {
  const formatFields = parseStringArrayNonNullValues(tokens[8], ":");

  const recordSamples: RecordSample[] = [];
  for (let i = 9; i < tokens.length; ++i) {
    const recordSample = parseRecordSample(tokens[i], formatFields, formatMetadataContainer);
    recordSamples.push(recordSample);
  }
  return recordSamples;
}
