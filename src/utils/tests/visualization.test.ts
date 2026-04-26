// File: src\utils\tests\visualization.test.ts | Version: v2.3.8
import {
  lerp,
  normalize,
  map,
  clamp,
  distance,
  vectorLength,
  calculateAudioEnergy,
  calculateFrequencyBands,
  smoothValue,
  noise,
  isPointInRect,
  calculateBoundingBox
} from '../visualization';

describe('Visualization Utilities', () => {
  describe('lerp', () => {
    it('should linearly interpolate between two values', () => {
      expect(lerp(0, 100, 0)).toBe(0);
      expect(lerp(0, 100, 0.5)).toBe(50);
      expect(lerp(0, 100, 1)).toBe(100);
      expect(lerp(10, 20, 0.25)).toBe(12.5);
    });
  });

  describe('normalize', () => {
    it('should normalize a value to 0-1 range', () => {
      expect(normalize(50, 0, 100)).toBe(0.5);
      expect(normalize(0, 0, 100)).toBe(0);
      expect(normalize(100, 0, 100)).toBe(1);
    });

    it('should handle negative values', () => {
      expect(normalize(-50, -100, 100)).toBe(0.25);
    });
  });

  describe('map', () => {
    it('should map value from one range to another', () => {
      expect(map(50, 0, 100, 0, 200)).toBe(100);
      expect(map(0, 0, 100, 0, 200)).toBe(0);
      expect(map(100, 0, 100, 0, 200)).toBe(200);
    });

    it('should handle different output ranges', () => {
      expect(map(50, 0, 100, -100, 100)).toBe(0);
      expect(map(25, 0, 100, 0, 10)).toBe(2.5);
    });
  });

  describe('clamp', () => {
    it('should clamp value within range', () => {
      expect(clamp(50, 0, 100)).toBe(50);
      expect(clamp(-10, 0, 100)).toBe(0);
      expect(clamp(150, 0, 100)).toBe(100);
    });
  });

  describe('distance', () => {
    it('should calculate distance between two points', () => {
      expect(distance(0, 0, 3, 4)).toBe(5);
      expect(distance(0, 0, 0, 0)).toBe(0);
      expect(distance(1, 1, 4, 5)).toBe(5);
    });
  });

  describe('vectorLength', () => {
    it('should calculate vector length', () => {
      expect(vectorLength(3, 4)).toBe(5);
      expect(vectorLength(0, 0)).toBe(0);
      expect(vectorLength(1, 2, 2)).toBe(3);
    });
  });

  describe('calculateAudioEnergy', () => {
    it('should calculate audio energy from data array', () => {
      const dataArray = new Uint8Array([0, 128, 255, 128, 0]);
      const energy = calculateAudioEnergy(dataArray);
      expect(energy).toBeGreaterThan(0);
      expect(energy).toBeLessThanOrEqual(1);
    });

    it('should return 0 for silent audio', () => {
      const dataArray = new Uint8Array(10).fill(0);
      expect(calculateAudioEnergy(dataArray)).toBe(0);
    });
  });

  describe('calculateFrequencyBands', () => {
    it('should calculate frequency bands', () => {
      const dataArray = new Uint8Array(100).fill(128);
      const bands = calculateFrequencyBands(dataArray);

      expect(bands).toHaveProperty('bass');
      expect(bands).toHaveProperty('mids');
      expect(bands).toHaveProperty('treble');

      expect(bands.bass).toBeCloseTo(0.5, 1);
      expect(bands.mids).toBeCloseTo(0.5, 1);
      expect(bands.treble).toBeCloseTo(0.5, 1);
    });

    it('should handle varying frequency data', () => {
      const dataArray = new Uint8Array(100);
      dataArray.fill(255, 0, 10);
      dataArray.fill(128, 10, 50);
      dataArray.fill(0, 50, 100);

      const bands = calculateFrequencyBands(dataArray);

      expect(bands.bass).toBeGreaterThan(bands.mids);
      expect(bands.mids).toBeGreaterThan(bands.treble);
    });
  });

  describe('smoothValue', () => {
    it('should smooth value towards target', () => {
      expect(smoothValue(0, 100, 0.5)).toBe(50);
      expect(smoothValue(0, 100, 0.1)).toBe(10);
      expect(smoothValue(50, 100, 0.5)).toBe(75);
    });

    it('should handle smoothing factor of 1', () => {
      expect(smoothValue(0, 100, 1)).toBe(100);
    });

    it('should handle smoothing factor of 0', () => {
      expect(smoothValue(50, 100, 0)).toBe(50);
    });
  });

  describe('noise', () => {
    it('should return value between 0 and 1', () => {
      const result = noise(1, 2, 3);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(1);
    });

    it('should be deterministic', () => {
      expect(noise(1, 2, 3)).toBe(noise(1, 2, 3));
    });
  });

  describe('isPointInRect', () => {
    it('should return true when point is inside rectangle', () => {
      expect(isPointInRect(50, 50, 0, 0, 100, 100)).toBe(true);
      expect(isPointInRect(0, 0, 0, 0, 100, 100)).toBe(true);
      expect(isPointInRect(100, 100, 0, 0, 100, 100)).toBe(true);
    });

    it('should return false when point is outside rectangle', () => {
      expect(isPointInRect(-1, 50, 0, 0, 100, 100)).toBe(false);
      expect(isPointInRect(50, -1, 0, 0, 100, 100)).toBe(false);
      expect(isPointInRect(101, 50, 0, 0, 100, 100)).toBe(false);
      expect(isPointInRect(50, 101, 0, 0, 100, 100)).toBe(false);
    });
  });

  describe('calculateBoundingBox', () => {
    it('should calculate bounding box for multiple points', () => {
      const points = [
        { x: 10, y: 20 },
        { x: 50, y: 30 },
        { x: 30, y: 60 }
      ] as any[];

      const bbox = calculateBoundingBox(points);

      expect(bbox.minX).toBe(10);
      expect(bbox.minY).toBe(20);
      expect(bbox.maxX).toBe(50);
      expect(bbox.maxY).toBe(60);
      expect(bbox.width).toBe(40);
      expect(bbox.height).toBe(40);
    });

    it('should handle empty array', () => {
      const bbox = calculateBoundingBox([]);

      expect(bbox.minX).toBe(0);
      expect(bbox.minY).toBe(0);
      expect(bbox.maxX).toBe(0);
      expect(bbox.maxY).toBe(0);
      expect(bbox.width).toBe(0);
      expect(bbox.height).toBe(0);
    });

    it('should handle single point', () => {
      const points = [{ x: 25, y: 50 }] as any[];
      const bbox = calculateBoundingBox(points);

      expect(bbox.minX).toBe(25);
      expect(bbox.minY).toBe(50);
      expect(bbox.maxX).toBe(25);
      expect(bbox.maxY).toBe(50);
      expect(bbox.width).toBe(0);
      expect(bbox.height).toBe(0);
    });
  });
});
