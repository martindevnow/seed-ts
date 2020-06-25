import { APIErrorResponse } from './types/error-response.interface';

export const handleError = (error: any): APIErrorResponse => {
  // TODO: Make error types an enum/type and use them for converting to HTTP,
  // Then, extract this to a middleware/helper function/service
  const { name, message } = error;
  console.log({ name, message });
  switch (name) {
    case 'RequiredParameterError':
      return {
        errorCode: 400,
        error: { name, message },
      };
    case 'MethodNotSupported':
      return {
        errorCode: 405,
        error: { name, message },
      };
    case 'DocumentNotFound':
      return {
        errorCode: 404,
        error: { name, message },
      };
    default:
      return {
        errorCode: 400,
        error,
      };
  }
};
