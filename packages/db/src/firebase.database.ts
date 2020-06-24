import * as firebase from 'firebase';
import { IDatabase } from './database.interface';

export default function makeFirebaseDatabase({ config }): IDatabase {
  firebase.initializeApp(config);
  const database = firebase.firestore();
  let currentCollection = '';
  return Object.freeze({
    collection,
    findById,
    insert,
    list,
    destroy,
    update,
  });

  async function collection(newCollection: string) {
    currentCollection = newCollection;
  }

  async function findById(id: string) {
    return await database.collection(currentCollection).doc(id);
  }

  async function list() {
    const results = await database.collection(currentCollection).get();
    const data = results.docs.map((doc) => doc.data());
    return data;
  }

  async function insert(item: any) {
    // TODO: This should be in a try catch and return an error.
    // Layers outside should be able to handle those and pass them up
    // Each layer outside that getting more context to format them appropriately
    const docRef = await database
      .collection(currentCollection)
      .add({ ...item });
    const data = (await docRef.get()).data();
    return { ...data, id: docRef.id };
  }

  async function update() {}
  async function destroy() {}
}
