// File: test/services/aiService.test.ts

import { 
  blobToBase64, 
  isAiServiceAvailable, 
  checkAiServiceAvailability, 
  generateVisualConfigFromAudio, 
  generateArtisticBackground, 
  identifySong 
} from '@/services/aiService';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch as any;

// Mock i18n
jest.mock('@/i18n', () => ({
  t: jest.fn((key) => {
    if (key === 'toasts.aiDirectorReq') {
      return 'AI service unavailable. Please check configuration.';
    }
    return key;
  }),
}));

// Mock logger
jest.mock('@/utils/logger', () => ({
  logger: {
    warn: jest.fn(),
  },
}));

// Mock FileReader
class MockFileReader {
  result: string | ArrayBuffer | null = null;
  onloadend: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;
  onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;

  readAsDataURL(blob: Blob) {
    // Simulate successful read
    setTimeout(() => {
      this.result = 'data:audio/wav;base64,test-base64-data';
      if (this.onloadend) {
        this.onloadend({} as ProgressEvent<FileReader>);
      }
    }, 0);
  }
}

Object.defineProperty(window, 'FileReader', {
  value: MockFileReader,
  writable: true,
});

describe('aiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('blobToBase64 should convert blob to base64 string', async () => {
    const mockBlob = new Blob(['test audio data'], { type: 'audio/wav' });
    const result = await blobToBase64(mockBlob);
    expect(result).toBe('test-base64-data');
  });

  test('blobToBase64 should handle errors', async () => {
    // Mock FileReader to throw error
    class MockFileReaderError {
      onloadend: any = null;
      onerror: any = null;

      readAsDataURL() {
        setTimeout(() => {
          if (this.onerror) {
            this.onerror({} as ProgressEvent<FileReader>);
          }
        }, 0);
      }
    }

    Object.defineProperty(window, 'FileReader', {
      value: MockFileReaderError,
      writable: true,
    });

    const mockBlob = new Blob(['test audio data'], { type: 'audio/wav' });
    await expect(blobToBase64(mockBlob)).rejects.toThrow('Failed to read audio data');
  });

  test('isAiServiceAvailable should return true when service is available', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
    } as Response);

    const result = await isAiServiceAvailable();
    expect(result).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith('/api/gemini/health', {
      method: 'GET',
    });
  });

  test('isAiServiceAvailable should return false when service is unavailable', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await isAiServiceAvailable();
    expect(result).toBe(false);
  });

  test('checkAiServiceAvailability should return true when service is available', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
    } as Response);

    const mockOnError = jest.fn();
    const result = await checkAiServiceAvailability(mockOnError);
    expect(result).toBe(true);
    expect(mockOnError).not.toHaveBeenCalled();
  });

  test('checkAiServiceAvailability should return false and call error callback when service is unavailable', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const mockOnError = jest.fn();
    const result = await checkAiServiceAvailability(mockOnError, 'Custom error message');
    expect(result).toBe(false);
    expect(mockOnError).toHaveBeenCalledWith('Custom error message');
  });

  test('generateVisualConfigFromAudio should return data when successful', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: { visualConfig: 'test config' },
      }),
    };
    mockFetch.mockResolvedValueOnce(mockResponse as Response);

    const result = await generateVisualConfigFromAudio('test-base64');
    expect(result).toEqual({ visualConfig: 'test config' });
    expect(mockFetch).toHaveBeenCalledWith('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generateVisualConfig',
        data: { audio: 'test-base64' },
      }),
    });
  });

  test('generateVisualConfigFromAudio should return null when failed', async () => {
    const mockResponse = {
      ok: false,
      json: jest.fn().mockResolvedValue({ error: 'API error' }),
    };
    mockFetch.mockResolvedValueOnce(mockResponse as Response);

    const result = await generateVisualConfigFromAudio('test-base64');
    expect(result).toBe(null);
  });

  test('generateArtisticBackground should return data when successful', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: 'test-image-url',
      }),
    };
    mockFetch.mockResolvedValueOnce(mockResponse as Response);

    const result = await generateArtisticBackground('test prompt');
    expect(result).toBe('test-image-url');
    expect(mockFetch).toHaveBeenCalledWith('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generateBackground',
        data: { prompt: 'test prompt' },
      }),
    });
  });

  test('generateArtisticBackground should return null when failed', async () => {
    const mockResponse = {
      ok: false,
      json: jest.fn().mockResolvedValue({ error: 'API error' }),
    };
    mockFetch.mockResolvedValueOnce(mockResponse as Response);

    const result = await generateArtisticBackground('test prompt');
    expect(result).toBe(null);
  });

  test('identifySong should return data when successful', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: { songName: 'Test Song', artist: 'Test Artist' },
      }),
    };
    mockFetch.mockResolvedValueOnce(mockResponse as Response);

    const mockBlob = new Blob(['test audio data'], { type: 'audio/wav' });
    const result = await identifySong(mockBlob);
    expect(result).toEqual({ songName: 'Test Song', artist: 'Test Artist' });
  });

  test('identifySong should return null when failed', async () => {
    const mockResponse = {
      ok: false,
      json: jest.fn().mockResolvedValue({ error: 'API error' }),
    };
    mockFetch.mockResolvedValueOnce(mockResponse as Response);

    const mockBlob = new Blob(['test audio data'], { type: 'audio/wav' });
    const result = await identifySong(mockBlob);
    expect(result).toBe(null);
  });
});
