import { v4 as uuidv4 } from 'uuid';
import { IDatabase } from './database.interface';

export default function makeInMemoryDb(): IDatabase {
  const map = new Map();

  const obj = Object.freeze({
    collection: (table: string) => obj,
    getId: (id?: string) => id ?? uuidv4(),
    findById: async (id: string) => {
      const obj = map.get(id);
      return { ...map.get(id), id };
    },
    insert: async (item: any) => {
      const id = obj.getId();
      const record = map.set(id, item);
      return { ...item, id };
    },
    list: async () => {
      const entries = Array.from(map.entries());
      console.log({ entries });
      return entries.map(([id, item]) => {
        console.log({ id, item });
        return { ...item, id };
      });
    },
    destroy: async (id: string) => map.delete(id),
    update: async (item: any) => {
      if (!map.has(item.id)) {
        throw new Error('No such item');
      }
      const newItem = { ...map.get(item.id), ...item };
      map.set(item.id, newItem);
      return newItem;
    },
  });
  return obj;
}
