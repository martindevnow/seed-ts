import express from 'express';
import bodyParser from 'body-parser';
import adaptRequest from './helpers/adapt-request';
import handlePlantsRequest from '../core/uses/plants/index';

interface UseCaseResponse {
  headers: any;
  statusCode: number;
  data: any;
}

const app = express();

app.use(bodyParser.json());

app.all('/plants', plantsController);

function plantsController(req: express.Request, res: express.Response) {
  const httpRequest = adaptRequest(req);
  handlePlantsRequest(httpRequest)
    .then(({ headers, statusCode, data }: UseCaseResponse) => {
      res.set(headers).status(statusCode).send(data);
    })
    .catch((e) => {
      console.error(e);
      res.status(500).end();
    });
}

app.listen(9000, () => {
  console.log('Listening on port 9000');
});
