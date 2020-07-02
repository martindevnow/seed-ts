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
  readonly dataPoints: Array<any>;
}

export interface IZone extends IZoneData {
  id?: string;
}

export class Zone implements IZone {
  id: string;
  readonly name: string;
  readonly length?: string;
  readonly width?: string;
  readonly height?: string;
  readonly units?: Unit;
  readonly dataPoints: Array<any>;

  constructor(zoneData: IZone) {
    if (!zoneData) {
      throw new EmptyObjectInitializationError('Plant');
    }
    const validZone = this.validate(zoneData);
    const normalZone = this.normalize(validZone);

    const { id, name, length, width, height, units, dataPoints } = normalZone;

    this.id = id || '';
    this.name = name;

    if (length) this.length = length;
    if (width) this.width = width;
    if (height) this.height = height;
    if (units) this.units = units;

    this.dataPoints = dataPoints || [];
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
