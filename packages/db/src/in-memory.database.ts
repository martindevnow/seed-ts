import { v4 as uuidv4 } from 'uuid';
import { IDatabase } from './database.interface';

export default function makeInMemoryDb(): IDatabase {
  const maps = {};
  let currentMap;
  const obj = Object.freeze({
    collection: (table: string) => {
      currentMap = table;
      if (maps[currentMap]) {
        return maps[currentMap];
      }
      maps[currentMap] = new Map();
    },
    findById: async (id: string) => {
      const obj = maps[currentMap].get(id);
      return { ...maps[currentMap].get(id), id };
    },
    insert: async (item: any) => {
      const id = uuidv4();
      const record = maps[currentMap].set(id, item);
      return { ...item, id };
    },
    list: async () => {
      const entries = Array.from(maps[currentMap].entries());
      return entries.map(([id, item]) => {
        return { ...item, id };
      });
    },
    destroy: async (id: string) => maps[currentMap].delete(id),
    update: async (item: any) => {
      if (!maps[currentMap].has(item.id)) {
        throw new Error('No such item');
      }
      const newItem = { ...maps[currentMap].get(item.id), ...item };
      maps[currentMap].set(item.id, newItem);
      return newItem;
    },
  });
  return obj;
}
