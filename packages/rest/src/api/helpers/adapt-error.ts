import { CoreErrorResponse } from '@mdn-seed/core';
import { HttpResponse } from '../../api/types/http-response.interface';

export const adaptError = (errorResponse: CoreErrorResponse): HttpResponse => {
  const { error, errorCode } = errorResponse;
  return {
    headers: {
      'Content-Type': 'application/json',
    },
    statusCode: errorCode,
    data: JSON.stringify({
      success: false,
      error: {
        ...error,
        message: error.message,
      },
    }),
  };
};
