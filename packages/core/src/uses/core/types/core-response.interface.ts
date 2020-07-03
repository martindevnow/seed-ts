export enum CoreResponseStatus {
  ReadSuccess = 200,
  CreatedSuccess = 201,
  DestroyedSuccess = 204,
  UpdatedSuccess = 200,
}

export interface CoreResponse {
  statusCode: CoreResponseStatus;
  data: any;
}
