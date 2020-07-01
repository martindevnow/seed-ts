export const handleSuccess = (item: any, statusCode = 200) => {
  return {
    headers: {
      'Content-Type': 'application/json',
    },
    statusCode,
    data: item,
  };
};
