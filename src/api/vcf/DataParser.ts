import { InfoMetadata, NestedFieldMetadata } from "./MetadataParser";
import { parseTypedValue, Value } from "./ValueParser";

export function parseValue(token: string, infoMetadata: InfoMetadata): Value {
  let value: Value;
  const type = infoMetadata.number.type;
  switch (type) {
    case "NUMBER":
      if (infoMetadata.number.count === 0 || infoMetadata.number.count === 1) {
        value = parseSingleValue(token, infoMetadata);
      } else {
        value = parseMultiValue(token, infoMetadata);
      }
      break;
    case "PER_ALT":
    case "PER_ALT_AND_REF":
    case "PER_GENOTYPE":
    case "OTHER":
      value = parseMultiValue(token, infoMetadata);
      break;
    default:
      throw new Error(`invalid number type '${type}'`);
  }

  return value;
}

export function parseSingleValue(token: string, infoMetadata: InfoMetadata): Value {
  let value: Value;
  if (infoMetadata.nested) {
    value = parseNestedValue(token, infoMetadata.nested);
  } else {
    value = parseTypedValue(token, infoMetadata.type);
  }
  return value;
}

export function parseMultiValue(token: string, infoMetadata: InfoMetadata): Value {
  const values: Value = [];
  if (token.length > 0) {
    for (const part of token.split(infoMetadata.number.separator as string)) {
      values.push(parseSingleValue(part, infoMetadata));
    }
  }
  return values;
}

export function parseNestedValue(token: string, nestedInfoMetadata: NestedFieldMetadata): Value[] {
  const infoValues: Value[] = [];
  const parts = token.split(nestedInfoMetadata.separator);
  for (let i = 0; i < parts.length; ++i) {
    infoValues.push(parseValue(parts[i], nestedInfoMetadata.items[i]));
  }
  return infoValues;
}
