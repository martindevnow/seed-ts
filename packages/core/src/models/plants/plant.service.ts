import { IDatabase } from '@mdn-seed/db';
import { makePlant, IPlantData, Plant, IPlant } from './plant';

export const makePlantService = ({ database }: { database: IDatabase }) => {
  return Object.freeze({
    create,
    update,
    getAll,
    findById,
  });

  async function create(plantData: IPlantData): Promise<Plant> {
    console.log('PlantService.create() :: ', { plantData });
    const plant: IPlantData = makePlant(plantData);
    await database.collection('plants');
    const result: IPlant = await database.insert(plant);
    return documentToPlant(result);
  }

  async function getAll(): Promise<Plant[]> {
    await database.collection('plants');
    const results = await database.list();
    return results.map((item) => documentToPlant(item));
  }

  async function update(plantData: IPlant): Promise<Plant> {
    await database.collection('plants');
    const current = await database.findById(plantData.id);
    const result = await database.update(
      makePlant({ ...current, ...plantData })
    );
    return documentToPlant(result);
  }

  async function findById(id: string): Promise<Plant> {
    await database.collection('plants');
    const plantData = await database.findById(id);
    return documentToPlant(plantData);
  }

  function documentToPlant(plant: IPlantData): Plant {
    return makePlant(plant);
  }
};
