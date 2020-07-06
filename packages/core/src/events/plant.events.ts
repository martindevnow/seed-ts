export enum PlantEvents {
  DESTROYED = 'PLANT__DESTROYED',
  CREATED = 'PLANT__CREATED',
  UPDATED = 'PLANT__UPDATED',
  READ = 'PLANT__READ',
}

export const PlantCreatedEvent = (plantId: string) => ({ plantId });
