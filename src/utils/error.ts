import { ValidateFunction } from "ajv";
import { SortPath } from "@molgenis/vip-report-api";

export class ArrayIndexOutOfBoundsException extends Error {
  constructor() {
    super();
    this.name = "ArrayIndexOutOfBoundsException";
  }
}

export class UnexpectedEnumValueException extends Error {
  constructor(enumValue: string) {
    super(enumValue);
    this.name = "UnexpectedEnumValueException";
  }
}

export class InvalidIdException extends Error {
  constructor(id: string | undefined) {
    super(id);
    this.name = "InvalidIdException";
  }
}

export class InvalidVcfError extends Error {
  constructor() {
    super();
    this.name = "InvalidVcfException";
  }
}

/**
 * programming error
 */
export class RuntimeError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "RuntimeError";
  }
}

export class ConfigValidationError extends Error {
  constructor(validate: ValidateFunction) {
    super("config invalid");
    this.name = "ConfigValidationError";
    console.error("validation errors", validate.errors);
  }
}

export class ConfigInvalidError extends Error {
  constructor(message?: string) {
    super("config invalid" + (message ? `: ${message}` : ""));
    this.name = "ConfigInvalidError";
  }
}

export class ConfigInvalidPropertyValueError extends ConfigInvalidError {
  constructor(property: string, value: string, message: string) {
    super(`property '${property}' value '${value}' ${message}`);
    this.name = "ConfigInvalidError";
  }
}

export class InvalidSortPathError extends Error {
  constructor(path: SortPath) {
    super(`invalid record sort path '[${path.join(",")}]'`);
    this.name = "InvalidSortPathError";
  }
}
