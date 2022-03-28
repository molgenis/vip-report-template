import { parseIntegerValueNonNull, parseStringValueNonNull } from "./ValueParser";
import { createVepInfoMetadata, isVepInfoMetadata } from "./VepMetadataParser";

export type NumberType = "NUMBER" | "PER_ALT" | "PER_ALT_AND_REF" | "PER_GENOTYPE" | "OTHER";

export interface NumberMetadata {
  type: NumberType;
  count?: number;
  separator?: string;
}

export function parseNumberMetadata(token: string): NumberMetadata {
  let type: NumberType;
  let count;
  let separator;

  switch (token) {
    case "A":
      type = "PER_ALT";
      separator = ",";
      break;
    case "R":
      type = "PER_ALT_AND_REF";
      separator = ",";
      break;
    case "G":
      type = "PER_GENOTYPE";
      separator = ",";
      break;
    case ".":
      type = "OTHER";
      separator = ",";
      break;
    default:
      type = "NUMBER";
      count = parseIntegerValueNonNull(token);
      if (count > 1) {
        separator = ",";
      }
      break;
  }

  const numberMetaData: NumberMetadata = { type };
  if (separator !== undefined) {
    numberMetaData.separator = separator;
  }
  if (count !== undefined) {
    numberMetaData.count = count;
  }
  return numberMetaData;
}

export type ValueType = "CATEGORICAL" | "CHARACTER" | "INTEGER" | "FLAG" | "FLOAT" | "STRING" | "NESTED";

export function parseValueType(token: string): ValueType {
  let type: ValueType;

  switch (token) {
    case "Character":
      type = "CHARACTER";
      break;
    case "Flag":
      type = "FLAG";
      break;
    case "Float":
      type = "FLOAT";
      break;
    case "Integer":
      type = "INTEGER";
      break;
    case "String":
      type = "STRING";
      break;
    default:
      throw new Error(`invalid value type '${token}'`);
  }

  return type;
}

export interface FieldMetadata {
  id: string;
  number: NumberMetadata;
  type: ValueType;
  description: string;
  categories?: string[];
  required: boolean;
  nested?: NestedFieldMetadata;
  parent?: FieldMetadata;
}

export interface NestedFieldMetadata {
  separator: string;
  items: FieldMetadata[];
}

export interface FormatMetadata extends FieldMetadata {}
export interface InfoMetadata extends FieldMetadata {
  source?: string;
  version?: string;
}
const REG_EXP_FORMAT = /##FORMAT=<ID=(.+?),Number=(.+?),Type=(.+?),Description="(.+?)">/;

export function parseFormatMetadata(token: string): FormatMetadata {
  const result = token.match(REG_EXP_FORMAT);
  if (result === null) {
    throw new Error(`invalid format metadata '${token}'`);
  }

  return {
    id: parseStringValueNonNull(result[1]),
    number: parseNumberMetadata(result[2]),
    type: parseValueType(result[3]),
    description: parseStringValueNonNull(result[4]),
    required: false,
  };
}

const REG_EXP_INFO =
  /##INFO=<ID=(.+?),Number=(.+?),Type=(.+?),Description="(.+?)"(?:,Source="(.+?)")?(?:,Version="(.+?)")?>/;

export function parseInfoMetadata(token: string): InfoMetadata {
  const result = token.match(REG_EXP_INFO);
  if (result === null) {
    throw new Error(`invalid info metadata '${token}'`);
  }

  const infoMetadata: InfoMetadata = {
    id: result[1],
    number: parseNumberMetadata(result[2]),
    type: parseValueType(result[3]),
    description: result[4],
    required: false,
  };

  const source = result[5];
  if (source !== undefined) {
    infoMetadata.source = source;
  }
  const version = result[6];
  if (version !== undefined) {
    infoMetadata.version = version;
  }
  const nested = createNestedInfoMetadata(infoMetadata);
  if (nested != null) {
    infoMetadata.nested = nested;
  }
  return infoMetadata;
}

function createNestedInfoMetadata(infoMetadata: InfoMetadata): NestedFieldMetadata | null {
  let nestedInfoMetadata: NestedFieldMetadata | null;
  if (isVepInfoMetadata(infoMetadata)) {
    nestedInfoMetadata = createVepInfoMetadata(infoMetadata);
  } else {
    nestedInfoMetadata = null;
  }
  return nestedInfoMetadata;
}
