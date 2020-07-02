import { makeZone, IZoneData } from '../zone';

describe('Zone', () => {
  it('HAPPY: has a minimum set of params that must be present', () => {
    const reqData = {
      name: 'Name',
    };

    const actualZone = makeZone(reqData as any);
    expect(actualZone).toEqual({
      ...reqData,
      dataPoints: [],
    });
  });

  it('HAPPY: removes fields that are not relevant', () => {
    const reqData = {
      name: 'Name',
      injected: 'THIS_SHOULD_BE_REMOVED',
    };

    const actual: any = makeZone(reqData as any);
    expect(actual.injected).toBeUndefined();
    delete reqData.injected;
    expect(actual).toEqual({
      ...reqData,
      dataPoints: [],
    });
  });

  it('requires a name', () => {
    const zoneData = {
      length: '15',
    };
    try {
      const actual = makeZone(zoneData as IZoneData);
      // This should NOT be executed
      expect(true).toBe(false);
    } catch (e) {
      console.log(e, { name: e.name, message: e.message });
      expect(true).toBe(true);
    }
  });
});
