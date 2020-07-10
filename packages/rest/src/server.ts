import express from 'express';
import bodyParser from 'body-parser';

import {
  makeDataPointService,
  makeDataPointsEndpointHandler,
  makePlantService,
  makePlantsEndpointHandler,
  CoreResponse,
  CoreRequest,
  makeZoneService,
  makeZonesEndpointHandler,
} from '@mdn-seed/core';
import { makeFirebaseDb } from '@mdn-seed/db';
import { adaptRequest } from './api/helpers/adapt-request';
import { adaptResponse } from './api/helpers/adapt-response';
import { adaptError } from './api/helpers/adapt-error';

import { config } from 'dotenv';
import { resolve } from 'path';

// Environment Configuration
config({ path: resolve(__dirname, '../../../.env') });
import { firebaseConfig } from './db/firebase';

const database = makeFirebaseDb({ config: firebaseConfig });
const plantService = makePlantService({ database });
const zoneService = makeZoneService({ database });
const dataPointService = makeDataPointService({ database });
const handlePlantsRequest = makePlantsEndpointHandler({
  plantService,
  zoneService,
  dataPointService,
});
const handleZonesRequest = makeZonesEndpointHandler({
  plantService,
  zoneService,
  dataPointService,
});
const handleDataPointsRequest = makeDataPointsEndpointHandler({
  plantService,
  zoneService,
  dataPointService,
});

const app = express();

app.use(bodyParser.json());

app.all('/plants', plantsController);
app.all('/plants/:id', plantsController);
app.all('/data-points', dataPointsController);
app.all('/data-points/:id', dataPointsController);
app.all('/zones', zonesController);
app.all('/zones/:id', zonesController);
app.all('/zones/:id/plants', zonesController);

function plantsController(req: express.Request, res: express.Response) {
  const coreRequest: CoreRequest = adaptRequest(req);

  handlePlantsRequest(coreRequest)
    .then((coreResponse: CoreResponse) => {
      const { headers, statusCode, data } = adaptResponse(
        coreResponse,
        coreRequest
      );
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
    .then((coreResponse: CoreResponse) => {
      const { headers, statusCode, data } = adaptResponse(
        coreResponse,
        coreRequest
      );
      res.set(headers).status(statusCode).send(data);
    })
    .catch((error) => {
      const { headers, statusCode, data } = adaptError(error);
      res.set(headers).status(statusCode).send(data);
    });
}

function dataPointsController(req: express.Request, res: express.Response) {
  const coreRequest: CoreRequest = adaptRequest(req);

  handleDataPointsRequest(coreRequest)
    .then((coreResponse: CoreResponse) => {
      const { headers, statusCode, data } = adaptResponse(
        coreResponse,
        coreRequest
      );
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
