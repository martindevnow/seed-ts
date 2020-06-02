import { IDatabase } from '../../db/database.interface';
import makeInMemoryDb from '../../db/in-memory.database';
import makePlantService from './plant.service';
import { Plant } from './plant';
import { MOCK_PLANT } from '../../tests/helpers';

describe('Model: Plant', () => {
  let database: IDatabase;
  beforeEach(() => {
    database = makeInMemoryDb();
  });

  it('creates a plant (in a zone)', async () => {
    const plantService = makePlantService({ database });
    const actual: Plant = await plantService.create(MOCK_PLANT);
    expect(actual.id).not.toBeUndefined();
    expect(actual.id).toBeTruthy();
    const persisted = await plantService.findById(actual.id);
    expect(persisted).toEqual(actual);
  });
});