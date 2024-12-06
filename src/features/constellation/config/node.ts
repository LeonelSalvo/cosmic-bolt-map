export const NODE = {
  SIZE: {
    BASE: {
      WITH_CHILDREN: 8,
      WITHOUT_CHILDREN: 6
    },
    ACTIVE_MULTIPLIER: 1.8,
    MIN_SCALE: 0.6
  },
  OPACITY: {
    MAX: 1,
    MIN: 0.4,
    LEVEL_DECAY: 0.15,
    DISTANCE_FACTOR: 0.1,
    UNSELECTED: {
      MIN: 0.6,
      MAX: 1
    },
    PULSE: {
      MIN: 0.6,
      MAX: 1,
      DURATION: {
        MIN: 2000,
        MAX: 4000
      }
    }
  },
  GLOW: {
    BLUR: 3
  }
};