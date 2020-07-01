import {
  DataPoint,
  IDataPointData,
  makeDataPoint,
  IDataPoint,
} from '../models/data-point/data-point';
import { IDatabase } from '@mdn-seed/db';
import { Service } from './service.interface';
import { serviceErrorFactory } from '../uses/core/helpers/handle-error';

export const makeDataPointService = ({
  database,
}: {
  database: IDatabase;
}): Service<IDataPointData, DataPoint> => {
  return Object.freeze({
    create,
    update,
    getAll,
    findById,
    findBy,
    destroy,
  });

  async function create(dataPointData: IDataPointData): Promise<DataPoint> {
    try {
      const dataPoint: DataPoint = makeDataPoint(dataPointData);
      await database.collection('data-points');
      const result: IDataPoint = await database.insert(dataPoint);
      return documentToObj(result);
    } catch (error) {
      return Promise.reject(serviceErrorFactory(error));
    }
  }

  async function getAll(): Promise<DataPoint[]> {
    await database.collection('data-points');
    const results = await database.list();
    return results.map(documentToObj);
  }

  async function findById(id: string): Promise<DataPoint> {
    await database.collection('data-points');
    const dataPoint = await database.findById(id);
    return documentToObj(dataPoint);
  }

  async function findBy(
    property: string,
    value: any
  ): Promise<Array<DataPoint>> {
    await database.collection('data-points');
    const results = await database.where(property, '==', value);
    return results.map(documentToObj);
  }

  async function update(dataPointData: IDataPoint): Promise<DataPoint> {
    await database.collection('data-points');
    const current = await database.findById(dataPointData.id);
    const newDataPoint = makeDataPoint({ ...current, dataPointData });
    const result = await database.update(newDataPoint);
    return documentToObj(result);
  }

  async function destroy(id: string): Promise<boolean> {
    await database.collection('data-points');
    const dataPoint = await database.destroy(id);
    return !!dataPoint;
  }

  function documentToObj(dataPoint: IDataPointData): DataPoint {
    return makeDataPoint(dataPoint);
  }
};
