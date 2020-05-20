import makeZone, { IZoneData, IZone } from './zone';
import { IDatabase } from '../../db';

export default function makeZoneService({ database }: { database: IDatabase }) {
  return Object.freeze({
    add,
    // findById,
    // getAll,
    // remove,
    // update,
  });

  async function add(zone: IZone) {
    const db = await database.collection('zones');
    zone.id = db.getId();
    const result = await db.insert(zone);
    return result;
  }

  function documentToContact(zone: IZone): IZone {
    return makeZone(zone);
  }
}
