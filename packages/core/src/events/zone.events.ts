import { IZone } from '../models/zone';

export enum ZoneEvents {
  DESTROYED = 'ZONE__DESTROYED',
  CREATED = 'ZONE__CREATED',
  UPDATED = 'ZONE__UPDATED',
  READ = 'ZONE__READ',
}

export const ZoneCreatedEvent = (zone: IZone) => ({
  type: ZoneEvents.CREATED,
  payload: { zone },
});
export const ZoneDestroyedEvent = (zoneId: string) => ({
  type: ZoneEvents.DESTROYED,
  payload: { zoneId },
});
