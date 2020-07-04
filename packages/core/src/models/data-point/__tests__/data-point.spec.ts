import { makeDataPoint, DataPointType } from '../data-point';
import { EmptyObjectInitializationError } from '../../../helpers/errors';

describe('Model: DataPoint', () => {
  it('(HAPPY) DataPoint :: has a minimum set of params that must be present', () => {
    const reqData = {
      plantId: 'plant_id',
      timestamp: Date.now(),
      dataValue: '15',
      dataUnit: 'Degrees',
      type: DataPointType.TEMPERATURE,
    };

    const actualDataPoint = makeDataPoint(reqData as any);
    expect(actualDataPoint).toEqual({
      ...reqData,
    });
  });

  it('(HAPPY) DataPoint :: removes fields that are not relevant', () => {
    const reqData = {
      plantId: 'plant_id',
      timestamp: Date.now(),
      dataValue: '15',
      dataUnit: 'Degrees',
      type: DataPointType.TEMPERATURE,
      injected: 'THIS_SHOULD_BE_REMOVED',
    };

    const actual: any = makeDataPoint(reqData as any);
    expect(actual.injected).toBeUndefined();
    delete reqData.injected;
    expect(actual).toEqual({
      ...reqData,
    });
  });

  it('(ERROR) DataPoint :: throws an error if factory function receives no argument', () => {
    try {
      makeDataPoint();
      // This should not run
      expect(false).toBe(true);
    } catch (error) {
      expect(error).toEqual(
        new EmptyObjectInitializationError('dataPointData')
      );
      expect(true).toBe(true);
    }
  });

  it('(ERROR) DataPoint :: requires a zoneId or plantId', () => {
    const dataPointData = {
      timestamp: Date.now(),
      dataValue: '15',
      dataUnit: 'Degrees',
      type: DataPointType.TEMPERATURE,
    };
    try {
      makeDataPoint(dataPointData as any);
      // This should NOT be executed
      expect(true).toBe(false);
    } catch (e) {
      expect(true).toBe(true);
    }
  });

  it('(ERROR) DataPoint :: cannot have BOTH a zoneId AND a plantId', () => {
    const dataPointData = {
      zoneId: 'ZONE_ID',
      plantId: 'PLANT_ID',
      timestamp: Date.now(),
      dataValue: '15',
      dataUnit: 'Degrees',
      type: DataPointType.TEMPERATURE,
    };
    try {
      makeDataPoint(dataPointData as any);
      // This should NOT be executed
      expect(true).toBe(false);
    } catch (e) {
      expect(true).toBe(true);
    }
  });
});
