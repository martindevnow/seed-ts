import {
  IDataPointData,
  IDataPoint,
  makeDataPoint,
} from '../../models/data-point/data-point';
import {
  CoreRequest,
  RequestMethod,
} from '../core/types/core-request.interface';
import {
  CoreResponse,
  CoreResponseStatus,
} from '../core/types/core-response.interface';
import { Service } from '../../services/service.interface';
import { Models } from '../../models/models';
import { handleServiceError } from '../core/helpers/handle-error';
import { handleSuccess } from '../core/helpers/handle-success';
import { ZoneService } from '../../services/zone.service';
import { PlantService } from '../../services/plant.service';
import { DataPointService } from '../../services/data-point.service';
import { MethodNotSupportedError } from '../../helpers/errors';
import { EventEmitter } from 'events';
import { PlantEvents } from '../../models/plants/plant.events';

export const makeDataPointsEndpointHandler = ({
  dataPointService,
  zoneService,
  plantService,
  eventEmitter,
}: {
  zoneService: ZoneService;
  plantService: PlantService;
  dataPointService: DataPointService;
  eventEmitter: EventEmitter;
}) => {
  eventEmitter.on(PlantEvents.DESTROYED, (...args) => {
    console.log({ args });
    destroyDataPointsForPlant(args[0].plantId);
  });
  return async function handle(
    coreRequest: CoreRequest
  ): Promise<CoreResponse> {
    const { model, method } = coreRequest;
    if (model !== Models.DataPoint) {
      return Promise.reject(
        handleServiceError(
          new Error('DataPoint :: Are you sure you meant to do this?')
        )
      );
    }

    switch (coreRequest.method) {
      case RequestMethod.CREATE:
        return createDataPointEndpoint(coreRequest);
      case RequestMethod.READ:
        return readDataPointEndpoint(coreRequest);
      // case RequestMethod.UPDATE:
      //   return updateDataPoint(coreRequest);
      case RequestMethod.DESTROY:
        return destroyDataPointEndpoint(coreRequest);
      default:
        return Promise.reject(
          handleServiceError(new MethodNotSupportedError(method, model))
        );
    }
  };

  async function createDataPointEndpoint(coreRequest: CoreRequest) {
    try {
      const data = coreRequest.body;
      const { zoneId, plantId } = data;
      const dataPoint = makeDataPoint(data);

      // Ensure Related Zone/Plant exists
      zoneId ? await zoneService.findById(zoneId) : null;
      plantId ? await plantService.findById(plantId) : null;

      // Save DP
      const dp = await dataPointService.create(dataPoint);
      return handleSuccess(dp, CoreResponseStatus.CreatedSuccess);
    } catch (error) {
      return Promise.reject(handleServiceError(error));
    }
  }

  async function readDataPointEndpoint(coreRequest: CoreRequest) {
    try {
      const { zoneId, plantId } = coreRequest.params;
      if (!!zoneId && !!plantId) {
        return Promise.reject(
          handleServiceError(
            new Error('Cannot set both zoneId and plantId in Params')
          )
        );
      }
      const key = !!zoneId ? 'zoneId' : 'plantId';
      const val = !!zoneId ? zoneId : plantId;
      console.log({ key, val });
      const results = await dataPointService.findBy(key, val);
      return handleSuccess(results, CoreResponseStatus.ReadSuccess);
    } catch (error) {
      return Promise.reject(handleServiceError(error));
    }
  }

  async function destroyDataPointEndpoint(coreRequest: CoreRequest) {
    try {
      const { id } = coreRequest.params;
      await dataPointService.findById(id);
      await dataPointService.destroy(id);

      return handleSuccess(
        { success: true },
        CoreResponseStatus.DestroyedSuccess
      );
    } catch (error) {
      return Promise.reject(handleServiceError(error));
    }
  }

  /**
   * Internal Function to Destroy All Datapoints for a Plant
   * @param plantId
   */
  async function destroyDataPointsForPlant(plantId: string) {
    console.log(`destroying all datapoints for the plant with ID: ${plantId}`);
    try {
      const dataPoints = await dataPointService.findBy('plantId', plantId);
      console.log(dataPoints);
      const destroyStatements = dataPoints.map((dp) =>
        dataPointService.destroy(dp.id)
      );
      await Promise.all(destroyStatements);
      return handleSuccess(
        { success: true },
        CoreResponseStatus.DestroyedSuccess
      );
    } catch (error) {
      return Promise.reject(handleServiceError(error));
    }
  }
};
