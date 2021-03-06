import { IZoneData, makeZone, IZone } from '../../models/zone';
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
import { ZoneService } from '../../services/zone.service';
import { PlantService } from '../../services/plant.service';
import { DataPointService } from '../../services/data-point.service';
import { events } from '../../events/events';
import { ZoneEvents, ZoneDestroyedEvent } from '../../events/zone.events';
import { DataPointEvents } from '../../events/data-points.event';

// TODO: Consider how to make this less HTTP dependant ...
// Make sure each layer of abstraction has a purpose
// Solidify the contracts. Less implicit any
export const makeZonesEndpointHandler = ({
  zoneService,
  plantService,
  dataPointService,
}: {
  zoneService: ZoneService;
  plantService: PlantService;
  dataPointService: DataPointService;
}) => {
  // TODO: Consider Observer method to register event listeners
  events.on(DataPointEvents.CREATED, (payload) => {
    if (payload?.dataPoint?.zoneId) {
      attachDataPointToZone(payload.dataPoint.zoneId, payload.dataPoint);
    }
  });

  events.on(DataPointEvents.DESTROYED, (payload) => {
    if (payload?.dataPoint?.zoneId) {
      removeDataPointFromZone(payload.dataPoint.zoneId, payload.dataPoint.id);
    }
  });

  return async function handle(
    coreRequest: CoreRequest
  ): Promise<CoreResponse> {
    const { model, method } = coreRequest;
    if (model !== Models.Zone) {
      return Promise.reject(
        handleServiceError(
          new Error('Zone :: Are you sure you meant to do this?')
        )
      );
    }

    // TODO: Make a helper function for this that will sanitize
    // and parse the path into something useful
    switch (coreRequest.method) {
      case CoreRequestMethod.CREATE:
        return createZone(coreRequest);
      case CoreRequestMethod.READ:
        return readZone(coreRequest);
      case CoreRequestMethod.UPDATE:
        return updateZone(coreRequest);
      case CoreRequestMethod.DESTROY:
        return destroyZone(coreRequest);
      default:
        return Promise.reject(
          handleServiceError(new MethodNotSupportedError(method, model))
        );
    }
  };

  async function readZone(coreRequest: CoreRequest) {
    try {
      const { id } = coreRequest.params;
      const result = id
        ? await zoneService.findById(id)
        : await zoneService.getAll();
      return handleSuccess(result, CoreResponseStatus.ReadSuccess);
    } catch (error) {
      return Promise.reject(handleServiceError(error));
    }
  }

  async function createZone(coreRequest: CoreRequest) {
    try {
      const zoneData = makeZone(coreRequest.body as IZoneData);
      const zone = await zoneService.create(zoneData);
      return handleSuccess(zone, CoreResponseStatus.CreatedSuccess);
    } catch (error) {
      return Promise.reject(handleServiceError(error));
    }
  }

  async function updateZone(coreRequest: CoreRequest) {
    try {
      const { id } = coreRequest.params;
      const existingZone: IZone = await zoneService.findById(id);
      const updatedZone = makeZone({
        ...existingZone,
        ...coreRequest.body,
      });
      const result = await zoneService.update(updatedZone);
      return handleSuccess(result, CoreResponseStatus.UpdatedSuccess);
    } catch (error) {
      return Promise.reject(handleServiceError(error));
    }
  }

  async function destroyZone(coreRequest: CoreRequest) {
    try {
      const { id } = coreRequest.params;
      await zoneService.findById(id);
      await zoneService.destroy(id);
      events.dispatch(ZoneDestroyedEvent(id));
      return handleSuccess(
        { success: true },
        CoreResponseStatus.DestroyedSuccess
      );
    } catch (error) {
      return Promise.reject(handleServiceError(error));
    }
  }

  async function attachDataPointToZone(zoneId, dataPoint) {
    try {
      const zone = await zoneService.findById(zoneId);
      const newZone = await zoneService.addDataPoint(zone, dataPoint);
      return handleSuccess(newZone, CoreResponseStatus.UpdatedSuccess);
    } catch (error) {
      return Promise.reject(handleServiceError(error));
    }
  }

  async function removeDataPointFromZone(zoneId, dataPointId) {
    try {
      const zone = await zoneService.findById(zoneId);
      const updatedZone = await zoneService.removeDataPoint(zone, dataPointId);
      return handleSuccess(updatedZone, CoreResponseStatus.UpdatedSuccess);
    } catch (error) {
      return Promise.reject(handleServiceError(error));
    }
  }
};
