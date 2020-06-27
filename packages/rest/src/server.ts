import express from 'express';
import bodyParser from 'body-parser';

import {
  makePlantService,
  makePlantsEndpointHandler,
  CoreResponse,
  CoreRequest,
  makeZoneService,
  makeZonesEndpointHandler,
} from '@mdn-seed/core';
import { makeFirebaseDb } from '@mdn-seed/db';

import { firebaseConfig } from './db/firebase';
import { adaptRequest } from './api/helpers/adapt-request';
import { adaptResponse } from './api/helpers/adapt-response';
import { adaptError } from './api/helpers/adapt-error';

const database = makeFirebaseDb({ config: firebaseConfig });
const plantService = makePlantService({ database });
const handlePlantsRequest = makePlantsEndpointHandler({ plantService });
const zoneService = makeZoneService({ database });
const handleZonesRequest = makeZonesEndpointHandler({ zoneService });

const app = express();

app.use(bodyParser.json());

app.all('/plants', plantsController);
app.all('/plants/:id', plantsController);
app.all('/zones', zonesController);
app.all('/zones/:id', zonesController);

function plantsController(req: express.Request, res: express.Response) {
  const coreRequest: CoreRequest = adaptRequest(req);

  handlePlantsRequest(coreRequest)
    .then((response: CoreResponse) => {
      const { headers, statusCode, data } = adaptResponse(response);
      res.set(headers).status(statusCode).send(data);
    })
    .catch((error) => {
      const { headers, statusCode, data } = adaptError(error);
      res.set(headers).status(statusCode).send(data);
    });
}

function zonesController(req: express.Request, res: express.Response) {
  const coreRequest: CoreRequest = adaptRequest(req);

  handleZonesRequest(coreRequest)
    .then((response: CoreResponse) => {
      const { headers, statusCode, data } = adaptResponse(response);
      res.set(headers).status(statusCode).send(data);
    })
    .catch((error) => {
      const { headers, statusCode, data } = adaptError(error);
      res.set(headers).status(statusCode).send(data);
    });
}

app.listen(9000, () => {
  console.log('Listening on port 9000');
});
