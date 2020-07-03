import { CoreResponseStatus } from '../types/core-response.interface';

export const handleSuccess = (
  item: any,
  statusCode: CoreResponseStatus = CoreResponseStatus.ReadSuccess
) => {
  return {
    headers: {
      'Content-Type': 'application/json',
    },
    statusCode,
    data: item,
  };
};
