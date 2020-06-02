import { IDatabase } from '../../db/database.interface';
import makePlant, { IPlantData, Plant, IPlant } from './plant';

export default function makePlantService({
  database,
}: {
  database: IDatabase;
}) {
  return Object.freeze({
    create,
    update,
    findById,
  });

  async function create(plantData: IPlantData): Promise<Plant> {
    const plant: IPlantData = makePlant(plantData);
    const db = await database.collection('plants');
    const result: IPlant = await db.insert(plant);
    return documentToPlant(result);
  }

  async function update(plantData: IPlant): Promise<Plant> {
    const db = await database.collection('plants');
    const current = await db.findById(plantData.id);
    const result = await db.update(makePlant({ ...current, ...plantData }));
    return documentToPlant(result);
  }

  async function findById(id: string): Promise<Plant> {
    const db = await database.collection('plants');
    const plantData = await db.findById(id);
    return documentToPlant(plantData);
  }

  function documentToPlant(plant: IPlantData): Plant {
    return makePlant(plant);
  }
}
