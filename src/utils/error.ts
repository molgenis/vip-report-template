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
