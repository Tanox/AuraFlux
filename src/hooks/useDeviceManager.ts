// src/hooks/useDeviceManager.ts v2.3.10
import { useState, useCallback, useEffect } from 'react';
import { AudioDevice } from '@/types';
import { DeviceService } from '@/services/deviceService';

interface UseDeviceManagerReturn {
  devices: AudioDevice[];
  selectedDeviceId: string;
  isEnumerating: boolean;
  selectDevice: (deviceId: string) => void;
  refreshDevices: () => Promise<void>;
}

export function useDeviceManager(): UseDeviceManagerReturn {
  const [devices, setDevices] = useState<AudioDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [isEnumerating, setIsEnumerating] = useState(false);

  useEffect(() => {
    const loadDevices = async () => {
      setIsEnumerating(true);
      try {
        const deviceList = await DeviceService.enumerateDevices();
        setDevices(deviceList);
      } finally {
        setIsEnumerating(false);
      }
    };

    loadDevices();

    const unsubscribe = DeviceService.addListener((newDevices) => {
      setDevices(newDevices);
    });

    return unsubscribe;
  }, []);

  const selectDevice = useCallback((deviceId: string) => {
    DeviceService.selectDevice(deviceId);
    setSelectedDeviceId(deviceId);
  }, []);

  const refreshDevices = useCallback(async () => {
    setIsEnumerating(true);
    try {
      const deviceList = await DeviceService.enumerateDevices(true);
      setDevices(deviceList);
    } finally {
      setIsEnumerating(false);
    }
  }, []);

  return {
    devices,
    selectedDeviceId,
    isEnumerating,
    selectDevice,
    refreshDevices
  };
}
