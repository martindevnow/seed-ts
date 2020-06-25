import { APIResponse } from '@mdn-seed/core';
import { HttpResponse } from '../api';

export const adaptResponse = (response: APIResponse): HttpResponse => {
  const { statusCode, data } = response;
  return {
    headers: {
      'Content-Type': 'application/json',
    },
    statusCode: statusCode,
    data: JSON.stringify(data),
  };
};
