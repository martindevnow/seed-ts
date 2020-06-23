import { makeInMemoryDb } from '@mdn-seed/db';
import makePlantsEndpointHandler from './plants-endpoint';
import makePlantService from '../../models/plants/plant.service';

const database = makeInMemoryDb();
const plantsService = makePlantService({ database });
const plantsEndpointHandler = makePlantsEndpointHandler({ plantsService });

export default plantsEndpointHandler;
