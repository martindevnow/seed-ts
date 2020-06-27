import sanitize from '../../helpers/sanitize';
import {
  RequiredParameterError,
  EmptyObjectInitializationError,
} from '../../helpers/errors';

export enum Unit {
  Feet = 'FEET',
  Meters = 'METERS',
}

export interface IZoneData {
  readonly name: string;
  readonly length?: string;
  readonly width?: string;
  readonly height?: string;
  readonly units?: Unit;
}

export interface IZone extends IZoneData {
  id?: string;
}

export class Zone implements IZone {
  id: string;
  readonly name: string;
  readonly length: string;
  readonly width: string;
  readonly height: string;
  readonly units: Unit;

  constructor(zoneData: IZone) {
    if (!zoneData) {
      throw new EmptyObjectInitializationError('Plant');
    }
    const validZone = this.validate(zoneData);
    const normalZone = this.normalize(validZone);

    const { id, name, length, width, height, units } = normalZone;
    this.id = id || '';
    this.name = name;
    this.length = length || null;
    this.width = width || null;
    this.height = height || null;
    this.units = units || null;
  }

  private validate(zoneData: IZone): IZone {
    if (!zoneData.name) {
      console.error(`Error: "name" is missing from zoneData`);
      throw new RequiredParameterError('name');
    }
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

export const makeZone = (zoneData: IZoneData): Zone => {
  return new Zone(zoneData);
};
