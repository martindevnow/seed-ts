import { APIResponse, APIRequest, RequestMethod } from '../api/types';
import { IPlantData, makePlant } from '../../models';
import { handleError, handleSuccess } from '../api';
import { MethodNotSupported } from '../../helpers/errors';

// TODO: Consider how to make this less HTTP dependant ...
// Make sure each layer of abstraction has a purpose
// Solidify the contracts. Less implicit any
export const makePlantsEndpointHandler = ({
  plantsService,
}: {
  plantsService: any;
}) => {
  return async function handle(httpRequest: APIRequest): Promise<APIResponse> {
    console.log('PlantsEndpoint.handle() :: ', { httpRequest });
    const {
      path,
      method,
      pathParams: { id },
    } = httpRequest;
    console.log({ id, path });
    switch (httpRequest.method) {
      case RequestMethod.POST:
        return postPlant(httpRequest);
      case RequestMethod.GET:
        return id ? getPlant(id) : getPlants();
      default:
        return Promise.reject(
          handleError(new MethodNotSupported(method, path))
        );
    }
  };

  async function getPlants() {
    try {
      const plants = await plantsService.getAll();
      return handleSuccess(plants);
    } catch (error) {
      console.error('getPlant ERROR :: ', { error });
      return Promise.reject(handleError(error));
    }
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
      return Promise.reject(handleError(error));
    }
  }

  async function getPlant(id: string) {
    try {
      const plant = await plantsService.findById(id);
      return handleSuccess(plant);
    } catch (error) {
      return Promise.reject(handleError(error));
    }
  }
};
