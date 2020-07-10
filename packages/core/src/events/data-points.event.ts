import { IDataPoint } from '../models/data-point';

export enum DataPointEvents {
  DESTROYED = 'DATA-POINT__DESTROYED',
  CREATED = 'DATA-POINT__CREATED',
  UPDATED = 'DATA-POINT__UPDATED',
  READ = 'DATA-POINT__READ',
}

export const DataPointCreatedEvent = (dataPoint: IDataPoint) => ({
  type: DataPointEvents.CREATED,
  payload: { dataPoint },
});
export const DataPointDestroyedEvent = (dataPoint: IDataPoint) => ({
  type: DataPointEvents.DESTROYED,
  payload: { dataPoint },
});
