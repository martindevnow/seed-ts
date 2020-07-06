import { makePlant, IPlantData, PlantStatus } from '../plant';
import { EmptyObjectInitializationError } from '../../helpers/errors';

describe('Model: Plant', () => {
  it('(HAPPY) Plant :: has a minimum set of params that must be present', () => {
    const reqData = {
      type: 'Tom',
      status: PlantStatus.Seed,
    };

    const actualPlant = makePlant(reqData as any);
    expect(actualPlant).toEqual({
      ...reqData,
      dataPoints: [],
    });
  });

  it('(HAPPY) Plant :: removes fields that are not relevant', () => {
    const reqData = {
      type: 'Tom',
      status: PlantStatus.Seed,
      injected: 'THIS_SHOULD_BE_REMOVED',
    };

    const actual: any = makePlant(reqData as any);
    expect(actual.injected).toBeUndefined();
    delete reqData.injected;
    expect(actual).toEqual({
      ...reqData,
      dataPoints: [],
    });
  });

  it('(ERROR) Plant :: throws an error if factory function receives no argument', () => {
    try {
      makePlant();
      // This should not run
      expect(false).toBe(true);
    } catch (error) {
      expect(error).toEqual(new EmptyObjectInitializationError('plantData'));
      expect(true).toBe(true);
    }
  });

  it('(ERROR) Plant :: requires a status', () => {
    const plantData = {
      name: 'Name',
    };
    try {
      const actual = makePlant(plantData as IPlantData);
      expect(true).toBe(false);
    } catch (e) {
      expect(true).toBe(true);
    }
  });
});
