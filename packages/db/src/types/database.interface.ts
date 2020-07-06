export interface IDatabase {
  // findById: (id: string) => Promise<R>;
  // insert: (item: T) => Promise<R>;
  // list: () => Promise<Array<R>>;
  // destroy: (id: string) => Promise<boolean>;
  // update: (item: T) => Promise<Array<R>>;
  // where: (property: string, operator: any, value: any) => Promise<Array<R>>;
  // collection(table: string): void;
  exists: (id?: string) => Promise<boolean>;
  findById: (id?: string) => Promise<any>;
  insert: (item: any) => Promise<any>;
  list: () => Promise<Array<any>>;
  destroy: (id?: string) => Promise<boolean>;
  update: (item: any) => Promise<any>;
  where: (property: string, operator: any, value: any) => Promise<Array<any>>;
  collection(table: string): void;
}
