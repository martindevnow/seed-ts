export default function makeInMemoryDb() {
  const map = new Map();
  return Object.freeze({
    findById: async (id: string) => map.get(id),
    insert: async (item: any) => map.set(item.id, item),
    list: async () => Array.from(map.values()),
    remove: async (id: string) => map.delete(id),
    update: async (item: any) => {
      if (!map.has(item.id)) {
        throw new Error('No such item');
      }
      return map.set(item.id, { ...map.get(item.id), ...item });
    },
  });
}
