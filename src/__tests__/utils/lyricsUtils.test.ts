/**
 * File: src/utils/lyricsUtils.test.ts
 * Version: v1.9.76
 */

import { parseLrc, LrcLine } from './lyricsUtils';

describe('lyricsUtils', () => {
  describe('parseLrc', () => {
    it('should parse basic LRC format correctly', () => {
      const lrc = '[00:00.00] Intro\n[00:05.12] Verse 1\n[00:10.34] Chorus';
      const result = parseLrc(lrc);
      
      expect(result).toEqual([
        { time: 0, text: 'Intro' },
        { time: 5.12, text: 'Verse 1' },
        { time: 10.34, text: 'Chorus' }
      ]);
    });

    it('should handle different time formats', () => {
      const lrc = '[01:23] Without milliseconds\n[02:34.56] With milliseconds\n[03:45.678] With 3-digit milliseconds';
      const result = parseLrc(lrc);
      
      expect(result).toEqual([
        { time: 83, text: 'Without milliseconds' },
        { time: 154.56, text: 'With milliseconds' },
        { time: 225.678, text: 'With 3-digit milliseconds' }
      ]);
    });

    it('should sort lyrics by time', () => {
      const lrc = '[00:10] Later\n[00:00] Earlier\n[00:05] Middle';
      const result = parseLrc(lrc);
      
      expect(result).toEqual([
        { time: 0, text: 'Earlier' },
        { time: 5, text: 'Middle' },
        { time: 10, text: 'Later' }
      ]);
    });

    it('should ignore empty lines and lines without text', () => {
      const lrc = '[00:00] Text\n[00:05]\n[00:10] More text';
      const result = parseLrc(lrc);
      
      expect(result).toEqual([
        { time: 0, text: 'Text' },
        { time: 10, text: 'More text' }
      ]);
    });

    it('should handle different line endings', () => {
      const lrc = '[00:00] Line 1\r\n[00:05] Line 2\r[00:10] Line 3';
      const result = parseLrc(lrc);
      
      expect(result).toEqual([
        { time: 0, text: 'Line 1' },
        { time: 5, text: 'Line 2' },
        { time: 10, text: 'Line 3' }
      ]);
    });

    it('should return empty array for invalid LRC', () => {
      const lrc = 'Invalid LRC content';
      const result = parseLrc(lrc);
      
      expect(result).toEqual([]);
    });

    it('should return empty array for empty string', () => {
      const lrc = '';
      const result = parseLrc(lrc);
      
      expect(result).toEqual([]);
    });
  });
});