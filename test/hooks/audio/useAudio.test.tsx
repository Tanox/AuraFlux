'use client';
// File: test/hooks/audio/useAudio.test.tsx

import { renderHook, act } from '@testing-library/react';
import { useAudio } from '@/hooks/audio/useAudio';
import { useMicrophoneManager } from '@/hooks/audio/microphoneManager';
import { useFilePlayer } from '@/hooks/audio/filePlayer';

// Mock dependencies
jest.mock('@/hooks/audio/microphoneManager');
jest.mock('@/hooks/audio/filePlayer');

const mockUseMicrophoneManager = useMicrophoneManager as jest.MockedFunction<typeof useMicrophoneManager>;
const mockUseFilePlayer = useFilePlayer as jest.MockedFunction<typeof useFilePlayer>;

describe('useAudio', () => {
  const mockSettings = { audio: { sensitivity: 1.0 } };
  const mockLanguage = 'en';
  const mockSetCurrentSong = jest.fn();
  const mockShowToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock microphone manager
    mockUseMicrophoneManager.mockReturnValue({
      isListening: false,
      mediaStream: null,
      audioDevices: [],
      selectedDeviceId: '',
      toggleMicrophone: jest.fn(),
      onDeviceChange: jest.fn(),
      audioContext: null,
      analyser: null,
    });

    // Mock file player
    mockUseFilePlayer.mockReturnValue({
      playlist: [],
      currentIndex: -1,
      playbackMode: 'SHUFFLE',
      setPlaybackMode: jest.fn(),
      isPlaying: false,
      duration: 0,
      currentTime: 0,
      analyser: null,
      analyserR: null,
      audioContext: null,
      importFiles: jest.fn(),
      importFromUrl: jest.fn(),
      importPlaylistFromUrl: jest.fn(),
      togglePlayback: jest.fn(),
      seekFile: jest.fn(),
      playNext: jest.fn(),
      playPrev: jest.fn(),
      playTrackByIndex: jest.fn(),
      removeFromPlaylist: jest.fn(),
      clearPlaylist: jest.fn(),
      getAudioSlice: jest.fn(),
    });
  });

  test('should initialize with default state', () => {
    const { result } = renderHook(() => 
      useAudio({ 
        settings: mockSettings, 
        language: mockLanguage, 
        setCurrentSong: mockSetCurrentSong, 
        showToast: mockShowToast 
      })
    );

    expect(result.current.sourceType).toBe('microphone');
    expect(result.current.isPending).toBe(false);
    expect(result.current.isListening).toBe(false);
    expect(result.current.playlist).toEqual([]);
  });

  test('should switch source type', () => {
    const { result } = renderHook(() => 
      useAudio({ 
        settings: mockSettings, 
        language: mockLanguage, 
        setCurrentSong: mockSetCurrentSong, 
        showToast: mockShowToast 
      })
    );

    expect(result.current.sourceType).toBe('microphone');

    act(() => {
      result.current.handleSourceTypeChange('file');
    });

    expect(result.current.sourceType).toBe('file');

    act(() => {
      result.current.handleSourceTypeChange('url');
    });

    expect(result.current.sourceType).toBe('url');
  });

  test('should use microphone analyser when source type is microphone', () => {
    const mockMicAnalyser = {} as AnalyserNode;
    const mockFileAnalyser = {} as AnalyserNode;

    mockUseMicrophoneManager.mockReturnValue({
      isListening: true,
      mediaStream: null,
      audioDevices: [],
      selectedDeviceId: '',
      toggleMicrophone: jest.fn(),
      onDeviceChange: jest.fn(),
      audioContext: null,
      analyser: mockMicAnalyser,
    });

    mockUseFilePlayer.mockReturnValue({
      playlist: [],
      currentIndex: -1,
      playbackMode: 'SHUFFLE',
      setPlaybackMode: jest.fn(),
      isPlaying: false,
      duration: 0,
      currentTime: 0,
      analyser: mockFileAnalyser,
      analyserR: null,
      audioContext: null,
      importFiles: jest.fn(),
      importFromUrl: jest.fn(),
      importPlaylistFromUrl: jest.fn(),
      togglePlayback: jest.fn(),
      seekFile: jest.fn(),
      playNext: jest.fn(),
      playPrev: jest.fn(),
      playTrackByIndex: jest.fn(),
      removeFromPlaylist: jest.fn(),
      clearPlaylist: jest.fn(),
      getAudioSlice: jest.fn(),
    });

    const { result } = renderHook(() => 
      useAudio({ 
        settings: mockSettings, 
        language: mockLanguage, 
        setCurrentSong: mockSetCurrentSong, 
        showToast: mockShowToast 
      })
    );

    expect(result.current.sourceType).toBe('microphone');
    expect(result.current.analyser).toBe(mockMicAnalyser);
  });

  test('should use file analyser when source type is file', () => {
    const mockMicAnalyser = {} as AnalyserNode;
    const mockFileAnalyser = {} as AnalyserNode;

    mockUseMicrophoneManager.mockReturnValue({
      isListening: false,
      mediaStream: null,
      audioDevices: [],
      selectedDeviceId: '',
      toggleMicrophone: jest.fn(),
      onDeviceChange: jest.fn(),
      audioContext: null,
      analyser: mockMicAnalyser,
    });

    mockUseFilePlayer.mockReturnValue({
      playlist: [],
      currentIndex: -1,
      playbackMode: 'SHUFFLE',
      setPlaybackMode: jest.fn(),
      isPlaying: false,
      duration: 0,
      currentTime: 0,
      analyser: mockFileAnalyser,
      analyserR: null,
      audioContext: null,
      importFiles: jest.fn(),
      importFromUrl: jest.fn(),
      importPlaylistFromUrl: jest.fn(),
      togglePlayback: jest.fn(),
      seekFile: jest.fn(),
      playNext: jest.fn(),
      playPrev: jest.fn(),
      playTrackByIndex: jest.fn(),
      removeFromPlaylist: jest.fn(),
      clearPlaylist: jest.fn(),
      getAudioSlice: jest.fn(),
    });

    const { result } = renderHook(() => 
      useAudio({ 
        settings: mockSettings, 
        language: mockLanguage, 
        setCurrentSong: mockSetCurrentSong, 
        showToast: mockShowToast 
      })
    );

    act(() => {
      result.current.handleSourceTypeChange('file');
    });

    expect(result.current.sourceType).toBe('file');
    expect(result.current.analyser).toBe(mockFileAnalyser);
  });

  test('should pass through file player methods', () => {
    const mockImportFiles = jest.fn();
    const mockTogglePlayback = jest.fn();

    mockUseFilePlayer.mockReturnValue({
      playlist: [],
      currentIndex: -1,
      playbackMode: 'SHUFFLE',
      setPlaybackMode: jest.fn(),
      isPlaying: false,
      duration: 0,
      currentTime: 0,
      analyser: null,
      analyserR: null,
      audioContext: null,
      importFiles: mockImportFiles,
      importFromUrl: jest.fn(),
      importPlaylistFromUrl: jest.fn(),
      togglePlayback: mockTogglePlayback,
      seekFile: jest.fn(),
      playNext: jest.fn(),
      playPrev: jest.fn(),
      playTrackByIndex: jest.fn(),
      removeFromPlaylist: jest.fn(),
      clearPlaylist: jest.fn(),
      getAudioSlice: jest.fn(),
    });

    const { result } = renderHook(() => 
      useAudio({ 
        settings: mockSettings, 
        language: mockLanguage, 
        setCurrentSong: mockSetCurrentSong, 
        showToast: mockShowToast 
      })
    );

    const mockFiles = [new File(['audio'], 'test.mp3', { type: 'audio/mpeg' })];
    act(() => {
      result.current.importFiles(mockFiles);
    });

    expect(mockImportFiles).toHaveBeenCalledWith(mockFiles);

    act(() => {
      result.current.togglePlayback();
    });

    expect(mockTogglePlayback).toHaveBeenCalled();
  });

  test('should pass through microphone manager methods', () => {
    const mockToggleMicrophone = jest.fn();
    const mockOnDeviceChange = jest.fn();

    mockUseMicrophoneManager.mockReturnValue({
      isListening: false,
      mediaStream: null,
      audioDevices: [],
      selectedDeviceId: '',
      toggleMicrophone: mockToggleMicrophone,
      onDeviceChange: mockOnDeviceChange,
      audioContext: null,
      analyser: null,
    });

    const { result } = renderHook(() => 
      useAudio({ 
        settings: mockSettings, 
        language: mockLanguage, 
        setCurrentSong: mockSetCurrentSong, 
        showToast: mockShowToast 
      })
    );

    const mockDeviceId = 'test-device-id';
    act(() => {
      result.current.toggleMicrophone(mockDeviceId);
    });

    expect(mockToggleMicrophone).toHaveBeenCalledWith(mockDeviceId);

    act(() => {
      result.current.onDeviceChange(mockDeviceId);
    });

    expect(mockOnDeviceChange).toHaveBeenCalledWith(mockDeviceId);
  });
});
