// TODO: Convert the names to an Enum, or type so upper layers can expect them
export class UniqueConstraintError extends Error {
  constructor(value: string) {
    super(`${value} must be unique.`);
    this.name = 'UniqueConstraintError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UniqueConstraintError);
    }
  }
}

export class InvalidPropertyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidPropertyError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidPropertyError);
    }
  }
}

export class RequiredParameterError extends Error {
  constructor(param: string) {
    super(`${param} can not be null or undefined.`);
    this.name = 'RequiredParameterError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequiredParameterError);
    }
  }
}
