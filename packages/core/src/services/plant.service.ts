import { IDatabase } from '@mdn-seed/db';
import { IPlantData, makePlant, IPlant, Plant } from '../models/plants/plant';
import { serviceErrorFactory } from '../uses/core/helpers/handle-error';
import { Service } from './service.interface';

export const makePlantService = ({
  database,
}: {
  database: IDatabase;
}): Service<IPlantData, Plant> => {
  return Object.freeze({
    create,
    update,
    getAll,
    findById,
    destroy,
  });

  async function create(plantData: IPlantData): Promise<Plant> {
    // TODO: Determine if this is worth it to wrap this layer in try catch block
    // How does the consumer want the error to be formatted?
    // Who should expect the thrown error?
    // Does each layer require it's own Error types/format?
    // Need to consider form validation? (since makePlant is being called )
    try {
      const plant: IPlantData = makePlant(plantData);
      await database.collection('plants');
      const result: IPlant = await database.insert(plant);
      return documentToObj(result);
    } catch (e) {
      return Promise.reject(serviceErrorFactory(e));
    }
  }

  async function getAll(): Promise<Plant[]> {
    await database.collection('plants');
    const results = await database.list();
    return results.map((item: IPlantData) => documentToObj(item));
  }

  async function update(plantData: IPlant): Promise<Plant> {
    await database.collection('plants');
    const current = await database.findById(plantData.id);
    const newPlant = makePlant({ ...current, ...plantData });
    const result = await database.update(newPlant);
    return documentToObj(result);
  }

  async function findById(id: string): Promise<Plant> {
    await database.collection('plants');
    const plantData = await database.findById(id);
    return documentToObj(plantData);
  }

  async function destroy(id: string): Promise<boolean> {
    await database.collection('plants');
    const plant = await database.destroy(id);
    return !!plant;
  }

  function documentToObj(plant: IPlantData): Plant {
    return makePlant(plant);
  }
};
