import requiredParam from '../../helpers/required-param';

export enum Unit {
  Feet = 'FEET',
  Meters = 'METERS',
}

export interface IZoneData {
  name: string;
  length: string;
  width: string;
  height: string;
  units: Unit;
}

export default function makeZone(zoneData: IZoneData) {
  if (!zoneData) {
    requiredParam('zoneData');
  }
  const validZone = validate(zoneData);
  const normalZone = normalize(validZone);
  return Object.freeze(normalZone);

  function validate(zoneData: IZoneData) {
    return zoneData;
  }

  function normalize(zoneData: IZoneData) {
    return zoneData;
  }
}
