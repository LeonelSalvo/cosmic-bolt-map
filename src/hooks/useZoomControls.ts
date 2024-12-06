import { useCallback, useState } from 'react';
import { ZOOM } from '../config/constellation';

interface ZoomState {
  scale: number;
  translate: { x: number; y: number };
}

export function useZoomControls(initialScale: number = 1) {
  const [zoomState, setZoomState] = useState<ZoomState>({
    scale: initialScale,
    translate: { x: 0, y: 0 }
  });

  const handleZoomIn = useCallback(() => {
    setZoomState(prev => ({
      ...prev,
      scale: Math.min(prev.scale * 1.2, ZOOM.MAX)
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomState(prev => ({
      ...prev,
      scale: Math.max(prev.scale / 1.2, ZOOM.MIN)
    }));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoomState({
      scale: 1,
      translate: { x: 0, y: 0 }
    });
  }, []);

  const handlePan = useCallback((dx: number, dy: number) => {
    setZoomState(prev => ({
      ...prev,
      translate: {
        x: prev.translate.x + dx,
        y: prev.translate.y + dy
      }
    }));
  }, []);

  return {
    zoomState,
    setZoomState,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    handlePan
  };
}