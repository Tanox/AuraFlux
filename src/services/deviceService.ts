// src/services/deviceService.ts v2.3.8
import { AudioDevice } from '@/types';
import { logger } from '@/utils/logger';

type DeviceChangeListener = (devices: AudioDevice[]) => void;

interface DeviceServiceState {
  devices: AudioDevice[];
  selectedDeviceId: string;
  isEnumerating: boolean;
  lastEnumerated: number | null;
}

class DeviceServiceImpl {
  private static instance: DeviceServiceImpl | null = null;
  private state: DeviceServiceState = {
    devices: [],
    selectedDeviceId: '',
    isEnumerating: false,
    lastEnumerated: null
  };
  private listeners: Set<DeviceChangeListener> = new Set();
  private enumeratePromise: Promise<AudioDevice[]> | null = null;

  private constructor() {
    this.setupDeviceChangeListener();
  }

  static getInstance(): DeviceServiceImpl {
    if (!DeviceServiceImpl.instance) {
      DeviceServiceImpl.instance = new DeviceServiceImpl();
    }
    return DeviceServiceImpl.instance;
  }

  private setupDeviceChangeListener(): void {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
      navigator.mediaDevices.addEventListener('devicechange', () => {
        this.enumerateDevices().catch(err => {
          logger.warn('Device change handler error:', err);
        });
      });
    }
  }

  async enumerateDevices(forceRefresh = false): Promise<AudioDevice[]> {
    const now = Date.now();
    const cacheValid = this.state.lastEnumerated && 
      (now - this.state.lastEnumerated) < 5000 && 
      this.state.devices.length > 0 &&
      !forceRefresh;

    if (cacheValid && !forceRefresh) {
      return this.state.devices;
    }

    if (this.enumeratePromise && !forceRefresh) {
      return this.enumeratePromise;
    }

    this.state.isEnumerating = true;

    this.enumeratePromise = this.performEnumeration();
    
    try {
      const devices = await this.enumeratePromise;
      return devices;
    } finally {
      this.state.isEnumerating = false;
      this.enumeratePromise = null;
    }
  }

  private async performEnumeration(): Promise<AudioDevice[]> {
    try {
      const rawDevices = await navigator.mediaDevices.enumerateDevices();
      const audioDevices: AudioDevice[] = rawDevices
        .filter(d => d.kind === 'audioinput')
        .map(d => ({
          deviceId: d.deviceId,
          label: d.label || `Microphone ${d.deviceId.slice(0, 5)}`
        }));

      this.state.devices = audioDevices;
      this.state.lastEnumerated = Date.now();

      this.notifyListeners();

      return audioDevices;
    } catch (err: any) {
      logger.warn('Failed to enumerate devices:', err?.message || err);
      return this.state.devices;
    }
  }

  getDevices(): AudioDevice[] {
    return this.state.devices;
  }

  getSelectedDeviceId(): string {
    return this.state.selectedDeviceId;
  }

  selectDevice(deviceId: string): void {
    this.state.selectedDeviceId = deviceId;
  }

  isEnumeratingDevices(): boolean {
    return this.state.isEnumerating;
  }

  addListener(listener: DeviceChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.state.devices);
      } catch (err) {
        logger.warn('Device listener error:', err);
      }
    });
  }

  async requestMicrophoneAccess(deviceId?: string): Promise<MediaStream | null> {
    try {
      const constraints: MediaStreamConstraints = deviceId 
        ? { audio: { deviceId: { exact: deviceId } } }
        : { audio: true };
      
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err: any) {
      logger.warn('Microphone access error:', err?.message || err);
      return null;
    }
  }
}

export const DeviceService = DeviceServiceImpl.getInstance();
