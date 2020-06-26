import { CoreResponse } from '@mdn-seed/core';
import { HttpResponse } from '../api';

export const adaptResponse = (response: CoreResponse): HttpResponse => {
  const { statusCode, data } = response;
  return {
    headers: {
      'Content-Type': 'application/json',
    },
    statusCode: statusCode,
    data: JSON.stringify(data),
  };
};
