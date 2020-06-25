import express from 'express';
import bodyParser from 'body-parser';

import {
  makePlantService,
  makePlantsEndpointHandler,
  APIResponse,
  APIRequest,
} from '@mdn-seed/core';
import { makeFirebaseDb } from '@mdn-seed/db';
import { adaptError, adaptResponse, adaptRequest } from './api';

import { firebaseConfig } from './db/firebase';

const database = makeFirebaseDb({ config: firebaseConfig });
const plantsService = makePlantService({ database });
const handlePlantsRequest = makePlantsEndpointHandler({ plantsService });

const app = express();

app.use(bodyParser.json());

app.all('/plants', plantsController);

function plantsController(req: express.Request, res: express.Response) {
  const httpRequest: APIRequest = adaptRequest(req);

  handlePlantsRequest(httpRequest)
    .then((response: APIResponse) => {
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
