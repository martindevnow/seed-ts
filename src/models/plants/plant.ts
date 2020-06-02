export enum PlantStatus {
  Seed = 'SEED',
  Germinated = 'GERMINATED',
  Seedling = 'SEEDLING',
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

export interface IPlantData {
  type: string;
  status: PlantStatus; // Current status of the plant
  strain?: string; // Specific strain of the plant
  name?: string; // The name given to this particular plant
  parent?: string; // UUID of parent IF is a clone
  zone?: string; // UUID of the zone
}

export interface IPlant extends IPlantData {
  id?: string;
}

export class Plant implements IPlant {
  id: string;
  readonly type: string;
  readonly status: PlantStatus;
  readonly strain?: string;
  readonly name?: string;
  readonly parent?: string;
  readonly zone?: string;

  constructor(plantData: IPlant) {
    const validPlant = this.validate(plantData);
    const normalPlant = this.normalize(validPlant);

    const { id, type, status, strain, name, parent, zone } = normalPlant;
    this.id = id || '';
    this.type = type;
    this.status = status;
    this.strain = strain || '';
    this.name = name || '';
    this.parent = parent || '';
    this.zone = zone || '';
  }

  private validate(plantData: IPlant): IPlant {
    return plantData;
  }

  private normalize({ type, ...other }: IPlant): IPlant {
    return {
      type,
      ...other,
    };
  }
}

export default function makePlant(plantData: IPlantData): Plant {
  return new Plant(plantData);
}

enum StatusUpdateType {}

enum PlantActionType {
  TakeClone = 'TAKE_CLONE',
  ChangeState = 'CHANGE_STATE',
}

class StatusUpdate {
  type?: StatusUpdateType;
}
