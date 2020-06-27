import { IPlantData, makePlant, Plant } from '../../models/plants/plant';
import { MethodNotSupportedError } from '../../helpers/errors';
import { CoreRequest, RequestMethod } from '../core/types/request.interface';
import { CoreResponse } from '../core/types/response.interface';
import { handleServiceError } from '../core/helpers/handle-error';
import { handleSuccess } from '../core/helpers/handle-success';
import { Service } from '../../services/service.interface';
import { makeZoneService } from '../../services/zone.service';
import { IZoneData, Zone } from '../../models/zones/zone';

// TODO: Consider how to make this less HTTP dependant ...
// Make sure each layer of abstraction has a purpose
// Solidify the contracts. Less implicit any
export const makePlantsEndpointHandler = ({
  plantService,
  zoneService,
}: {
  plantService: Service<IPlantData, Plant>;
  zoneService: Service<IZoneData, Zone>;
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
      const plants = await plantService.getAll();
      return handleSuccess(plants);
    } catch (error) {
      return Promise.reject(handleServiceError(error));
    }
  }

  async function postPlant(coreRequest: CoreRequest) {
    try {
      const plant: Plant = makePlant(coreRequest.body as IPlantData);
      if (plant.zoneId) {
        await zoneService.findById(plant.zoneId);
      }
      const createdPlant = await plantService.create(plant);
      return handleSuccess(createdPlant);
    } catch (error) {
      return Promise.reject(handleServiceError(error));
    }
  }

  async function getPlant(id: string) {
    try {
      const plant: Plant = await plantService.findById(id);
      return handleSuccess(plant);
    } catch (error) {
      return Promise.reject(handleServiceError(error));
    }
  }

  async function updatePlant(id: string, coreRequest: CoreRequest) {
    try {
      const existingPlant: Plant = await plantService.findById(id);
      const updatedPlant = makePlant({
        ...existingPlant,
        ...coreRequest.body,
      });
      if (updatedPlant.zoneId) {
        await zoneService.findById(updatedPlant.zoneId);
      }
      const result = await plantService.update(updatedPlant);
      return handleSuccess(result);
    } catch (error) {
      return Promise.reject(handleServiceError(error));
    }
  }

  async function destroyPlant(id: string) {
    try {
      await plantService.findById(id);
      await plantService.destroy(id);
      return handleSuccess({ success: true }, 204);
    } catch (error) {
      return Promise.reject(handleServiceError(error));
    }
  }
};
