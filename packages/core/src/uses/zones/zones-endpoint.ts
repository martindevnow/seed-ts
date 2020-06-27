import { IZoneData, makeZone, IZone } from '../../models/zones/zone';
import { MethodNotSupportedError } from '../../helpers/errors';
import { CoreRequest, RequestMethod } from '../core/types/request.interface';
import { CoreResponse } from '../core/types/response.interface';
import { handleServiceError } from '../core/helpers/handle-error';
import { handleSuccess } from '../core/helpers/handle-success';

// TODO: Consider how to make this less HTTP dependant ...
// Make sure each layer of abstraction has a purpose
// Solidify the contracts. Less implicit any
export const makeZonesEndpointHandler = ({
  zoneService,
}: {
  zoneService: any;
}) => {
  return async function handle(
    coreRequest: CoreRequest
  ): Promise<CoreResponse> {
    console.log('ZonesEndpoint.handle() :: ', { coreRequest });
    const {
      path,
      method,
      pathParams: { id },
    } = coreRequest;
    console.log({ id, path });
    switch (coreRequest.method) {
      case RequestMethod.POST:
        return postZone(coreRequest);
      case RequestMethod.GET:
        return id ? getZone(id) : getZones();
      case RequestMethod.PATCH:
        return id
          ? updateZone(id, coreRequest)
          : Promise.reject(
              handleServiceError(new MethodNotSupportedError(method, path))
            );
      case RequestMethod.DELETE:
        return id
          ? destroyZone(id)
          : Promise.reject(
              handleServiceError(new MethodNotSupportedError(method, path))
            );
      default:
        return Promise.reject(
          handleServiceError(new MethodNotSupportedError(method, path))
        );
    }
  };

  async function getZones() {
    try {
      const zones = await zoneService.getAll();
      return handleSuccess(zones);
    } catch (error) {
      return Promise.reject(handleServiceError(error));
    }
  }

  async function postZone(coreRequest: CoreRequest) {
    try {
      const zoneData = makeZone(coreRequest.body as IZoneData);
      const zone = await zoneService.create(zoneData);
      return handleSuccess(zone);
    } catch (error) {
      return Promise.reject(handleServiceError(error));
    }
  }

  async function getZone(id: string) {
    try {
      const zone = await zoneService.findById(id);
      return handleSuccess(zone);
    } catch (error) {
      return Promise.reject(handleServiceError(error));
    }
  }

  async function updateZone(id: string, coreRequest: CoreRequest) {
    try {
      const existingZone: IZone = await zoneService.findById(id);
      const updatedZone = makeZone({
        ...existingZone,
        ...coreRequest.body,
      });
      const result = await zoneService.update(updatedZone);
      return handleSuccess(result);
    } catch (error) {
      return Promise.reject(handleServiceError(error));
    }
  }

  async function destroyZone(id: string) {
    try {
      await zoneService.findById(id);
      await zoneService.destroy(id);
      return handleSuccess({ success: true }, 204);
    } catch (error) {
      return Promise.reject(handleServiceError(error));
    }
  }
};
