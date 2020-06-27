import { IPlantData, makePlant, IPlant } from '../../models/plants/plant';
import { MethodNotSupportedError } from '../../helpers/errors';
import { CoreRequest, RequestMethod } from '../core/types/request.interface';
import { CoreResponse } from '../core/types/response.interface';
import { handleServiceError } from '../core/helpers/handle-error';
import { handleSuccess } from '../core/helpers/handle-success';

// TODO: Consider how to make this less HTTP dependant ...
// Make sure each layer of abstraction has a purpose
// Solidify the contracts. Less implicit any
export const makePlantsEndpointHandler = ({
  plantsService,
}: {
  plantsService: any;
}) => {
  return async function handle(
    coreRequest: CoreRequest
  ): Promise<CoreResponse> {
    console.log('PlantsEndpoint.handle() :: ', { coreRequest });
    const {
      path,
      method,
      pathParams: { id },
    } = coreRequest;
    console.log({ id, path });
    switch (coreRequest.method) {
      case RequestMethod.POST:
        return postPlant(coreRequest);
      case RequestMethod.GET:
        return id ? getPlant(id) : getPlants();
      case RequestMethod.PATCH:
        return id
          ? updatePlant(id, coreRequest)
          : Promise.reject(
              handleServiceError(new MethodNotSupportedError(method, path))
            );
      case RequestMethod.DELETE:
        return id
          ? destroyPlant(id)
          : Promise.reject(
              handleServiceError(new MethodNotSupportedError(method, path))
            );
      default:
        return Promise.reject(
          handleServiceError(new MethodNotSupportedError(method, path))
        );
    }
  };

  async function getPlants() {
    try {
      const plants = await plantsService.getAll();
      return handleSuccess(plants);
    } catch (error) {
      return Promise.reject(handleServiceError(error));
    }
  }

  async function postPlant(coreRequest: CoreRequest) {
    try {
      const plantData = makePlant(coreRequest.body as IPlantData);
      const plant = await plantsService.create(plantData);
      return handleSuccess(plant);
    } catch (error) {
      return Promise.reject(handleServiceError(error));
    }
  }

  async function getPlant(id: string) {
    try {
      const plant = await plantsService.findById(id);
      return handleSuccess(plant);
    } catch (error) {
      return Promise.reject(handleServiceError(error));
    }
  }

  async function updatePlant(id: string, coreRequest: CoreRequest) {
    try {
      const existingPlant: IPlant = await plantsService.findById(id);
      const updatedPlant = makePlant({
        ...existingPlant,
        ...coreRequest.body,
      });
      const result = await plantsService.update(updatedPlant);
      return handleSuccess(result);
    } catch (error) {
      return Promise.reject(handleServiceError(error));
    }
  }

  async function destroyPlant(id: string) {
    try {
      await plantsService.findById(id);
      await plantsService.destroy(id);
      return handleSuccess({ success: true }, 204);
    } catch (error) {
      return Promise.reject(handleServiceError(error));
    }
  }
};
