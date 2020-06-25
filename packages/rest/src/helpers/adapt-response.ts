import { APIResponse } from '@mdn-seed/core';
import { HttpResponse } from '../api';

export const adaptResponse = (response: APIResponse): HttpResponse => {
  return {
    headers: {
      'Content-Type': 'application/json',
    },
    statusCode: response.statusCode,
    data: JSON.stringify(response.data),
  };
};
