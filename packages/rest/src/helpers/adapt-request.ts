import express from 'express';
import { APIRequest } from '@mdn-seed/core/src/uses/api/request.interface';

export default function (req: express.Request): Readonly<APIRequest> {
  return Object.freeze({
    path: req.path,
    method: req.method,
    pathParams: req.params,
    queryParams: req.query,
    body: req.body,
  });
}
