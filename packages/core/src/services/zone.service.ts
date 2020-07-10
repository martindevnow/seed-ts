import { IDatabase } from '@mdn-seed/db';
import { serviceErrorFactory } from '../uses/core/helpers/handle-error';
import { IZoneData, makeZone, IZone } from '../models/zone';
import { Service, HasDataPoints } from './service.interface';
import { IDataPoint } from '../models/data-point';

export type ZoneService = Service<IZoneData, IZone> & HasDataPoints<IZone>;

export const makeZoneService = ({
  database,
}: {
  database: IDatabase;
}): ZoneService => {
  return Object.freeze({
    create,
    update,
    getAll,
    findById,
    findBy,
    destroy,
    addDataPoint,
    removeDataPoint,
  });

  async function create(zoneData: IZoneData): Promise<IZone> {
    try {
      const zone: IZoneData = makeZone(zoneData);
      await database.collection('zones');
      const result: IZone = await database.insert(zone);
      return documentToObj(result);
    } catch (e) {
      return Promise.reject(serviceErrorFactory(e));
    }
  }

  async function getAll(): Promise<IZone[]> {
    await database.collection('zones');
    const results = await database.list();
    return results.map(documentToObj);
  }

  async function update(
    zoneData: Partial<IZone>,
    options = { merge: true }
  ): Promise<IZone> {
    const { merge } = options;
    await database.collection('zones');
    const current = await database.findById(zoneData.id);
    const newZone = makeZone({ ...current, ...zoneData });
    const result = await database.update(newZone, { merge });
    return documentToObj(result);
  }

  async function findById(id?: string): Promise<IZone> {
    await database.collection('zones');
    const zoneData = await database.findById(id);
    return documentToObj(zoneData);
  }

  async function destroy(id?: string): Promise<boolean> {
    await database.collection('zones');
    const zone = await database.destroy(id);
    return !!zone;
  }

  async function findBy(property: string, value: any): Promise<Array<IZone>> {
    await database.collection('zones');
    const results = await database.where(property, '==', value);
    return results.map(documentToObj);
  }

  async function addDataPoint(zone: IZone, dataPoint: IDataPoint) {
    const existingIndex = zone.dataPoints.findIndex(
      (dp) => dp.type === dataPoint.type
    );
    const newZone = makeZone({
      ...zone,
      dataPoints:
        existingIndex === -1
          ? [...zone.dataPoints, dataPoint]
          : zone.dataPoints.map((dp) =>
              dp.type !== dataPoint.type && dp.timestamp > dataPoint.timestamp
                ? dp
                : dataPoint
            ),
    });
    console.log({ newZone });
    const result = await database.update(newZone, { merge: false });
    return documentToObj(result);
  }

  async function removeDataPoint(zone: IZone, dataPointId: string) {
    const newZone = makeZone({
      ...zone,
      dataPoints: [...zone.dataPoints.filter((dp) => dp.id !== dataPointId)],
    });
    if (newZone.dataPoints.length < zone.dataPoints.length) {
      const result = await database.update(newZone, { merge: false });
      return documentToObj(result);
    }
    return zone;
  }

  function documentToObj(zone: IZoneData): IZone {
    return makeZone(zone);
  }
};
