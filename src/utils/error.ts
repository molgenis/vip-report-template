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

export class UnknownVcfFieldError extends Error {
  constructor(fieldId: string, parentFieldId?: string) {
    super(`unknown INFO or FORMAT field '${parentFieldId ? parentFieldId + "/" : ""}${fieldId}'`);
    this.name = "UnknownVcfFieldError";
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
