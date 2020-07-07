import { makeZoneService } from '../zone.service';
import { Unit, IZone, IZoneData } from '../../models/zone';
import { IDatabase, makeInMemoryDb } from '@mdn-seed/db';
import { MOCK_ZONE, MOCK_DATA_POINT } from '../../tests/helpers';
import { makeDataPoint } from '../../models/data-point';

describe('Service: Zone', () => {
  let database: IDatabase;
  beforeEach(() => {
    database = makeInMemoryDb();
  });

  it('creates a zone', async () => {
    const zoneService = makeZoneService({ database });
    const actual: IZone = await zoneService.create(MOCK_ZONE);
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
    const { id: id1 }: IZone = await zoneService.create(MOCK_ZONE);
    const { id: id2 }: IZone = await zoneService.create(mockZone2);

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
    const { id: id1 }: IZone = await zoneService.create(MOCK_ZONE);
    const { id: id2 }: IZone = await zoneService.create(mockZone2);

    const actual = await zoneService.getAll();
    expect(actual.length).toBe(2);
    expect(actual[0]).toMatchObject({ id: id1 });
    expect(actual[1]).toMatchObject({ id: id2 });
  });

  describe('addDataPointToZone', () => {
    it('adds a data-point that the zone did not have previously', async () => {
      const zoneService = makeZoneService({ database });
      const zone = await zoneService.create(MOCK_ZONE);
      expect(zone.dataPoints.length).toBe(0);
      const dataPoint = makeDataPoint({
        ...MOCK_DATA_POINT,
        zoneId: zone.id,
      });
      const updatedZone = await zoneService.addDataPoint(zone, dataPoint);
      expect(updatedZone.dataPoints.length).toBe(1);
    });

    it('replaces a data-point of the same type', async () => {
      const zoneService = makeZoneService({ database });
      const zone = await zoneService.create(MOCK_ZONE);
      expect(zone.dataPoints.length).toBe(0);
      const dataPoint = makeDataPoint({
        ...MOCK_DATA_POINT,
        zoneId: zone.id,
      });
      await zoneService.addDataPoint(zone, dataPoint);
      const updatedZone = await zoneService.addDataPoint(zone, dataPoint);
      expect(updatedZone.dataPoints.length).toBe(1);
    });

    it('only replaces a data-point of the same type if the new one is more recent (timestamp)', async () => {
      const zoneService = makeZoneService({ database });
      const zone = await zoneService.create(MOCK_ZONE);
      expect(zone.dataPoints.length).toBe(0);
      const dataPoint = makeDataPoint({
        ...MOCK_DATA_POINT,
        timestamp: 10,
        zoneId: zone.id,
      });

      const dataPoint2 = makeDataPoint({
        ...MOCK_DATA_POINT,
        timestamp: 20,
        zoneId: zone.id,
      });

      const dataPoint3 = makeDataPoint({
        ...MOCK_DATA_POINT,
        timestamp: 1,
        zoneId: zone.id,
      });
      await zoneService.addDataPoint(zone, dataPoint);
      await zoneService.addDataPoint(zone, dataPoint2);
      await zoneService.addDataPoint(zone, dataPoint3);
      const updatedZone = await zoneService.addDataPoint(zone, dataPoint2);
      expect(updatedZone.dataPoints.length).toBe(1);
      expect(updatedZone.dataPoints[0]).toEqual(dataPoint2);
    });
  });
});
