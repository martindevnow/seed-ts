import express from 'express';
import { CoreRequest, RequestMethod } from '@mdn-seed/core';

export const adaptRequest = (req: express.Request): Readonly<CoreRequest> => {
  return Object.freeze({
    path: req.path,
    method: req.method as RequestMethod,
    pathParams: req.params,
    queryParams: req.query,
    body: req.body,
  });
};
