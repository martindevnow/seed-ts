export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
}
export interface APIRequest {
  path: string;
  method: RequestMethod;
  pathParams: any;
  queryParams: any;
  body: any;
}
