import { makePlantService } from '@mdn-seed/core';
import { makeInMemoryDb } from '@mdn-seed/db';
import makePlantsEndpointHandler from './plants-endpoint';

const database = makeInMemoryDb();
const plantsService = makePlantService({ database });
const plantsEndpointHandler = makePlantsEndpointHandler({ plantsService });

export default plantsEndpointHandler;
