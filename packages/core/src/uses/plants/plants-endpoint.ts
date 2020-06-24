import { APIRequest } from '../api/request.interface';
import { IPlantData, makePlant } from '../../models';
import { handleSuccess } from '../api';
import { handleError } from '../api/handle-error';
import { makeHttpError } from '../api/http-error';

// TODO: Consider how to make this less HTTP dependant ...
// Make sure each layer of abstraction has a purpose
// Solidify the contracts. Less implicit any
export const makePlantsEndpointHandler = ({
  plantsService,
}: {
  plantsService: any;
}) => {
  return async function handle(httpRequest: APIRequest) {
    console.log('PlantsEndpoint.handle() :: ', { httpRequest });
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
    return handleSuccess(plants);
  }

  async function postPlant(httpRequest: APIRequest) {
    console.log('PlantsEndpoint() :: ', { httpRequest });
    try {
      const plantData = makePlant(httpRequest.body as IPlantData);
      const plant = await plantsService.create(plantData);
      return handleSuccess(plant);
    } catch (error) {
      console.error('postPlant ERROR :: ', { error });
      // The Error code is undefined.. need a way to pass along a name up to service consumer
      // this way the service can translate it into a format that is useful for the person who called it.
      return handleError(error);
    }
  }
};
