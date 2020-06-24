export interface APIRequest {
  path: string;
  method: string;
  pathParams: any;
  queryParams: any;
  body: any;
}
