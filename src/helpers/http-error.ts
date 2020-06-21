export default function makeHttpError({
  statusCode,
  errorMessage,
}: {
  statusCode: number;
  errorMessage: any;
}) {
  return {
    headers: {
      'Content-Type': 'application/json',
    },
    statusCode,
    data: JSON.stringify({
      success: false,
      error: errorMessage,
    }),
  };
}
