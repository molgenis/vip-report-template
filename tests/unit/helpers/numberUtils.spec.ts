import { max } from '@/helpers/numberUtils';

describe('utils', () => {
  describe('max', () => {
    it('should return maximum value out of an array', () => {
      const arrayOfNumbers = [1, 52, 18, 191, 12, 34, 3, 6];
      expect(max(arrayOfNumbers)).toBe(191);
    });
  });
});
