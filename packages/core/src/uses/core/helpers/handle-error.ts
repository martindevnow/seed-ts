import { CoreErrorResponse } from '../types/core-error-response.interface';
import { ServiceError } from '../types/service-error.interface';

export const handleServiceError = (error: any): CoreErrorResponse => {
  // TODO: Make error types an enum/type and use them for converting to HTTP,
  // Then, extract this to a middleware/helper function/service
  const { name, message, stack, details } = error;
  console.log({ name, message, stack, details });
  switch (name) {
    case 'RequiredParameterError':
      return {
        errorCode: 400,
        error: { name, message },
      };
    case 'MethodNotSupportedError':
      return {
        errorCode: 405,
        error: { name, message },
      };
    case 'DocumentNotFoundError':
      return {
        errorCode: 404,
        error: { name, message },
      };
    case 'UniqueConstraintError':
      return {
        errorCode: 409,
        error: { name, message },
      };
    default:
      return {
        errorCode: 400,
        error,
      };
  }
};
export const serviceErrorFactory = (error: any): ServiceError => {
  const { code, name, message, stack } = error;
  console.log({ code, name, message, stack });
  return {
    code,
    name,
    message,
    details: stack,
  };
};
