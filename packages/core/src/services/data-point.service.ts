import {
  IDataPoint,
  IDataPointData,
  makeDataPoint,
} from '../models/data-point';
import { IDatabase } from '@mdn-seed/db';
import { Service } from './service.interface';
import { serviceErrorFactory } from '../uses/core/helpers/handle-error';

export type DataPointService = Service<IDataPointData, IDataPoint>;

export const makeDataPointService = ({
  database,
}: {
  database: IDatabase;
}): Service<IDataPointData, IDataPoint> => {
  return Object.freeze({
    create,
    update,
    getAll,
    findById,
    findBy,
    destroy,
  });

  async function create(dataPointData: IDataPointData): Promise<IDataPoint> {
    try {
      const dataPoint: IDataPoint = makeDataPoint(dataPointData);
      await database.collection('data-points');
      const result: IDataPoint = await database.insert(dataPoint);
      return documentToObj(result);
    } catch (error) {
      return Promise.reject(serviceErrorFactory(error));
    }
  }

  async function getAll(): Promise<IDataPoint[]> {
    await database.collection('data-points');
    const results = await database.list();
    return results.map(documentToObj);
  }

  async function findById(id?: string): Promise<IDataPoint> {
    await database.collection('data-points');
    const dataPoint = await database.findById(id);
    return documentToObj(dataPoint);
  }

  async function findBy(
    property: string,
    value: any
  ): Promise<Array<IDataPoint>> {
    await database.collection('data-points');
    const results = await database.where(property, '==', value);
    return results.map(documentToObj);
  }

  async function update(
    dataPointData: Partial<IDataPoint>
  ): Promise<IDataPoint> {
    await database.collection('data-points');
    const current = await database.findById(dataPointData.id);
    const newDataPoint = makeDataPoint({ ...current, dataPointData });
    const result = await database.update(newDataPoint);
    return documentToObj(result);
  }

  async function destroy(id?: string): Promise<boolean> {
    await database.collection('data-points');
    const dataPoint = await database.destroy(id);
    return !!dataPoint;
  }

  function documentToObj(dataPoint: IDataPointData): IDataPoint {
    return makeDataPoint(dataPoint);
  }
};
