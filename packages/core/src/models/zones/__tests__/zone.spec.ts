import { makeZone } from '../zone';
import { EmptyObjectInitializationError } from '../../../helpers/errors';

describe('Model: Zone', () => {
  it('(HAPPY) Zone :: has a minimum set of params that must be present', () => {
    const reqData = {
      name: 'Name',
    };

    const actualZone = makeZone(reqData as any);
    expect(actualZone).toEqual({
      ...reqData,
      dataPoints: [],
    });
  });

  it('(HAPPY) Zone :: removes fields that are not relevant', () => {
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

  it('(ERROR) Zone :: throws an error if factory function receives no argument', () => {
    try {
      makeZone();
      // This should not run
      expect(false).toBe(true);
    } catch (error) {
      expect(error).toEqual(new EmptyObjectInitializationError('zoneData'));
      expect(true).toBe(true);
    }
  });

  it('(ERROR) Zone :: requires a name', () => {
    const zoneData = {
      length: '15',
    };
    try {
      // This line should throw and error
      makeZone(zoneData as any);
      // This should NOT be executed
      expect(true).toBe(false);
    } catch (e) {
      expect(true).toBe(true);
    }
  });
});
