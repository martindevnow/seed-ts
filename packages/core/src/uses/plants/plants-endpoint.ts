import { APIRequest } from '../api/request.interface';
import makeHttpError from '../../helpers/http-error';

export default function makePlantsEndpointHandler({
  plantsService,
}: {
  plantsService: any;
}) {
  return async function handle(httpRequest: APIRequest) {
    switch (httpRequest.method) {
      case 'POST':
        return postPlant(httpRequest);
      case 'GET':
        return getPlants(httpRequest);
      default:
        return makeHttpError({
          statusCode: 405,
          errorMessage: `${httpRequest.method} method not allowed`,
        });
    }
  };

  async function getPlants(httpRequest: APIRequest) {
    const plants = await plantsService.getAll();
    console.log({ plants });
    return {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 200,
      data: [...plants],
    };
  }

  async function postPlant(httpRequest: APIRequest) {
    return {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 200,
      data: [{ id: 1, name: 'Plant' }],
    };
  }
}
