import { makePlantService } from '@mdn-seed/core';
import { makeInMemoryDb } from '@mdn-seed/db';
import { makePlantsEndpointHandler } from './plants-endpoint';
export * from './plants-endpoint';

const database = makeInMemoryDb();
const plantsService = makePlantService({ database });
export const plantsEndpointHandler = makePlantsEndpointHandler({
  plantsService,
});
