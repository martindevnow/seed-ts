import makeInMemoryDb, { IDatabase } from '../../db';
import makeZoneService from './zone.service';
import { Unit, IZone, IZoneData, Zone } from './zone';

describe('Model: Zone', () => {
  let database: IDatabase;
  beforeEach(() => {
    database = makeInMemoryDb();
  });

  it('creates a zone', async () => {
    const zoneService = makeZoneService({ database });
    const mockZone = {
      name: 'Hoth',
      length: '4',
      width: '2',
      height: '5',
      units: Unit.Feet,
    };
    const actual: Zone = await zoneService.add(mockZone);
    console.log({ actual });
    expect(actual.id).not.toBeUndefined();
    expect(actual.id).toBeTruthy();
    const expected = await zoneService.findById(actual.id);
    console.log({ expected });
    expect(actual).toEqual(expected);
  });

  it('finds a zone by id', async () => {
    const zoneService = makeZoneService({ database });
    const mockZone = {
      name: 'Hoth',
      length: '4',
      width: '2',
      height: '5',
      units: Unit.Feet,
    };
    const mockZone2 = {
      name: 'New Hope',
      length: '4',
      width: '4',
      height: '6',
      units: Unit.Feet,
    };
    const { id: id1 }: Zone = await zoneService.add(mockZone);
    const { id: id2 }: Zone = await zoneService.add(mockZone2);

    const actual1 = await zoneService.findById(id1);
    const actual2 = await zoneService.findById(id2);
  });
});
