import { IDatabase } from '@mdn-seed/db';
import { serviceErrorFactory } from '../uses/core/helpers/handle-error';
import { IZoneData, makeZone, IZone, Zone } from '../models/zones/zone';
import { Service } from './service.interface';

export const makeZoneService = ({
  database,
}: {
  database: IDatabase;
}): Service<IZoneData, Zone> => {
  return Object.freeze({
    create,
    update,
    getAll,
    findById,
    destroy,
  });

  async function create(zoneData: IZoneData): Promise<Zone> {
    // console.log('ZoneService.create() :: ', { zoneData });
    try {
      const zone: IZoneData = makeZone(zoneData);
      await database.collection('zones');
      const result: IZone = await database.insert(zone);
      return documentToObj(result);
    } catch (e) {
      return Promise.reject(serviceErrorFactory(e));
    }
  }

  async function getAll(): Promise<Zone[]> {
    await database.collection('zones');
    const results = await database.list();
    return results.map((item: IZoneData) => documentToObj(item));
  }

  async function update(zoneData: IZone): Promise<Zone> {
    await database.collection('zones');
    const current = await database.findById(zoneData.id);
    const newZone = makeZone({ ...current, ...zoneData });
    const result = await database.update(newZone);
    return documentToObj(result);
  }

  async function findById(id: string): Promise<Zone> {
    await database.collection('zones');
    const zoneData = await database.findById(id);
    return documentToObj(zoneData);
  }

  async function destroy(id: string): Promise<boolean> {
    await database.collection('zones');
    const zone = await database.destroy(id);
    return !!zone;
  }

  function documentToObj(zone: IZoneData): Zone {
    return makeZone(zone);
  }
};
