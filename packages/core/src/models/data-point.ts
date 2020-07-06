import {
  InvalidPropertyError,
  RequiredParameterError,
  emptyObjectInitialization,
} from '../helpers/errors';

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

type DataPointProperty = keyof IDataPoint;

export const makeDataPoint = (
  dataPoint: IDataPoint = emptyObjectInitialization('dataPointData')
): IDataPoint => {
  const validDataPoint = validate(dataPoint);
  const normalDataPoint = normalize(validDataPoint);

  return Object.freeze(normalDataPoint);

  function validate(dataPoint: IDataPoint): IDataPoint {
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

  function normalize(dataPoint: IDataPoint): IDataPoint {
    const {
      id,
      type,
      timestamp,
      dataValue,
      dataUnit,
      plantId,
      zoneId,
    } = dataPoint;
    const onlyValidFields = {
      id,
      type,
      timestamp,
      dataValue,
      dataUnit,
      plantId,
      zoneId,
    };
    Object.keys(onlyValidFields).forEach((field: string) => {
      if (onlyValidFields[field as DataPointProperty] === undefined) {
        delete onlyValidFields[field as DataPointProperty];
      }
    });
    return onlyValidFields;
  }
};
