export interface IDatabase {
  findById: any;
  insert: any;
  list: any;
  remove: any;
  update: any;
  getId(id?: string): string;
  collection(table: string): IDatabase;
}
