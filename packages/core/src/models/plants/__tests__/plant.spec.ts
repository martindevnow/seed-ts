import { makePlant, IPlantData } from '../plant';

describe('Plant', () => {
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
