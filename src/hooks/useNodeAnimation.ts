import { useState, useCallback } from 'react';
import { ANIMATION } from '../config/constellation';

export function useNodeAnimation() {
  const [animationState, setAnimationState] = useState({
    isAnimating: false,
    currentLayer: 0,
    totalLayers: 0
  });

  const startNodeAnimation = useCallback((
    duration: number = ANIMATION.NODE_DELAY,
    onComplete?: () => void
  ) => {
    setAnimationState(prev => ({
      ...prev,
      isAnimating: true
    }));

    setTimeout(() => {
      setAnimationState(prev => ({
        ...prev,
        isAnimating: false
      }));
      onComplete?.();
    }, duration);
  }, []);

  const startLayerAnimation = useCallback((
    totalLayers: number,
    onLayerComplete: (layer: number) => void,
    onComplete: () => void
  ) => {
    setAnimationState({
      isAnimating: true,
      currentLayer: 0,
      totalLayers
    });

    const animateLayer = (layer: number) => {
      if (layer >= totalLayers) {
        setAnimationState(prev => ({
          ...prev,
          isAnimating: false
        }));
        onComplete();
        return;
      }

      setTimeout(() => {
        onLayerComplete(layer);
        setAnimationState(prev => ({
          ...prev,
          currentLayer: layer + 1
        }));
        animateLayer(layer + 1);
      }, ANIMATION.CONSTELLATION_LAYER_DELAY);
    };

    animateLayer(0);
  }, []);

  return {
    animationState,
    startNodeAnimation,
    startLayerAnimation
  };
}