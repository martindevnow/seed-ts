export interface Service<T, R> {
  create: (item: T) => Promise<R>;
  update: (item: Partial<T>) => Promise<R>;
  getAll: () => Promise<Array<R>>;
  findById: (id: string) => Promise<R>;
  destroy: (id: string) => Promise<boolean>;
  findBy: (property: string, value: any) => Promise<Array<R>>;
  // documentToObj: (item: T) => R;
}

// export interface PlantService extends Service<IPlantData, Plant> {}
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
