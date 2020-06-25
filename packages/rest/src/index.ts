// import handlePlantsRequest from '@mdn-seed/core/src/uses/plants/index';

import express from 'express';
import bodyParser from 'body-parser';

import {
  makePlantService,
  makePlantsEndpointHandler,
  APIResponse,
  APIRequest,
} from '@mdn-seed/core';
import makeFirebaseDatabase from '@mdn-seed/db/src/firebase.database';
import { firebaseConfig } from './db/firebase';
import { adaptRequest } from './helpers/adapt-request';
import { adaptResponse } from './helpers/adapt-response';
import { adaptError } from './helpers/adapt-error';

const database = makeFirebaseDatabase({ config: firebaseConfig });
const plantsService = makePlantService({ database });
const handlePlantsRequest = makePlantsEndpointHandler({ plantsService });

interface UseCaseResponse {
  headers: any;
  statusCode: number;
  data: any;
}

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
      console.log('in Catch of promise in handlePlantsRequest promise');
      console.error(error);
      const { headers, statusCode, data } = adaptError(error);
      res.set(headers).status(statusCode).send(data);
    });
}

app.listen(9000, () => {
  console.log('Listening on port 9000');
});
