import makeInMemoryDb from './provider/in-memory.database';
import makeFirebaseDb from './provider/firebase.database';

export * from './types/database.interface';
export * from './types/firebase-config.interface';

export { makeInMemoryDb, makeFirebaseDb };
