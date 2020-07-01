import { CoreResponse } from '@mdn-seed/core/src/uses/core/types/response.interface';
import { HttpResponse } from '../../api/types/http-response.interface';

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
