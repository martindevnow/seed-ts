import { makeHttpError } from './http-error';

export const handleError = (error: any) => {
  // TODO: Make error types an enum/type and use them for converting to HTTP,
  // Then, extract this to a middleware/helper function/service
  const { name, message } = error;
  console.log({ name, message });
  switch (name) {
    case 'RequiredParameterError':
      return makeHttpError({
        statusCode: 400,
        errorMessage: { name, message },
      });
    default:
      return makeHttpError({
        statusCode: 400,
        errorMessage: error,
      });
  }
};
