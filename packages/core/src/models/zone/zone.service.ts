import { IDatabase } from '@mdn-seed/db';
import makeZone, { IZoneData, IZone, Zone } from './zone';

export default function makeZoneService({ database }: { database: IDatabase }) {
  return Object.freeze({
    create,
    findById,
    getAll,
    destroy,
    update,
  });

  // TODO: Add a specific interface for a returned insert
  async function create(zoneData: IZoneData): Promise<Zone> {
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

  async function getAll(): Promise<IZoneData[]> {
    const db = await database.collection('zones');
    const results = await db.list();
    console.log({ results });
    return results.map(documentToZone);
  }

  async function update(zoneData: Partial<IZone>): Promise<IZone> {
    const db = await database.collection('zones');
    const existing = await db.findById(zoneData.id);
    const zone = makeZone({
      ...existing,
      ...zoneData,
    });
    const updatedZone = await db.update(zone);
    return documentToZone(updatedZone);
  }

  async function destroy(zoneId: string): Promise<boolean> {
    const db = await database.collection('zones');
    const res: boolean = await db.destroy(zoneId);
    return res;
  }

  function documentToZone(zone: IZoneData): Zone {
    return makeZone(zone);
  }
}
