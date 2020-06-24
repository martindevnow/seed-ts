export const handleSuccess = (item: any) => {
  return {
    headers: {
      'Content-Type': 'application/json',
    },
    statusCode: 200,
    data: item,
  };
};
