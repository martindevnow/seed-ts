import { IDatabase } from '@mdn-seed/db';
import { serviceErrorFactory } from '../uses/core/helpers/handle-error';
import { IZoneData, makeZone, IZone } from '../models/zones/zone';
import { Service } from './service.interface';
import { RequiredParameterError } from '../helpers/errors';

export const makeZoneService = ({
  database,
}: {
  database: IDatabase;
}): Service<IZoneData, IZone> => {
  return Object.freeze({
    create,
    update,
    getAll,
    findById,
    findBy,
    destroy,
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

  async function update(zoneData: Partial<IZone>): Promise<IZone> {
    await database.collection('zones');
    const current = await database.findById(zoneData.id);
    const newZone = makeZone({ ...current, ...zoneData });
    const result = await database.update(newZone);
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

  function documentToObj(zone: IZoneData): IZone {
    return makeZone(zone);
  }
};
