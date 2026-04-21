// File: test/utils/audioUtils.test.ts

import { getAverage, getAudioSlice, audioBufferToWav } from '@/services/audioUtils';

// Mock AudioContext and OfflineAudioContext
class MockAudioContext {
  sampleRate = 44100;
  decodeAudioData = jest.fn().mockResolvedValue({
    numberOfChannels: 1,
    length: 44100,
    sampleRate: 44100,
    getChannelData: jest.fn().mockReturnValue(new Float32Array(44100)),
  });
}

class MockOfflineAudioContext {
  constructor(channels: number, length: number, sampleRate: number) {
    // Initialize
  }
  createBufferSource = jest.fn().mockReturnValue({
    buffer: null,
    connect: jest.fn(),
    start: jest.fn(),
  });
  startRendering = jest.fn().mockResolvedValue({
    numberOfChannels: 1,
    length: 44100,
    sampleRate: 44100,
    getChannelData: jest.fn().mockReturnValue(new Float32Array(44100)),
  });
  destination = {};
}

Object.defineProperty(window, 'AudioContext', {
  value: MockAudioContext,
  writable: true,
});

Object.defineProperty(window, 'OfflineAudioContext', {
  value: MockOfflineAudioContext,
  writable: true,
});

describe('audioUtils', () => {
  test('getAverage should calculate average of array', () => {
    const data = new Uint8Array([10, 20, 30, 40, 50]);
    const average = getAverage(data);
    expect(average).toBe(30);
  });

  test('getAverage should calculate average with start and end indices', () => {
    const data = new Uint8Array([10, 20, 30, 40, 50]);
    const average = getAverage(data, 1, 4);
    expect(average).toBe(30); // (20 + 30 + 40) / 3
  });

  test('getAverage should handle empty array', () => {
    const data = new Uint8Array([]);
    expect(() => getAverage(data)).toThrow();
  });

  test('getAudioSlice should return WAV blob', async () => {
    const mockFile = new File(['audio data'], 'test.wav', { type: 'audio/wav' });
    mockFile.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(1024));

    const result = await getAudioSlice(mockFile, 5);
    expect(result).toBeInstanceOf(Blob);
    expect(result?.type).toBe('audio/wav');
  });

  test('getAudioSlice should return null on error', async () => {
    const mockFile = new File(['audio data'], 'test.wav', { type: 'audio/wav' });
    mockFile.arrayBuffer = jest.fn().mockRejectedValue(new Error('Error reading file'));

    const result = await getAudioSlice(mockFile);
    expect(result).toBeNull();
  });

  test('audioBufferToWav should convert AudioBuffer to WAV blob', () => {
    const mockAudioBuffer = {
      numberOfChannels: 1,
      sampleRate: 44100,
      getChannelData: jest.fn().mockReturnValue(new Float32Array([0.1, -0.1, 0.5, -0.5])),
    } as unknown as AudioBuffer;

    const result = audioBufferToWav(mockAudioBuffer);
    expect(result).toBeInstanceOf(Blob);
    expect(result.type).toBe('audio/wav');
  });

  test('audioBufferToWav should handle stereo audio', () => {
    const mockAudioBuffer = {
      numberOfChannels: 2,
      sampleRate: 44100,
      getChannelData: jest.fn((channel) => {
        if (channel === 0) return new Float32Array([0.1, -0.1]);
        return new Float32Array([0.2, -0.2]);
      }),
    } as unknown as AudioBuffer;

    const result = audioBufferToWav(mockAudioBuffer);
    expect(result).toBeInstanceOf(Blob);
    expect(result.type).toBe('audio/wav');
  });
});
