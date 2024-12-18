import { DEFAULTS } from '../config/constellation';

export function getViewportDimensions(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return {
      width: DEFAULTS.VIEWPORT.WIDTH,
      height: DEFAULTS.VIEWPORT.HEIGHT
    };
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

export function calculateCenterPosition(): { x: number; y: number } {
  const { width, height } = getViewportDimensions();
  return {
    x: width / 2,
    y: height / 2
  };
}