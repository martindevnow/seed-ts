import { IPlant, makePlant } from '../../models/plant';
import { MethodNotSupportedError } from '../../helpers/errors';
import {
  CoreRequest,
  CoreRequestMethod,
} from '../core/types/core-request.interface';
import {
  CoreResponse,
  CoreResponseStatus,
} from '../core/types/core-response.interface';
import { handleServiceError } from '../core/helpers/handle-error';
import { handleSuccess } from '../core/helpers/handle-success';
import { Models } from '../../models/models';
import { PlantService } from '../../services/plant.service';
import { ZoneService } from '../../services/zone.service';
import { DataPointService } from '../../services/data-point.service';
import { PlantEvents, PlantDestroyedEvent } from '../../events/plant.events';
import { events } from '../../events/events';
import { DataPointEvents } from '../../events/data-points.event';

// TODO: Consider how to make this less HTTP dependant ...
// Make sure each layer of abstraction has a purpose
// Solidify the contracts. Less implicit any
export const makePlantsEndpointHandler = ({
  plantService,
  zoneService,
  dataPointService,
}: {
  plantService: PlantService;
  zoneService: ZoneService;
  dataPointService: DataPointService;
}) => {
  // TODO: Consider Observer method to register event listeners
  events.on(DataPointEvents.CREATED, (payload) => {
    if (payload?.dataPoint?.plantId) {
      attachDataPointToPlant(payload.dataPoint.plantId, payload.dataPoint);
    }
  });

  events.on(DataPointEvents.DESTROYED, (payload) => {
    if (payload?.dataPoint?.plantId) {
      removeDataPointFromPlant(payload.dataPoint.plantId, payload.dataPoint.id);
    }
  });
  return async function handle(
    coreRequest: CoreRequest
  ): Promise<CoreResponse> {
    console.log('PlantsEndpoint.handle() :: ', { coreRequest });
    const { model, method } = coreRequest;
    if (model !== Models.Plant) {
      return Promise.reject(
        handleServiceError(
          new Error('Plant :: Are you sure you meant to do this?')
        )
      );
    }

    switch (coreRequest.method) {
      case CoreRequestMethod.CREATE:
        return createPlant(coreRequest);
      case CoreRequestMethod.READ:
        return readPlant(coreRequest);
      case CoreRequestMethod.UPDATE:
        return updatePlant(coreRequest);
      case CoreRequestMethod.DESTROY:
        return destroyPlant(coreRequest);
      default:
        return Promise.reject(
          handleServiceError(new MethodNotSupportedError(method, model))
        );
    }
  };

  async function readPlant(coreRequest: CoreRequest) {
    try {
      const { id } = coreRequest.params;
      const result = id
        ? await plantService.findById(id)
        : await plantService.getAll();
      return handleSuccess(result, CoreResponseStatus.ReadSuccess);
    } catch (error) {
      return Promise.reject(handleServiceError(error));
    }
  }

  async function createPlant(coreRequest: CoreRequest) {
    try {
      const data = coreRequest.body;
      const plant = makePlant(data);
      if (plant.zoneId) {
        await zoneService.findById(plant.zoneId);
      }
      const createdPlant = await plantService.create(plant);
      return handleSuccess(createdPlant, CoreResponseStatus.CreatedSuccess);
    } catch (error) {
      return Promise.reject(handleServiceError(error));
    }
  }
  // This functionality was moved to the data-points-endpoint
  // async function postPlantDataPoint(plantId: string, coreRequest: CoreRequest) {
  //   try {
  //     const plant: IPlant = await plantService.findById(plantId);
  //     const dataPoint = makeDataPoint({
  //       ...coreRequest.body,
  //       plantId: plant.id,
  //     });
  //     const result = await dataPointService.create(dataPoint);
  //     // TODO: Enhance this function so that the Plant has an array of the latest DataPoints
  //     // It should store the latest for this Plant on the plant
  //     const plantsDataPoints = plant.dataPoints.filter((dp) => !!dp);
  //     plantsDataPoints.push(result.id);
  //     const newPlantData = {
  //       ...plant,
  //       dataPoints: plantsDataPoints,
  //     };
  //     const newPlant = makePlant(newPlantData);
  //     await plantService.update(newPlant);
  //     return handleSuccess(result, 201);
  //   } catch (error) {
  //     // TODO: If the plant doesn't exist, the dataPoint should be deleted...
  //     return Promise.reject(handleServiceError(error));
  //   }
  // }

  async function updatePlant(coreRequest: CoreRequest) {
    try {
      const { id } = coreRequest.params;
      const existingPlant: IPlant = await plantService.findById(id);
      const updatedPlant = makePlant({
        ...existingPlant,
        ...coreRequest.body,
      });
      if (updatedPlant.zoneId) {
        await zoneService.findById(updatedPlant.zoneId);
      }
      const result = await plantService.update(updatedPlant);
      return handleSuccess(result, CoreResponseStatus.UpdatedSuccess);
    } catch (error) {
      return Promise.reject(handleServiceError(error));
    }
  }

  async function destroyPlant(coreRequest: CoreRequest) {
    try {
      const { id } = coreRequest.params;
      await plantService.findById(id);
      await plantService.destroy(id);

      // TODO: Need to look into what pattern I want to establish here.
      // Maybe, we have PlantEvents and PlantActions
      // Actions are things triggered externally. (try to do something)
      // Events are triggered internally. (respond to something having been done)
      // Then, Actions, once validated that the requesting party has permmission, executes the action
      // That action, then optionally emits events that occurred during that action.
      // On the handler for those events, more events CAN be dispatched. This becomes kind of like redux effects.
      events.dispatch(PlantDestroyedEvent(id));

      return handleSuccess(
        { success: true },
        CoreResponseStatus.DestroyedSuccess
      );
    } catch (error) {
      return Promise.reject(handleServiceError(error));
    }
  }

  async function attachDataPointToPlant(plantId, dataPoint) {
    try {
      const plant = await plantService.findById(plantId);
      const newPlant = await plantService.addDataPoint(plant, dataPoint);
      return handleSuccess(newPlant, CoreResponseStatus.UpdatedSuccess);
    } catch (error) {
      return Promise.reject(handleServiceError(error));
    }
  }

  async function removeDataPointFromPlant(plantId, dataPointId) {
    try {
      const plant = await plantService.findById(plantId);
      const updatedPlant = await plantService.removeDataPoint(
        plant,
        dataPointId
      );
      return handleSuccess(updatedPlant, CoreResponseStatus.UpdatedSuccess);
    } catch (error) {
      return Promise.reject(handleServiceError(error));
    }
  }
};
