import { Unit } from '../models/zone';
import { IPlantData, PlantStatus } from '../models/plant';
import { DataPointType, IDataPoint } from '../models/data-point';

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

export const MOCK_DATA_POINT: IDataPoint = {
  type: DataPointType.TEMPERATURE,
  timestamp: Date.now(),
  dataUnit: 'C',
  dataValue: 15,
};
