import makeZone, { IZoneData, IZone, Zone } from './zone';
import { IDatabase } from '../../db/database.interface';

export default function makeZoneService({ database }: { database: IDatabase }) {
  return Object.freeze({
    add,
    findById,
    // getAll,
    // remove,
    update,
  });

  // TODO: Add a specific interface for a returned insert
  async function add(zoneData: IZoneData): Promise<Zone> {
    // Make the Zone from the data provided, this will catch errors in the Object shape
    const zone: IZoneData = makeZone(zoneData);
    // set the table for this transactions
    const db = await database.collection('zones');
    // insert a new record to the DB
    const result: IZone = await db.insert(zone);
    return documentToZone(result);
  }

  async function findById(id: string): Promise<IZoneData> {
    const db = await database.collection('zones');
    const zoneData = await db.findById(id);
    return documentToZone(zoneData);
  }

  async function update(zoneData: Partial<IZone>): Promise<IZone> {
    const db = await database.collection('zones');
    const zone = makeZone({
      ...db.findById(zoneData.id),
      ...zoneData,
    });
    const updatedZone = await db.update(zone);
    return documentToZone(updatedZone);
  }

  function documentToZone(zone: IZoneData): Zone {
    return makeZone(zone);
  }
}
