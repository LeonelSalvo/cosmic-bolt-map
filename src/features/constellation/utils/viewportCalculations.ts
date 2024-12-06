import { DEFAULTS } from '../config';

export function getViewportDimensions(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return {
      width: DEFAULTS.VIEWPORT.WIDTH,
      height: DEFAULTS.VIEWPORT.HEIGHT
    };
  }

  const width = Math.max(
    window.innerWidth,
    DEFAULTS.VIEWPORT.WIDTH
  );
  const height = Math.max(
    window.innerHeight,
    DEFAULTS.VIEWPORT.HEIGHT
  );

  return { width, height };
}

export function calculateCenterPosition(): { x: number; y: number } {
  const { width, height } = getViewportDimensions();
  return {
    x: width / 2,
    y: height / 2
  };
}