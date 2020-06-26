import express from 'express';
import bodyParser from 'body-parser';

import {
  makePlantsService,
  makePlantsEndpointHandler,
  CoreResponse,
  CoreRequest,
} from '@mdn-seed/core';
import { makeFirebaseDb } from '@mdn-seed/db';
import { adaptError, adaptResponse, adaptRequest } from './api';

import { firebaseConfig } from './db/firebase';

const database = makeFirebaseDb({ config: firebaseConfig });
const plantsService = makePlantsService({ database });
const handlePlantsRequest = makePlantsEndpointHandler({ plantsService });

const app = express();

app.use(bodyParser.json());

app.all('/plants', plantsController);
app.all('/plants/:id', plantsController);

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

app.listen(9000, () => {
  console.log('Listening on port 9000');
});
