import requiredParam from '../../helpers/required-param';
import sanitize from '../../helpers/sanitize';

export enum Unit {
  Feet = 'FEET',
  Meters = 'METERS',
}

export interface IZoneData {
  readonly name: string;
  readonly length: string;
  readonly width: string;
  readonly height: string;
  readonly units: Unit;
}

export interface IZone extends IZoneData {
  id?: string;
}

export class Zone implements IZone {
  readonly id?: string;
  readonly name: string;
  readonly length: string;
  readonly width: string;
  readonly height: string;
  readonly units: Unit;

  constructor(zoneData: IZone) {
    const validZone = this.validate(zoneData);
    const normalZone = this.normalize(validZone);

    const { id, name, length, width, height, units } = normalZone;
    this.id = id;
    this.name = name;
    this.length = length;
    this.width = width;
    this.height = height;
    this.units = units;
  }

  private validate(zoneData: IZone): IZone {
    // TODO :: Validate Dimensions...
    return zoneData;
  }

  private normalize({ name, ...other }: IZone): IZone {
    // TODO: perform some normalization on the data...
    return {
      name: sanitize(name),
      ...other,
    };
  }
}

export default function makeZone(zone: IZone) {
  if (!zone) {
    requiredParam('zone');
  }
  const validZone = validate(zone);
  const normalZone = normalize(validZone);
  return Object.freeze(normalZone);

  function validate(zone: IZone) {
    // TODO :: Validate Dimensions
    return zone;
  }

  function normalize({ name, ...other }: IZone) {
    return {
      name: sanitize(name),
      ...other,
    };
  }
}
