import {
  InvalidPropertyError,
  RequiredParameterError,
  emptyObjectInitialization,
} from '../helpers/errors';

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
  dataPoints: Array<any>;
}

export interface IPlant extends IPlantData {
  id?: string;
}

type PlantProperty = keyof IPlant;

export const makePlant = (
  plantData: IPlant = emptyObjectInitialization('plantData')
): Readonly<IPlant> => {
  const validPlant = validate(plantData);
  const normalPlant = normalize(validPlant);

  return Object.freeze(normalPlant);

  function validate(plantData: IPlant): IPlant {
    if (!plantData.status) {
      console.error('ERROR no status :: ', { plantData });
      throw new RequiredParameterError('status');
    }
    if (!isStatusValid(plantData.status)) {
      console.error('ERROR invalid status :: ', { plantData });
      throw new InvalidPropertyError(
        `"${plantData.status}" is not a valid PlantStatus`
      );
    }
    return plantData;
  }

  function normalize(plantData: IPlant): IPlant {
    const {
      id,
      type,
      status,
      strain,
      name,
      parent,
      zoneId,
      dataPoints = [],
    } = plantData;
    const onlyValidFields = {
      id,
      type,
      status,
      strain,
      name,
      parent,
      zoneId,
      dataPoints,
    };

    Object.keys(onlyValidFields).forEach((field: string) => {
      if (onlyValidFields[field as PlantProperty] === undefined) {
        delete onlyValidFields[field as PlantProperty];
      }
    });
    return onlyValidFields;
  }

  function isStatusValid(status: PlantStatus) {
    return !!Object.values(PlantStatus).includes(status);
  }
};

enum StatusUpdateType {}

enum PlantActionType {
  TakeClone = 'TAKE_CLONE',
  ChangeState = 'CHANGE_STATE',
}

class StatusUpdate {
  type?: StatusUpdateType;
}
