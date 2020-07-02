import { makePlant, IPlantData, PlantStatus } from '../plant';

describe('Model: Plant', () => {
  it('HAPPY: has a minimum set of params that must be present', () => {
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

  it('HAPPY: removes fields that are not relevant', () => {
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

  it('requires a status', () => {
    const plantData = {
      name: 'Name',
    };
    try {
      const actual = makePlant(plantData as IPlantData);
      expect(true).toBe(false);
    } catch (e) {
      console.log(e, { name: e.name, message: e.message });
      expect(true).toBe(true);
    }
  });
});
