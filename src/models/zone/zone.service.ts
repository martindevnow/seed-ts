import { IZoneData } from './zone';
import { IDatabase } from '../../db';

export default function makeZoneService({ database }: { database: IDatabase }) {
  return Object.freeze({
    add,
    // findById,
    // getAll,
    // remove,
    // update,
  });

  async function add({ zoneId, ...zone }: { zoneId: string; zone: IZoneData }) {
    const db = await database;
    if (zoneId) {
      zone.id = zoneId;
    }
  }
}
