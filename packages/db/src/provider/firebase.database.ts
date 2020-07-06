import * as firebase from 'firebase';
import {
  DocumentNotFoundError,
  UniqueConstraintError,
  RequiredParameterError,
} from '@mdn-seed/core/src/helpers/errors';
import { IDatabase } from '../types/database.interface';
import { FirebaseConfig } from '../types/firebase-config.interface';
import QueryBuilder, { InstructionType } from '../helpers/query-builder';

export default function makeFirebaseDatabase({
  config,
}: {
  config: FirebaseConfig;
}): IDatabase {
  firebase.initializeApp(config);
  const database = firebase.firestore();
  let currentCollection = '';
  return Object.freeze({
    collection,
    exists,
    findById,
    insert,
    list,
    destroy,
    update,
    where,
  });

  async function collection(newCollection: string) {
    currentCollection = newCollection;
  }

  async function exists(id?: string) {
    return (
      id && (await database.collection(currentCollection).doc(id).get()).exists
    );
  }

  async function findById(id?: string) {
    if (!id) {
      return Promise.reject(new RequiredParameterError('id'));
    }
    const doc = await database.collection(currentCollection).doc(id).get();
    if (!doc.exists) {
      throw new DocumentNotFoundError(id);
    }
    return { ...doc.data(), id: doc.id };
  }

  async function list() {
    const results = await database.collection(currentCollection).get();
    return results.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  }

  async function insert(item: any) {
    // TODO: This should be in a try catch and return an error.
    // Layers outside should be able to handle those and pass them up
    // Each layer outside that getting more context to format them appropriately
    if (item.id) {
      delete item.id;
    }
    const docRef = await database
      .collection(currentCollection)
      .add({ ...item });
    const data = (await docRef.get()).data();
    return { ...data, id: docRef.id };
  }

  async function update(item: any) {
    const docRef = await database.collection(currentCollection).doc(item.id);
    docRef.set({ ...item }, { merge: true });
    const updated = (await docRef.get()).data();
    return { ...updated, id: docRef.id };
  }

  async function destroy(id?: string) {
    try {
      if (!id) {
        return Promise.reject(new RequiredParameterError('id'));
      }
      await database.collection(currentCollection).doc(id).delete();
      return true;
    } catch (error) {
      console.error('Error Deleting from Firestore :: ', { error });
      return Promise.reject(error);
    }
  }

  // TODO: Validate if something this complex is necessary
  // async function query(qb: QueryBuilder) {
  //   try {
  //     qb.instructions.reduce((acc, curr) => {
  //       switch (curr.type) {
  //         case InstructionType.TABLE:
  //           return database.collection(curr.name);
  //         case InstructionType.WHERE:
  //           const { field, operator, value } = curr;
  //           return (database as any).where(field, operator, value);
  //       }
  //     }, database);
  //     return (database as any).get();
  //   } catch (error) {
  //     console.error(`Error with Query`, { error });
  //     return Promise.reject(error);
  //   }
  // }

  // TODO: Alternatively, if the use-cases are minimal,
  // then, it might be better to keep the database queries explicit as well
  async function where(property: string, operator: any, value: any) {
    console.log('WHERE', { property, operator, value });
    return (
      await database
        .collection(currentCollection)
        .where(property, operator, value)
        .get()
    ).docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  }
}
