import { IDatabase } from '@mdn-seed/db';
import { makePlant, IPlantData, Plant, IPlant } from './plant';
import { serviceErrorFactory } from '../../uses';

// export interface Service<T, R> {
//   create: (item: T) => Promise<R>;
//   update: (item: Partial<T>) => Promise<R>;
//   getAll: () => Promise<Array<R>>;
//   findById: (id: string) => Promise<R>;
//   // documentToObj: (item: T) => R;
// }

// export interface PlantsService extends Service<IPlantData, Plant> {}

interface ServiceError {
  code: number;
  message: string;
  details?: any;
}

enum ServiceErrors {
  NotFound = 'NotFound',
  Duplicate = 'Duplicate',
  MissingData = 'MissingData',
}

export const makePlantsService = ({ database }: { database: IDatabase }) => {
  return Object.freeze({
    create,
    update,
    getAll,
    findById,
    destroy,
  });

  async function create(plantData: IPlantData): Promise<Plant> {
    // console.log('PlantService.create() :: ', { plantData });
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
