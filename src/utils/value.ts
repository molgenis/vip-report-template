import { Value, ValueCharacter, ValueFlag, ValueFloat, ValueInteger, ValueString } from "../api/vcf/ValueParser";

export function asValueCharacter(val: Value) {
  return val as ValueCharacter;
}

export function asValueFlag(val: Value) {
  return val as ValueFlag;
}

export function asValueFloat(val: Value) {
  return val as ValueFloat;
}

export function asValueInteger(val: Value) {
  return val as ValueInteger;
}

export function asValueIntegerArray(val: Value) {
  return val as ValueInteger[];
}

export function asValueString(val: Value) {
  return val as ValueString;
}

export function asValueStringArray(val: Value) {
  return val as ValueString[];
}

export function asValuePrimitive(val: Value) {
  return val as ValueCharacter | ValueFlag | ValueFloat | ValueInteger | ValueString;
}

export function asValuePrimitiveArray(val: Value) {
  return val as ValueCharacter[] | ValueInteger[] | ValueFlag[] | ValueFloat[] | ValueString[];
}
