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

export const makeDataPointsEndpointHandler = ({
  dataPointService,
  zoneService,
  plantService,
}: {
  zoneService: ZoneService;
  plantService: PlantService;
  dataPointService: DataPointService;
}) => {
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
        return createDataPoint(coreRequest);
      case RequestMethod.READ:
        return readDataPoint(coreRequest);
      // case RequestMethod.UPDATE:
      //   return updateDataPoint(coreRequest);
      // case RequestMethod.DESTROY:
      //   return destroyDataPoint(coreRequest);
      default:
        return Promise.reject(
          handleServiceError(new MethodNotSupportedError(method, model))
        );
    }
  };

  async function createDataPoint(coreRequest: CoreRequest) {
    try {
      const data = coreRequest.body;
      const { zoneId, plantId } = data;
      const dataPoint = makeDataPoint(data);
      const zone = zoneId ? await zoneService.findById(zoneId) : null;
      const plant = plantId ? await plantService.findById(plantId) : null;
      const dp = await dataPointService.create(dataPoint);
      return handleSuccess(dp, CoreResponseStatus.CreatedSuccess);
    } catch (error) {
      return Promise.reject(handleServiceError(error));
    }
  }

  async function readDataPoint(coreRequest: CoreRequest) {
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
      const results = await dataPointService.findBy(key, val);
      return handleSuccess(results, CoreResponseStatus.ReadSuccess);
    } catch (error) {
      return Promise.reject(handleServiceError(error));
    }
  }
};
