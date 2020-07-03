import { IDatabase } from '@mdn-seed/db';
import { IPlantData, makePlant, IPlant } from '../models/plants/plant';
import { serviceErrorFactory } from '../uses/core/helpers/handle-error';
import { Service } from './service.interface';

export type PlantService = Service<IPlantData, IPlant>;

export const makePlantService = ({
  database,
}: {
  database: IDatabase;
}): PlantService => {
  return Object.freeze({
    create,
    update,
    getAll,
    findById,
    findBy,
    destroy,
  });

  async function create(plantData: IPlantData): Promise<IPlant> {
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

  async function getAll(): Promise<IPlant[]> {
    await database.collection('plants');
    const results = await database.list();
    return results.map(documentToObj);
  }

  async function findById(id?: string): Promise<IPlant> {
    await database.collection('plants');
    const plantData = await database.findById(id);
    return documentToObj(plantData);
  }

  async function findBy(property: string, value: any): Promise<Array<IPlant>> {
    await database.collection('plants');
    // const qb = new QueryBuilder('plants').whereIs({ [property]: value });
    const results = await database.where(property, '==', value);
    return results.map(documentToObj);
  }

  async function update(plantData: Partial<IPlant>): Promise<IPlant> {
    await database.collection('plants');
    console.log('in update', { plantData });
    const current = await database.findById(plantData.id);
    const newPlant = makePlant({ ...current, ...plantData });
    const result = await database.update(newPlant);
    return documentToObj(result);
  }

  async function destroy(id?: string): Promise<boolean> {
    await database.collection('plants');
    const plant = await database.destroy(id);
    return !!plant;
  }

  function documentToObj(plant: IPlantData): IPlant {
    return makePlant(plant);
  }
};
