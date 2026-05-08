// src/utils/tests/audioUtils.test.ts v2.3.10
import { getAverage } from '../../services/audioUtils';

describe('audioUtils', () => {
  describe('getAverage', () => {
    it('should calculate average of entire array when no start/end provided', () => {
      const dataArray = new Uint8Array([100, 200, 150, 50]);
      const result = getAverage(dataArray);
      expect(result).toBe(125);
    });

    it('should calculate average with custom start index', () => {
      const dataArray = new Uint8Array([100, 200, 150, 50]);
      const result = getAverage(dataArray, 1);
      expect(result).toBe(133.33333333333334);
    });

    it('should calculate average with custom start and end indices', () => {
      const dataArray = new Uint8Array([100, 200, 150, 50]);
      const result = getAverage(dataArray, 1, 3);
      expect(result).toBe(175);
    });

    it('should handle zero length range', () => {
      const dataArray = new Uint8Array([100, 200]);
      const result = getAverage(dataArray, 1, 1);
      expect(result).toBeNaN();
    });

    it('should handle empty array', () => {
      const dataArray = new Uint8Array(0);
      const result = getAverage(dataArray);
      expect(result).toBeNaN();
    });
  });
});
