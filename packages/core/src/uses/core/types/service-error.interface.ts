export interface ServiceError {
  code: number;
  name: string;
  message: string;
  details?: any;
}

export enum ServiceErrors {
  NotFound = 'NotFound',
  Duplicate = 'Duplicate',
  MissingData = 'MissingData',
  InvalidData = 'InvalidData',
}
