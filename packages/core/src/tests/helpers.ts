import { Unit } from '../models/zones/zone';
import { IPlantData, Plant, PlantStatus } from '../models/plants/plant';

export const MOCK_ZONE = {
  name: 'Hoth',
  length: '4',
  width: '2',
  height: '5',
  units: Unit.Feet,
  dataPoints: [],
};

export const MOCK_PLANT: IPlantData = {
  type: 'MOCK_PLANT_TYPE',
  name: 'MOCK_PLANT_NAME',
  status: PlantStatus.Clone,
  strain: 'MOCK_PLANT_STRAIN',
  dataPoints: [],
};

export const MOCK_PLANT_2: IPlantData = {
  type: 'Tomato',
  status: PlantStatus.Seedling,
  strain: 'Outdoor',
  name: 'Freebie',
  dataPoints: [],
};
