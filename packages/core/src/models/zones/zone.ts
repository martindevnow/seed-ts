import sanitize from '../../helpers/sanitize';
import {
  RequiredParameterError,
  EmptyObjectInitializationError,
  InvalidPropertyError,
  emptyObjectInitialization,
} from '../../helpers/errors';

export enum Unit {
  Feet = 'FEET',
  Meters = 'METERS',
}

export interface IZoneData {
  name: string;
  parent?: string;
  length?: string;
  width?: string;
  height?: string;
  units?: Unit;
  dataPoints: Array<any>;
}

export interface IZone extends IZoneData {
  id?: string;
}

type ZoneProperty = keyof IZone;

export const makeZone = (
  zoneData: IZoneData = emptyObjectInitialization('zoneData')
): Readonly<IZone> => {
  const validZone = validate(zoneData);
  const normalZone = normalize(validZone);

  return Object.freeze(normalZone);

  function validate(zoneData: IZone): IZone {
    if (!zoneData.name) {
      console.error(`Error: "name" is missing from zoneData`);
      throw new RequiredParameterError('name');
    }
    if (zoneData.units && !isUnitsValid(zoneData.units)) {
      throw new InvalidPropertyError('units');
    }
    return zoneData;
  }

  function normalize(zoneData: IZone): IZone {
    const {
      id,
      name,
      length,
      width,
      height,
      units,
      parent,
      dataPoints = [],
    } = zoneData;
    const onlyValidFields = {
      id,
      name: sanitize(name),
      length,
      width,
      height,
      units,
      parent,
      dataPoints,
    };

    Object.keys(onlyValidFields).forEach((field: string) => {
      if (onlyValidFields[field as ZoneProperty] === undefined) {
        delete onlyValidFields[field as ZoneProperty];
      }
    });
    return onlyValidFields;
  }

  function isUnitsValid(units: Unit) {
    return !!Object.values(Unit).includes(units);
  }
};
