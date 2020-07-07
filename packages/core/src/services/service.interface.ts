import { IDataPoint } from '../models/data-point';

export interface Service<T, R> {
  create: (item: T) => Promise<R>;
  update: (item: Partial<R>) => Promise<R>;
  getAll: () => Promise<Array<R>>;
  findById: (id?: string) => Promise<R>;
  destroy: (id?: string) => Promise<boolean>;
  findBy: (property: string, value: any) => Promise<Array<R>>;
  // documentToObj: (item: T) => R;
}

export interface ServiceError {
  code: number;
  message: string;
  details?: any;
}

export enum ServiceErrors {
  NotFound = 'NotFound',
  Duplicate = 'Duplicate',
  MissingData = 'MissingData',
}

export interface HasDataPoints<T> {
  addDataPoint: (entity: T, dataPoint: IDataPoint) => Promise<T>;
}
