'use client';
// File: test/hooks/audio/filePlayer.test.tsx

import { renderHook, act } from '@testing-library/react';
import { useFilePlayer } from '@/hooks/audio/filePlayer';
import { PlaybackMode } from '@/types';

// Mock AudioContext
class MockAudioContext {
  createMediaElementSource = jest.fn(() => ({
    connect: jest.fn(),
  }));
  createAnalyser = jest.fn(() => ({
    fftSize: 2048,
    disconnect: jest.fn(),
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

// Mock document.createElement
const mockCreateElement = jest.fn((tagName: string) => {
  if (tagName === 'audio') {
    return {
      src: '',
      crossOrigin: '',
      currentTime: 0,
      duration: 100,
      play: jest.fn().mockResolvedValue(undefined),
      pause: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      srcObject: null,
      error: null,
      // Add missing properties that might be accessed
      volume: 1,
      muted: false,
      loop: false,
      preload: 'auto',
      controls: false,
    };
  }
  return {};
});
Object.defineProperty(document, 'createElement', {
  value: mockCreateElement,
  writable: true,
});

// Mock URL.createObjectURL
Object.defineProperty(URL, 'createObjectURL', {
  value: jest.fn((file) => `blob:${file.name}`),
  writable: true,
});

describe('useFilePlayer', () => {
  const mockSetCurrentSong = jest.fn();
  const mockShowToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock audio element
    const mockAudio = {
      src: '',
      crossOrigin: '',
      currentTime: 0,
      duration: 100,
      play: jest.fn().mockResolvedValue(undefined),
      pause: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      srcObject: null,
      error: null,
    };

    mockCreateElement.mockReturnValue(mockAudio);
  });

  test('should initialize with default state', () => {
    const { result } = renderHook(() => useFilePlayer({ setCurrentSong: mockSetCurrentSong, showToast: mockShowToast }));

    expect(result.current.playlist).toEqual([]);
    expect(result.current.currentIndex).toBe(-1);
    expect(result.current.playbackMode).toBe(PlaybackMode.SHUFFLE);
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.duration).toBe(0);
    expect(result.current.currentTime).toBe(0);
    expect(result.current.analyser).toBe(null);
    expect(result.current.analyserR).toBe(null);
    expect(result.current.audioContext).toBe(null);
  });

  test('should import files and add to playlist', async () => {
    const mockFiles = [
      new File(['audio1'], 'song1.mp3', { type: 'audio/mpeg' }),
      new File(['audio2'], 'song2.mp3', { type: 'audio/mpeg' }),
    ];

    const { result } = renderHook(() => useFilePlayer({ setCurrentSong: mockSetCurrentSong, showToast: mockShowToast }));

    await act(async () => {
      await result.current.importFiles(mockFiles);
    });

    expect(result.current.playlist.length).toBe(2);
    expect(result.current.playlist[0].title).toBe('song1.mp3');
    expect(result.current.playlist[1].title).toBe('song2.mp3');
    expect(mockShowToast).toHaveBeenCalledWith('Added 2 tracks to playlist');
  });

  test('should import from URL and add to playlist', async () => {
    const testUrl = 'https://example.com/song.mp3';

    const { result } = renderHook(() => useFilePlayer({ setCurrentSong: mockSetCurrentSong, showToast: mockShowToast }));

    let importedTrack;
    await act(async () => {
      importedTrack = await result.current.importFromUrl(testUrl);
    });

    expect(result.current.playlist.length).toBe(1);
    expect(result.current.playlist[0].url).toBe(testUrl);
    expect(importedTrack?.url).toBe(testUrl);
  });

  test('should handle invalid URL import', async () => {
    const invalidUrl = 'invalid-url';

    const { result } = renderHook(() => useFilePlayer({ setCurrentSong: mockSetCurrentSong, showToast: mockShowToast }));

    await expect(result.current.importFromUrl(invalidUrl)).rejects.toThrow();
    expect(mockShowToast).toHaveBeenCalledWith('Invalid URL', 'error');
  });

  test('should play track by index', async () => {
    const mockFiles = [
      new File(['audio1'], 'song1.mp3', { type: 'audio/mpeg' }),
    ];

    const { result } = renderHook(() => useFilePlayer({ setCurrentSong: mockSetCurrentSong, showToast: mockShowToast }));

    // Import file
    await act(async () => {
      await result.current.importFiles(mockFiles);
    });

    // Play track
    await act(async () => {
      result.current.playTrackByIndex(0);
    });

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.isPlaying).toBe(true);
    expect(mockSetCurrentSong).toHaveBeenCalledWith({
      title: 'song1.mp3',
      artist: 'Unknown',
      album: 'Unknown',
      coverArt: null,
    });
  });

  test('should toggle playback', async () => {
    const mockFiles = [
      new File(['audio1'], 'song1.mp3', { type: 'audio/mpeg' }),
    ];

    const { result } = renderHook(() => useFilePlayer({ setCurrentSong: mockSetCurrentSong, showToast: mockShowToast }));

    // Import file and play
    await act(async () => {
      await result.current.importFiles(mockFiles);
      result.current.playTrackByIndex(0);
    });

    expect(result.current.isPlaying).toBe(true);

    // Pause
    act(() => {
      result.current.togglePlayback();
    });

    expect(result.current.isPlaying).toBe(false);

    // Play again
    act(() => {
      result.current.togglePlayback();
    });

    expect(result.current.isPlaying).toBe(true);
  });

  test('should seek to specific time', () => {
    const { result } = renderHook(() => useFilePlayer({ setCurrentSong: mockSetCurrentSong, showToast: mockShowToast }));

    act(() => {
      result.current.seekFile(30);
    });

    expect(result.current.currentTime).toBe(30);
  });

  test('should remove track from playlist', async () => {
    const mockFiles = [
      new File(['audio1'], 'song1.mp3', { type: 'audio/mpeg' }),
      new File(['audio2'], 'song2.mp3', { type: 'audio/mpeg' }),
    ];

    const { result } = renderHook(() => useFilePlayer({ setCurrentSong: mockSetCurrentSong, showToast: mockShowToast }));

    // Import files
    await act(async () => {
      await result.current.importFiles(mockFiles);
    });

    expect(result.current.playlist.length).toBe(2);

    // Remove first track
    act(() => {
      result.current.removeFromPlaylist(0);
    });

    expect(result.current.playlist.length).toBe(1);
    expect(result.current.playlist[0].title).toBe('song2.mp3');
  });

  test('should clear playlist', () => {
    const mockFiles = [
      new File(['audio1'], 'song1.mp3', { type: 'audio/mpeg' }),
    ];

    const { result } = renderHook(() => useFilePlayer({ setCurrentSong: mockSetCurrentSong, showToast: mockShowToast }));

    // Import file
    act(() => {
      result.current.importFiles(mockFiles);
    });

    expect(result.current.playlist.length).toBe(1);

    // Clear playlist
    act(() => {
      result.current.clearPlaylist();
    });

    expect(result.current.playlist).toEqual([]);
    expect(result.current.currentIndex).toBe(-1);
    expect(result.current.isPlaying).toBe(false);
    expect(mockSetCurrentSong).toHaveBeenCalledWith(null);
  });

  test('should set playback mode', () => {
    const { result } = renderHook(() => useFilePlayer({ setCurrentSong: mockSetCurrentSong, showToast: mockShowToast }));

    act(() => {
      result.current.setPlaybackMode(PlaybackMode.LOOP);
    });

    expect(result.current.playbackMode).toBe(PlaybackMode.LOOP);
  });

  test('should get audio slice', async () => {
    const { result } = renderHook(() => useFilePlayer({ setCurrentSong: mockSetCurrentSong, showToast: mockShowToast }));

    const slice = await result.current.getAudioSlice(10);
    expect(slice).toBe(null);
  });
});
