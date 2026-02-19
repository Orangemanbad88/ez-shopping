import { useState, useRef, useCallback } from 'react';
import { loadSegmentationModel, segmentFrame, extractZonesFromSegmentation, isModelLoaded } from '../lib/segmentation';

export const useZoneDetection = () => {
  const [modelStatus, setModelStatus] = useState('idle'); // idle | loading | ready | error
  const [aiZones, setAiZones] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const scanIntervalRef = useRef(null);

  const initModel = useCallback(async () => {
    if (isModelLoaded()) {
      setModelStatus('ready');
      return;
    }
    try {
      setModelStatus('loading');
      await loadSegmentationModel((msg) => {
        if (msg === 'Ready') setModelStatus('ready');
      });
      setModelStatus('ready');
    } catch {
      setModelStatus('error');
    }
  }, []);

  const scanFrame = useCallback(async (videoElement) => {
    if (!videoElement || videoElement.videoWidth === 0) return;
    setIsScanning(true);
    try {
      const result = await segmentFrame(videoElement);
      if (result) {
        const zones = extractZonesFromSegmentation(
          result,
          videoElement.videoWidth,
          videoElement.videoHeight
        );
        if (zones.length > 0) {
          setAiZones(zones);
        }
      }
    } catch {
      // silently fail — next scan will try again
    }
    setIsScanning(false);
  }, []);

  const startContinuousScanning = useCallback((videoElement) => {
    if (scanIntervalRef.current) return;
    // Immediate first scan
    scanFrame(videoElement);
    // Then every 3 seconds
    scanIntervalRef.current = setInterval(() => {
      scanFrame(videoElement);
    }, 3000);
  }, [scanFrame]);

  const stopContinuousScanning = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setIsScanning(false);
  }, []);

  const resetZones = useCallback(() => {
    setAiZones([]);
  }, []);

  return {
    modelStatus,
    aiZones,
    isScanning,
    initModel,
    scanFrame,
    startContinuousScanning,
    stopContinuousScanning,
    resetZones,
  };
};
