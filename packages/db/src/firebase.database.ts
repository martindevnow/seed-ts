import * as firebase from 'firebase';
import { v4 as uuidv4 } from 'uuid';
import { IDatabase } from './database.interface';

export default function makeFirebaseDatabase({ config }): IDatabase {
  firebase.initializeApp(config);
  console.log('using firebase');
  const database = firebase.firestore();
  let currentCollection = '';
  return Object.freeze({
    collection,
    findById,
    insert,
    list,
    destroy,
    update,
    getId: (id?: string) => id ?? uuidv4(),
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
    console.log({ data });

    return data;
  }

  async function insert() {}
  async function update() {}
  async function destroy() {}
}
