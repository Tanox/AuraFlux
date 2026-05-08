// src/utils/tests/lyricsUtils.test.ts v2.3.10
import { parseLrc } from '../../utils/lyricsUtils';

describe('lyricsUtils', () => {
  describe('parseLrc', () => {
    it('should parse standard LRC format with minutes and seconds', () => {
      const lrc = '[00:12]Hello World\n[00:24]This is a test';
      const result = parseLrc(lrc);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ time: 12, text: 'Hello World' });
      expect(result[1]).toEqual({ time: 24, text: 'This is a test' });
    });

    it('should parse LRC with milliseconds', () => {
      const lrc = '[01:30:500]First line\n[02:15:250]Second line';
      const result = parseLrc(lrc);
      expect(result[0].time).toBe(90.5);
      expect(result[1].time).toBe(135.25);
    });

    it('should handle different line endings', () => {
      const lrc = '[00:10]Line 1\r\n[00:20]Line 2\r[00:30]Line 3';
      const result = parseLrc(lrc);
      expect(result).toHaveLength(3);
    });

    it('should sort lyrics by time', () => {
      const lrc = '[01:00]Third\n[00:10]First\n[00:30]Second';
      const result = parseLrc(lrc);
      expect(result[0].text).toBe('First');
      expect(result[1].text).toBe('Second');
      expect(result[2].text).toBe('Third');
    });

    it('should ignore empty text lines', () => {
      const lrc = '[00:10]Hello\n[00:20]\n[00:30]World';
      const result = parseLrc(lrc);
      expect(result).toHaveLength(2);
    });

    it('should trim whitespace from text', () => {
      const lrc = '[00:10]   Hello World   ';
      const result = parseLrc(lrc);
      expect(result[0].text).toBe('Hello World');
    });

    it('should return empty array for invalid LRC', () => {
      const lrc = 'No timestamps here\nJust plain text';
      const result = parseLrc(lrc);
      expect(result).toHaveLength(0);
    });

    it('should handle empty input', () => {
      const result = parseLrc('');
      expect(result).toHaveLength(0);
    });

    it('should handle LRC with metadata tags', () => {
      const lrc = '[ti:Test Song]\n[ar:Test Artist]\n[00:10]Hello World';
      const result = parseLrc(lrc);
      expect(result).toHaveLength(1);
      expect(result[0].text).toBe('Hello World');
    });
  });
});
