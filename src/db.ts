import { v4 as uuidv4 } from 'uuid';

export interface IDatabase {
  findById: any;
  insert: any;
  list: any;
  remove: any;
  update: any;
  getId(id?: string): string;
  collection(table: string): IDatabase;
}

export default function makeInMemoryDb(): IDatabase {
  const map = new Map();
  const obj = Object.freeze({
    collection: (table: string) => obj,
    getId: (id?: string) => id ?? uuidv4(),
    findById: async (id: string) => ({ ...map.get(id), id }),
    insert: async (item: any) => {
      const id = obj.getId();
      const record = map.set(id, item);
      return { ...item, id };
    },
    list: async () => Array.from(map.values()),
    remove: async (id: string) => map.delete(id),
    update: async (item: any) => {
      if (!map.has(item.id)) {
        throw new Error('No such item');
      }
      return map.set(item.id, { ...map.get(item.id), ...item });
    },
  });
  return obj;
}
