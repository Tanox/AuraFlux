'use client';
// File: test/hooks/audio/microphoneManager.test.tsx

import { renderHook, act, waitFor } from '@testing-library/react';
import { useMicrophoneManager } from '@/hooks/audio/microphoneManager';

// Mock navigator.mediaDevices
const mockEnumerateDevices = jest.fn();
const mockGetUserMedia = jest.fn();

Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    enumerateDevices: mockEnumerateDevices,
    getUserMedia: mockGetUserMedia,
  },
  writable: true,
});

// Mock AudioContext
class MockAudioContext {
  createMediaStreamSource = jest.fn(() => ({
    connect: jest.fn(),
  }));
  createAnalyser = jest.fn(() => ({
    fftSize: 2048,
  }));
  close = jest.fn();
}

Object.defineProperty(window, 'AudioContext', {
  value: MockAudioContext,
  writable: true,
});

Object.defineProperty(window, 'webkitAudioContext', {
  value: MockAudioContext,
  writable: true,
});

describe('useMicrophoneManager', () => {
  const mockShowToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with default state', () => {
    const { result } = renderHook(() => useMicrophoneManager({ showToast: mockShowToast }));

    expect(result.current.isListening).toBe(false);
    expect(result.current.mediaStream).toBe(null);
    expect(result.current.audioDevices).toEqual([]);
    expect(result.current.selectedDeviceId).toBe('');
    expect(result.current.analyser).toBe(null);
    expect(result.current.audioContext).toBe(null);
  });

  test('should get audio devices on mount', async () => {
    const mockDevices = [
      { deviceId: '1', kind: 'audioinput', label: 'Microphone 1' },
      { deviceId: '2', kind: 'videoinput', label: 'Camera 1' },
      { deviceId: '3', kind: 'audioinput', label: '' },
    ];

    mockEnumerateDevices.mockResolvedValue(mockDevices);

    const { result } = renderHook(() => useMicrophoneManager({ showToast: mockShowToast }));

    await waitFor(() => {
      expect(mockEnumerateDevices).toHaveBeenCalled();
    });

    expect(result.current.audioDevices).toEqual([
      { deviceId: '1', label: 'Microphone 1' },
      { deviceId: '3', label: `Microphone ${'3'.slice(0, 5)}` },
    ]);
  });

  test('should handle get devices error', async () => {
    const mockError = new Error('Permission denied');
    mockEnumerateDevices.mockRejectedValue(mockError);

    const { result } = renderHook(() => useMicrophoneManager({ showToast: mockShowToast }));

    await waitFor(() => {
      expect(mockEnumerateDevices).toHaveBeenCalled();
    });
  });

  test('should start microphone when toggleMicrophone is called', async () => {
    const mockStream = {
      getTracks: jest.fn(() => [{
        stop: jest.fn(),
      }]),
    };

    mockGetUserMedia.mockResolvedValue(mockStream as unknown as MediaStream);

    const { result } = renderHook(() => useMicrophoneManager({ showToast: mockShowToast }));

    await act(async () => {
      await result.current.toggleMicrophone('1');
    });

    expect(mockGetUserMedia).toHaveBeenCalledWith({
      audio: { deviceId: { exact: '1' } },
    });
    expect(result.current.isListening).toBe(true);
    expect(result.current.mediaStream).toBe(mockStream);
    expect(result.current.selectedDeviceId).toBe('1');
    expect(result.current.analyser).not.toBe(null);
    expect(result.current.audioContext).not.toBe(null);
  });

  test('should stop microphone when toggleMicrophone is called while listening', async () => {
    const mockStream = {
      getTracks: jest.fn(() => [{
        stop: jest.fn(),
      }]),
    };

    mockGetUserMedia.mockResolvedValue(mockStream as unknown as MediaStream);

    const { result } = renderHook(() => useMicrophoneManager({ showToast: mockShowToast }));

    // Start microphone
    await act(async () => {
      await result.current.toggleMicrophone('1');
    });

    expect(result.current.isListening).toBe(true);

    // Stop microphone
    await act(async () => {
      await result.current.toggleMicrophone('1');
    });

    expect(result.current.isListening).toBe(false);
    expect(result.current.mediaStream).toBe(null);
  });

  test('should handle microphone access error', async () => {
    const mockError = new Error('Permission denied');
    mockGetUserMedia.mockRejectedValue(mockError);

    const { result } = renderHook(() => useMicrophoneManager({ showToast: mockShowToast }));

    await act(async () => {
      await result.current.toggleMicrophone('1');
    });

    expect(mockGetUserMedia).toHaveBeenCalled();
    expect(mockShowToast).toHaveBeenCalledWith('Microphone access denied. Running in silent mode.', 'error');
    expect(result.current.isListening).toBe(false);
  });

  test('should update selected device id when onDeviceChange is called', () => {
    const { result } = renderHook(() => useMicrophoneManager({ showToast: mockShowToast }));

    act(() => {
      result.current.onDeviceChange('2');
    });

    expect(result.current.selectedDeviceId).toBe('2');
  });
});
