import { IPlant } from '../models/plant';

export enum PlantEvents {
  DESTROYED = 'PLANT__DESTROYED',
  CREATED = 'PLANT__CREATED',
  UPDATED = 'PLANT__UPDATED',
  READ = 'PLANT__READ',
}

export const PlantCreatedEvent = (plant: IPlant) => ({
  type: PlantEvents.CREATED,
  payload: { plant },
});
export const PlantDestroyedEvent = (plantId: string) => ({
  type: PlantEvents.DESTROYED,
  payload: { plantId },
});
