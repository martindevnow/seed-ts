import {
  EmptyObjectInitializationError,
  InvalidPropertyError,
  RequiredParameterError,
} from '../../helpers/errors';

export enum DataPointType {
  TEMPERATURE = 'TEMPERATURE',
  MOISTURE = 'MOISTURE',
  LIGHT_INTENSITY = 'LIGHT_INTENSITY',
  RELATIVE_HUMIDITY = 'RELATIVE_HUMIDITY',
  PH_CONCENTRATION = 'PH_CONCENTRATION',
  PPM_LEVEL = 'PPM_LEVEL',
  HEIGHT = 'HEIGHT',
}

export interface IDataPointData {
  type: DataPointType;
  timestamp: any; // TODO: Get a better type for tracking time/date
  dataValue: any;
  dataUnit: any; // TODO: Better type here required
  plantId?: string;
  zoneId?: string;
}

export interface IDataPoint extends IDataPointData {
  id?: string;
}

export class DataPoint implements IDataPoint {
  id: string;
  readonly type: DataPointType;
  readonly timestamp: any;
  readonly dataValue: any;
  readonly dataUnit: string; // TODO: Add a type here??
  readonly plantId?: string;
  readonly zoneId?: string;

  constructor(dataPoint: IDataPoint) {
    if (!dataPoint) {
      throw new EmptyObjectInitializationError('DataPoint');
    }

    const validDataPoint = this.validate(dataPoint);
    const normalDataPoint = this.normalize(validDataPoint);

    const {
      id,
      type,
      timestamp,
      dataValue,
      dataUnit,
      plantId,
      zoneId,
    } = normalDataPoint;
    this.id = id || '';
    this.type = type;
    this.timestamp = timestamp;
    this.dataValue = dataValue;
    this.dataUnit = dataUnit;

    if (plantId) this.plantId = plantId;
    if (zoneId) this.zoneId = zoneId;
  }

  private validate(dataPoint: IDataPoint): IDataPoint {
    if (!Object.values(DataPointType).includes(dataPoint.type)) {
      throw new InvalidPropertyError(
        `${dataPoint.type} is an invalid DataPoint type`
      );
    }
    if (dataPoint.dataValue === null || dataPoint.dataValue === undefined) {
      throw new RequiredParameterError('dataValue');
    }
    if (dataPoint.dataUnit === null || dataPoint.dataUnit === undefined) {
      throw new RequiredParameterError('dataUnit');
    }
    if (dataPoint.timestamp === null || dataPoint.timestamp === undefined) {
      throw new RequiredParameterError('timestamp');
    }

    return dataPoint;
  }

  private normalize(dataPoint: IDataPoint): IDataPoint {
    return dataPoint;
  }
}

export const makeDataPoint = (dataPointData: IDataPointData): DataPoint => {
  return new DataPoint(dataPointData);
};
