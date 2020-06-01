import { IDatabase } from '../../db/database.interface';
import makeInMemoryDb from '../../db/in-memory.database';
import makeZoneService from '../zone/zone.service';

describe('Model: Plant', () => {
  let database: IDatabase;
  beforeEach(() => {
    database = makeInMemoryDb();
  });

  it('creates a plant (in a zone)', async () => {
    const zoneService = makeZoneService({ database });
  });
});
