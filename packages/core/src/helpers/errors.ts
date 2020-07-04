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

export class MethodNotSupportedError extends Error {
  constructor(method: string, resource: string) {
    super(`${method} method is not supported on resource ${resource}.`);
    this.name = 'MethodNotSupportedError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MethodNotSupportedError);
    }
  }
}

export class DocumentNotFoundError extends Error {
  constructor(identifier: string) {
    super(`A document with the identifier "${identifier}" could not be found.`);
    this.name = 'DocumentNotFoundError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DocumentNotFoundError);
    }
  }
}

export class EmptyObjectInitializationError extends Error {
  constructor(model: string) {
    super(`A "${model}" model was initialized with an empty object`);
    this.name = 'EmptyObjectInitializationError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EmptyObjectInitializationError);
    }
  }
}

// Builders

export const emptyObjectInitialization = (param = ''): any => {
  throw new EmptyObjectInitializationError(param);
};
