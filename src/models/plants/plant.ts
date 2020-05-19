export enum PlantStatus {
  Seed = 'SEED',
  Germinated = 'GERMINATED',
  Seeedling = 'SEEDLING',
  Clone = 'CLONE',
  Vegetative = 'VEGETATIVE',
  Mother = 'MOTHER',
  Flowering = 'FLOWERING',
  Flushing = 'FLUSHING',
  Drying = 'DRYING',
  Curing = 'CURING',
  Storage = 'STORAGE',
  Gone = 'GONE',
}

export interface IPlant {
  type: string;
  status: PlantStatus; // Current status of the plant
  strain?: string; // Specific strain of the plant
  name?: string; // The name given to this particular plant
  parent?: string; // UUID of parent IF is a clone
  zone?: string; // UUID of the zone
}

export class Plant implements IPlant {
  type: string;
  status: PlantStatus;
  strain?: string;
  name?: string;
  parent?: string;
  zone?: string;

  constructor(plantData: IPlant) {
    this.type = plantData.type;
    this.status = plantData.status;
    this.strain = plantData.strain || '';
    this.name = plantData.name || '';
    this.parent = plantData.parent || '';
    this.zone = plantData.zone || '';
  }
}

const mockPlant = new Plant({
  type: 'Tomato',
  status: PlantStatus.Seeedling,
  strain: 'Outdoor',
  name: 'Freebie',
  zone: 'OUTDOOR_UUID',
});

enum StatusUpdateType {}

enum PlantActionType {
  TakeClone = 'TAKE_CLONE',
  ChangeState = 'CHANGE_STATE',
}

class StatusUpdate {
  type?: StatusUpdateType;
}
