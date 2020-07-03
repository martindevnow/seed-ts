export enum RequestMethod {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DESTROY = 'DESTROY',
}
export interface CoreRequest {
  model: string; // entity to be operated upon
  subModels?: Array<string>;
  path?: string; // debugging purposes
  method: RequestMethod; // action to be taken
  params: any; // key value pairs
  body: any; // data to be submitted
}
