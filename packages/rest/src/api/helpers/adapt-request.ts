import express from 'express';
import { CoreRequest, RequestMethod } from '@mdn-seed/core';
import { Models } from '@mdn-seed/core';
import { pathToFileURL } from 'url';

const restMethodToCoreRequestMethod = {
  POST: RequestMethod.CREATE,
  PATCH: RequestMethod.UPDATE,
  GET: RequestMethod.READ,
  DELETE: RequestMethod.DESTROY,
};

const getModelFromString = (query: string): string | null => {
  switch (query) {
    case 'plants':
      return Models.Plant;
    case 'zones':
      return Models.Zone;
    case 'data-points':
      return Models.DataPoint;
    case 'equipments':
      return Models.Equipment;
    default:
      return null;
  }
};

const extractModelFromPath = (path: string): string => {
  const parts = path.split('/');
  const model = getModelFromString(parts[1]);
  if (model === null) {
    throw new Error('Model Not Supported for path mapping');
  }
  return model;
};

const extractSubModelsFromPath = (path: string): Array<string> => {
  const parts = path.split('/');
  if (parts.length <= 2) {
    return [];
  }
  parts.shift();
  parts.shift();
  return parts.reduce((acc, curr) => {
    const model = getModelFromString(curr);
    return [...acc, ...(model ? [model] : [])];
  }, []);
};

export const adaptRequest = (req: express.Request): Readonly<CoreRequest> => {
  return Object.freeze({
    model: extractModelFromPath(req.path),
    subModels: extractSubModelsFromPath(req.path),
    path: req.path,
    method: restMethodToCoreRequestMethod[req.method] as RequestMethod,
    params: { ...req.params, ...req.query },
    body: req.body,
  });
};
