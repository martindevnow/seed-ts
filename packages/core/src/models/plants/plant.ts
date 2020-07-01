import {
  InvalidPropertyError,
  RequiredParameterError,
  EmptyObjectInitializationError,
} from '../../helpers/errors';

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
  zoneId?: string; // UUID of the zone
  dataPoints?: Array<any>;
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
  readonly zoneId?: string;
  readonly dataPoints?: Array<any>;

  constructor(plantData: IPlant) {
    console.log('constructor', { plantData });
    if (!plantData) {
      throw new EmptyObjectInitializationError('Plant');
    }
    const validPlant = this.validate(plantData);
    const normalPlant = this.normalize(validPlant);

    const {
      id,
      type,
      status,
      strain,
      name,
      parent,
      zoneId,
      dataPoints,
    } = normalPlant;
    console.log({ normalPlant });

    this.id = id || '';
    this.type = type;
    this.status = status;
    this.strain = strain || undefined;
    this.name = name || undefined;
    this.parent = parent || undefined;
    this.zoneId = zoneId || undefined;
    this.dataPoints = dataPoints || [];
  }

  private validate(plantData: IPlant): IPlant {
    if (!plantData.status) {
      console.error('ERROR no status :: ', { plantData });
      throw new RequiredParameterError('status');
    }
    if (!this.isStatusValid(plantData.status)) {
      console.error('ERROR invalid status :: ', { plantData });
      throw new InvalidPropertyError(
        `"${plantData.status}" is not a valid PlantStatus`
      );
    }
    return plantData;
  }

  private normalize(plantData: IPlant): IPlant {
    return plantData;
  }

  private isStatusValid(status: PlantStatus) {
    return !!Object.values(PlantStatus).includes(status);
  }
}

export const makePlant = (plantData: IPlantData): Plant => {
  return new Plant(plantData);
};

enum StatusUpdateType {}

enum PlantActionType {
  TakeClone = 'TAKE_CLONE',
  ChangeState = 'CHANGE_STATE',
}

class StatusUpdate {
  type?: StatusUpdateType;
}
