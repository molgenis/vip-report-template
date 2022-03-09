import { MISSING } from "./Constants";
import { ValueType } from "./MetadataParser";

export type Value = ValueCharacter | ValueFlag | ValueFloat | ValueInteger | ValueString | Value[];
export type ValueCharacter = string | null;
export type ValueFlag = boolean | null;
export type ValueFloat = number | null;
export type ValueInteger = number | null;
export type ValueString = string | null;

export function parseTypedValue(token: string, type: ValueType): Value {
  let value: Value;

  switch (type) {
    case "CHARACTER":
      value = parseCharacterValue(token);
      break;
    case "STRING":
      value = parseStringValue(token);
      break;
    case "INTEGER":
      value = parseIntegerValue(token);
      break;
    case "FLAG":
      value = parseFlagValue(token);
      break;
    case "FLOAT":
      value = parseFloatValue(token);
      break;
    default:
      throw new Error(`invalid value type '${type}'`);
  }

  return value;
}

export function parseCharacterValue(token: string): string | null {
  let value;
  if (token.length === 0 || token === MISSING) {
    value = null;
  } else if (token.length === 1) {
    value = token;
  } else {
    throw new Error(`invalid character '${token}'`);
  }
  return value;
}

export function parseStringValue(token: string, unescape: boolean = true): string | null {
  let value;
  if (token.length === 0 || token === MISSING) {
    value = null;
  } else if (!unescape || token.indexOf("%") === -1) {
    value = token;
  } else {
    value = token
      .replace(/%3A/g, ":")
      .replace(/%3B/g, ";")
      .replace(/%3D/g, "=")
      .replace(/%25/g, "%")
      .replace(/%2C/g, ",")
      .replace(/%0D/g, "\r")
      .replace(/%0A/g, "\n")
      .replace(/%09/g, "\t");
  }
  return value;
}

export function parseStringValueNonNull(token: string): string {
  const value = parseStringValue(token);
  if (value === null) {
    throw new Error(`invalid string '${token}'`);
  }
  return value;
}

export function parseStringArray(token: string, separator: string, unescape: boolean = true): (string | null)[] {
  const value: (string | null)[] = [];
  if (token.length > 0 && token !== MISSING) {
    for (const part of token.split(separator)) {
      value.push(parseStringValue(part, unescape));
    }
  }
  return value;
}

export function parseStringArrayNonNullValues(token: string, separator: string): string[] {
  const value: string[] = [];
  if (token.length > 0 && token !== MISSING) {
    for (const part of token.split(separator)) {
      value.push(parseStringValueNonNull(part));
    }
  }
  return value;
}

export function parseIntegerValue(token: string): number | null {
  let value;
  if (token.length === 0 || token === MISSING) {
    value = null;
  } else {
    const upperCaseToken = token.toUpperCase();
    if (upperCaseToken === "INF" || upperCaseToken === "INFINITY") {
      value = Number.POSITIVE_INFINITY;
    } else if (upperCaseToken === "-INF" || upperCaseToken === "-INFINITY") {
      value = Number.NEGATIVE_INFINITY;
    } else if (upperCaseToken === "NAN") {
      value = Number.NaN;
    } else {
      value = parseInt(token, 10);
      if (Number.isNaN(value)) {
        throw new Error(`invalid integer '${token}'`);
      }
    }
  }
  return value;
}

export function parseIntegerValueNonNull(token: string): number {
  const value = parseIntegerValue(token);
  if (value === null) {
    throw new Error(`invalid integer '${token}'`);
  }
  return value;
}

export function parseFloatValue(token: string): number | null {
  let value;
  if (token.length === 0 || token === MISSING) {
    value = null;
  } else {
    const upperCaseToken = token.toUpperCase();
    if (upperCaseToken === "INF" || upperCaseToken === "INFINITY") {
      value = Number.POSITIVE_INFINITY;
    } else if (upperCaseToken === "-INF" || upperCaseToken === "-INFINITY") {
      value = Number.NEGATIVE_INFINITY;
    } else if (upperCaseToken === "NAN") {
      value = Number.NaN;
    } else {
      value = parseFloat(token);
      if (Number.isNaN(value)) {
        throw new Error(`invalid float '${token}'`);
      }
    }
  }
  return value;
}

export function parseFloatValueNonNull(token: string): number {
  const value = parseFloatValue(token);
  if (value === null) {
    throw new Error(`invalid float '${token}'`);
  }
  return value;
}

export function parseFlagValue(token: string): boolean {
  let value;
  if (token === true.toString()) {
    value = true;
  } else if (token === false.toString()) {
    value = false;
  } else {
    throw new Error(`invalid flag '${token}'`);
  }
  return value;
}
