import { APIErrorResponse } from '@mdn-seed/core';
import { HttpResponse } from '../api';

export const adaptError = (errorResponse: APIErrorResponse): HttpResponse => {
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
