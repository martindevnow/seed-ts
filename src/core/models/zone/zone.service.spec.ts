import makeZoneService from './zone.service';
import { Unit, IZone, IZoneData, Zone } from './zone';
import { IDatabase } from '../../db/database.interface';
import makeInMemoryDb from '../../db/in-memory.database';
import { MOCK_ZONE } from '../../tests/helpers';

describe('Model: Zone', () => {
  let database: IDatabase;
  beforeEach(() => {
    database = makeInMemoryDb();
  });

  it('creates a zone', async () => {
    const zoneService = makeZoneService({ database });
    const actual: Zone = await zoneService.create(MOCK_ZONE);
    expect(actual.id).not.toBeUndefined();
    expect(actual.id).toBeTruthy();
    const expected = await zoneService.findById(actual.id);
    expect(actual).toEqual(expected);
  });

  it('finds a zone by id', async () => {
    const zoneService = makeZoneService({ database });
    const mockZone2 = {
      ...MOCK_ZONE,
      name: 'New Hope',
      width: '4',
      height: '6',
    };
    const { id: id1 }: Zone = await zoneService.create(MOCK_ZONE);
    const { id: id2 }: Zone = await zoneService.create(mockZone2);

    const actual1 = await zoneService.findById(id1);
    const actual2 = await zoneService.findById(id2);
  });

  it('updates a zone', async () => {
    const zoneService = makeZoneService({ database });
    const insertedZone = await zoneService.create(MOCK_ZONE);
    const updateData: Partial<IZone> = {
      id: insertedZone.id,
      name: 'Pandora',
    };
    const updated = await zoneService.update(updateData);
    expect(updated.name).toEqual('Pandora');
    expect(updated.length).toEqual('4');
  });

  it('destroys a zone', async () => {
    const zoneService = makeZoneService({ database });
    const actual = await zoneService.create(MOCK_ZONE);
    const expected = await zoneService.findById(actual.id);
    expect(actual).toEqual(expected);

    const result = await zoneService.destroy(actual.id);
    expect(result).toBe(true);
  });

  it('fetches all records of zones', async () => {
    const zoneService = makeZoneService({ database });
    const mockZone2 = {
      ...MOCK_ZONE,
      name: 'New Hope',
      width: '4',
      height: '6',
    };
    const { id: id1 }: Zone = await zoneService.create(MOCK_ZONE);
    const { id: id2 }: Zone = await zoneService.create(mockZone2);

    const actual = await zoneService.getAll();
    expect(actual.length).toBe(2);
    expect(actual[0]).toMatchObject({ id: id1 });
    expect(actual[1]).toMatchObject({ id: id2 });
  });
});
