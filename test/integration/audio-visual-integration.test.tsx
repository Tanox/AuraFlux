// File: test/integration/audio-visual-integration.test.tsx

import { renderHook, act } from '@testing-library/react';
import { useAudio } from '@/hooks/audio/useAudio';
import { useVisualsState } from '@/hooks/state/useVisualsState';

// Mock audio context and analyser
const mockAnalyser = {
  fftSize: 0,
  getByteFrequencyData: jest.fn((array) => {
    // Fill with mock data
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.random() * 255;
    }
  }),
  getByteTimeDomainData: jest.fn((array) => {
    // Fill with mock data
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.random() * 255;
    }
  }),
};

const mockAudioContext = {
  createAnalyser: jest.fn(() => mockAnalyser),
  createMediaElementSource: jest.fn(() => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
  })),
  createMediaStreamSource: jest.fn(() => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
  })),
};

// Mock window.AudioContext
global.AudioContext = jest.fn(() => mockAudioContext) as any;
global.webkitAudioContext = jest.fn(() => mockAudioContext) as any;

// Mock navigator.mediaDevices
navigator.mediaDevices = {
  getUserMedia: jest.fn().mockResolvedValue({} as MediaStream),
} as any;

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn((key) => {
    if (key === 'auraflux-color-theme') {
      return JSON.stringify('dark');
    }
    if (key === 'auraflux-visual-settings') {
      return JSON.stringify({
        showTooltips: true,
        showFPS: false,
        colorTheme: 'dark',
      });
    }
    return null;
  }),
  setItem: jest.fn(),
};
global.localStorage = mockLocalStorage as any;

describe('Audio-Visual Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should integrate audio analysis with visual state', async () => {
    // Mock props for useAudio
    const mockProps = {
      settings: { audio: { input: 'microphone' } },
      language: 'en',
      setCurrentSong: jest.fn(),
      showToast: jest.fn(),
    };

    // Render audio hook
    const { result: audioResult } = renderHook(() => useAudio(mockProps));

    // Render visuals state hook
    const { result: visualsResult, rerender } = renderHook(() => useVisualsState(true, {}));

    // Check if audio hook is initialized
    expect(audioResult.current.sourceType).toBe('microphone');

    // Check if visual state is initialized
    expect(visualsResult.current.mode).toBeDefined();
    expect(visualsResult.current.settings).toBeDefined();

    // Test visual mode change
    await act(async () => {
      visualsResult.current.setMode('PLASMA');
    });
    rerender();
    expect(visualsResult.current.mode).toBe('PLASMA');

    // Test audio source change
    await act(async () => {
      audioResult.current.handleSourceTypeChange('file');
    });
    expect(audioResult.current.sourceType).toBe('file');
  });

  test('should handle audio errors gracefully', async () => {
    // Mock props for useAudio
    const mockProps = {
      settings: { audio: { input: 'microphone' } },
      language: 'en',
      setCurrentSong: jest.fn(),
      showToast: jest.fn(),
    };

    // Mock getUserMedia to reject
    navigator.mediaDevices.getUserMedia = jest.fn().mockRejectedValue(new Error('Permission denied'));

    const { result } = renderHook(() => useAudio(mockProps));

    // Check if error is handled (microphone should not be listening)
    expect(result.current.isListening).toBe(false);
  });

  test('should update visual settings based on audio input', async () => {
    // Mock props for useAudio
    const mockProps = {
      settings: { audio: { input: 'microphone' } },
      language: 'en',
      setCurrentSong: jest.fn(),
      showToast: jest.fn(),
    };

    const { result: audioResult } = renderHook(() => useAudio(mockProps));
    const { result: visualsResult, rerender } = renderHook(() => useVisualsState(true, {}));

    // Test visual settings update
    await act(async () => {
      visualsResult.current.setSettings({ ...visualsResult.current.settings, showFps: true });
    });
    rerender();
    expect(visualsResult.current.settings.showFps).toBe(true);

    // Test audio source change
    await act(async () => {
      audioResult.current.handleSourceTypeChange('microphone');
    });
    expect(audioResult.current.sourceType).toBe('microphone');
  });
});
