import { APIRequest } from '../api/request.interface';
import makeHttpError from '../../helpers/http-error';

export const makePlantsEndpointHandler = ({
  plantsService,
}: {
  plantsService: any;
}) => {
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
    return {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 200,
      data: [...plants],
    };
  }

  async function postPlant(httpRequest: APIRequest) {
    console.log('PlantsEndpoint() :: ', { httpRequest });
    const plant = plantsService.create(httpRequest.body);
    return {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 200,
      data: [plant],
    };
  }
};
