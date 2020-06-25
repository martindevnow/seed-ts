import { APIErrorResponse } from '@mdn-seed/core';
import { HttpResponse } from '../api';

export const adaptError = ({
  errorCode,
  error,
}: APIErrorResponse): HttpResponse => {
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
