export interface Service<T, R> {
  create: (item: T) => Promise<R>;
  update: (item: Partial<T>) => Promise<R>;
  getAll: () => Promise<Array<R>>;
  findById: (id: string) => Promise<R>;
  destroy: (id: string) => Promise<boolean>;
  // documentToObj: (item: T) => R;
}

// export interface PlantsService extends Service<IPlantData, Plant> {}
