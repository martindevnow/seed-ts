import { IDatabase, makeInMemoryDb } from '@mdn-seed/db';
import { makePlantService } from '../plant.service';
import { IPlant } from '../../models/plant';
import { MOCK_PLANT, MOCK_DATA_POINT } from '../../tests/helpers';
import { makeDataPoint, IDataPoint } from '../../models/data-point';
import { makeDataPointService } from '../data-point.service';

describe('Service: Plant', () => {
  let database: IDatabase;
  beforeEach(() => {
    database = makeInMemoryDb();
  });

  describe('create()', () => {
    it('creates a plant (in a zone)', async () => {
      const plantService = makePlantService({ database });
      const actual: IPlant = await plantService.create(MOCK_PLANT);
      expect(actual.id).not.toBeUndefined();
      expect(actual.id).toBeTruthy();
      const persisted = await plantService.findById(actual.id);
      expect(persisted).toEqual(actual);
    });
  });

  describe('addDataPoint', () => {
    it('adds a data-point that the plant did not have previously', async () => {
      const plantService = makePlantService({ database });
      const plant = await plantService.create(MOCK_PLANT);
      expect(plant.dataPoints.length).toBe(0);
      const dataPoint = makeDataPoint({
        ...MOCK_DATA_POINT,
        plantId: plant.id,
      });
      const updatedPlant = await plantService.addDataPoint(plant, dataPoint);
      expect(updatedPlant.dataPoints.length).toBe(1);
    });

    it('replaces a data-point of the same type', async () => {
      const plantService = makePlantService({ database });
      const plant = await plantService.create(MOCK_PLANT);
      expect(plant.dataPoints.length).toBe(0);
      const dataPoint = makeDataPoint({
        ...MOCK_DATA_POINT,
        plantId: plant.id,
      });
      await plantService.addDataPoint(plant, dataPoint);
      const updatedPlant = await plantService.addDataPoint(plant, dataPoint);
      expect(updatedPlant.dataPoints.length).toBe(1);
    });

    it('only replaces a data-point of the same type if the new one is more recent (timestamp)', async () => {
      const plantService = makePlantService({ database });
      const plant = await plantService.create(MOCK_PLANT);
      expect(plant.dataPoints.length).toBe(0);
      const dataPoint = makeDataPoint({
        ...MOCK_DATA_POINT,
        timestamp: 10,
        plantId: plant.id,
      });

      const dataPoint2 = makeDataPoint({
        ...MOCK_DATA_POINT,
        timestamp: 20,
        plantId: plant.id,
      });

      const dataPoint3 = makeDataPoint({
        ...MOCK_DATA_POINT,
        timestamp: 1,
        plantId: plant.id,
      });
      await plantService.addDataPoint(plant, dataPoint);
      await plantService.addDataPoint(plant, dataPoint2);
      await plantService.addDataPoint(plant, dataPoint3);
      const updatedPlant = await plantService.addDataPoint(plant, dataPoint2);
      expect(updatedPlant.dataPoints.length).toBe(1);
      expect(updatedPlant.dataPoints[0]).toEqual(dataPoint2);
    });
  });

  describe('removeDataPoint', () => {
    it('removes a data-point that the plant has currently stored on the plant document', async () => {
      const plantService = makePlantService({ database });
      const plant = await plantService.create(MOCK_PLANT);
      expect(plant.dataPoints.length).toBe(0);
      const dataPoint = makeDataPoint({
        ...MOCK_DATA_POINT,
        plantId: plant.id,
      });
      const updatedPlant = await plantService.addDataPoint(plant, dataPoint);
      expect(updatedPlant.dataPoints.length).toBe(1);

      const dataPointId = updatedPlant.dataPoints[0].id;
      const plantWithRemovedDP = await plantService.removeDataPoint(
        updatedPlant,
        dataPointId
      );
      expect(plantWithRemovedDP.dataPoints.length).toBe(0);
    });

    it('does nothing if the datapoint being deleted is not the most recent on the plant document', async () => {
      const plantService = makePlantService({ database });
      const plant = await plantService.create(MOCK_PLANT);
      expect(plant.dataPoints.length).toBe(0);
      const dataPoint1 = makeDataPoint({
        ...MOCK_DATA_POINT,
        timestamp: 10,
        plantId: plant.id,
      });

      const dataPoint2 = makeDataPoint({
        ...MOCK_DATA_POINT,
        timestamp: 20,
        plantId: plant.id,
      });

      const dataPoint3 = makeDataPoint({
        ...MOCK_DATA_POINT,
        timestamp: 1,
        plantId: plant.id,
      });
      await plantService.addDataPoint(plant, dataPoint1);
      await plantService.addDataPoint(plant, dataPoint2);
      await plantService.addDataPoint(plant, dataPoint3);
      const updatedPlant = await plantService.addDataPoint(plant, dataPoint2);
      expect(updatedPlant.dataPoints.length).toBe(1);

      const plantWithRemovedDP = await plantService.removeDataPoint(
        updatedPlant,
        'SOME_RANDOM_ID'
      );
      expect(plantWithRemovedDP.dataPoints[0]).toEqual(dataPoint2);
    });
  });
});
