import requiredParam from '../../helpers/required-param';
import sanitize from '../../helpers/sanitize';

export enum Unit {
  Feet = 'FEET',
  Meters = 'METERS',
}

export interface IZoneData {
  id?: string;
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
    // ToDo :: Validate Dimensions
    return zoneData;
  }

  function normalize({ name, ...other }: IZoneData) {
    return {
      name: sanitize(name),
      ...other,
    };
  }
}
