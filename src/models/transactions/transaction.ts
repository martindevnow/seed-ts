import { IPlant } from '../plants/plant';

export enum TransactionType {
  ChangePlantStatus = 'CHANGE_PLANT_STATUS', // req plant, date
  MovePlant = 'MOVE_PLANT', // req plant, zone_to, date
  LogPlantData = 'LOG_PLANT_DATA', // req plant
  TakeClone = 'TAKE_CLONE',
}
export interface ITransaction {
  type: TransactionType;
  plant: IPlant;
  zone: IZone;
}

export class Transaction implements ITransaction {}
