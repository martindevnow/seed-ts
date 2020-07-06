import { v4 as uuidv4 } from 'uuid';
import { IDatabase } from '../types/database.interface';
import { RequiredParameterError } from '@mdn-seed/core/src/helpers/errors';

const propertyIsEqual = (
  obj: { [key: string]: any },
  property: string,
  value: any
) => {
  return obj[property] === value;
};

const operatorFunctions: { [key: string]: Function } = {
  '==': propertyIsEqual,
};

export default function makeInMemoryDb(): IDatabase {
  const maps: { [collection: string]: Map<string, any> } = {};
  let currentMap: string;
  const obj = Object.freeze({
    collection: (table: string) => {
      currentMap = table;
      if (maps[currentMap]) {
        return maps[currentMap];
      }
      maps[currentMap] = new Map();
    },
    exists: async (id?: string) => {
      if (!id) return false;
      return !!maps[currentMap].get(id);
    },
    findById: async (id?: string) => {
      if (!id) {
        return Promise.reject(new RequiredParameterError('id'));
      }
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
    destroy: async (id?: string) => {
      if (!id) {
        return Promise.reject(new RequiredParameterError('id'));
      }
      return maps[currentMap].delete(id);
    },
    update: async (item: any) => {
      if (!maps[currentMap].has(item.id)) {
        throw new Error('No such item');
      }
      const newItem = { ...maps[currentMap].get(item.id), ...item };
      maps[currentMap].set(item.id, newItem);
      return newItem;
    },
    where: async (property: string, operator: any, value: any) => {
      const filtered: Array<any> = [];
      maps[currentMap].forEach((val, key) => {
        if (operatorFunctions[operator](val, property, value)) {
          filtered.push({
            ...val.get(),
            id: key,
          });
        }
      });
      return filtered;
    },
  });
  return obj;
}
