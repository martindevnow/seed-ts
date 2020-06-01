import { IDatabase } from '../../db/database.interface';
import makePlant, { IPlantData, Plant, IPlant } from './plant';
import makeZone from '../zone/zone';

export default function makePlantService({
  database,
}: {
  database: IDatabase;
}) {
  return Object.freeze({
    add,
  });

  async function add(plantData: IPlantData): Promise<Plant> {
    const plant: IPlantData = makePlant(plantData);
    const db = await database.collection('plants');
    const result: IPlant = await db.insert(plant);
    return documentToPlant(result);
  }

  function documentToPlant(plant: IPlantData): Plant {
    return makePlant(plant);
  }
}
