import makePlantsEndpointHandler from './plants-endpoint';
import makePlantService from '../../models/plants/plant.service';
import makeInMemoryDb from '../../db/in-memory.database';

const database = makeInMemoryDb();
const plantsService = makePlantService({ database });
const plantsEndpointHandler = makePlantsEndpointHandler({ plantsService });

export default plantsEndpointHandler;
