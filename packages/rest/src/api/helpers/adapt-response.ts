import { CoreResponse } from '@mdn-seed/core';
import { HttpResponse } from '../../api/types/http-response.interface';
import { CoreRequest } from '@mdn-seed/core';

export const adaptResponse = (
  response: CoreResponse,
  request: CoreRequest
): HttpResponse => {
  const { statusCode, data } = response;
  return {
    headers: {
      'Content-Type': 'application/json',
    },
    statusCode: statusCode,
    data: JSON.stringify(data),
  };
};
