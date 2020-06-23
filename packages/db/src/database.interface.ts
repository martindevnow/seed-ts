// interface FetchById<T> {
//   (id: string): T;
// }

// interface Insert<T> {
//   (item: T): T;
// }

// interface List<T> {
//   (): Array<T>;
// }

// interface Destroy<T> {
//   (id: string): void;
// }

// interface Update<T> {
//   (item: Partial<T>): T;
// }

export interface IDatabase {
  // findById: FetchById<T>;
  // insert: Insert<T>;
  // list: List<T>;
  // destroy: Destroy<T>;
  // update: Update<T>;
  findById: any;
  insert: any;
  list: any;
  destroy: any;
  update: any;
  getId(id?: string): string;
  collection(table: string): IDatabase;
}
