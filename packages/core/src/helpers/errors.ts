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
    super(`"${param}" can not be null or undefined.`);
    this.name = 'RequiredParameterError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequiredParameterError);
    }
  }
}

export class MethodNotSupported extends Error {
  constructor(method: string, resource: string) {
    super(`${method} method is not supported on resource ${resource}.`);
    this.name = 'MethodNotSupported';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MethodNotSupported);
    }
  }
}

export class DocumentNotFound extends Error {
  constructor(identifier: string) {
    super(`A document with the identifier ${identifier} could not be found.`);
    this.name = 'DocumentNotFound';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DocumentNotFound);
    }
  }
}
