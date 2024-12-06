export const ANIMATION = {
  CLOSE_DURATION: 600,
  NODE_DELAY: 100,
  VIEW_TRANSITION: 750,
  CONSTELLATION_LAYER_DELAY: 1000,
  ZOOM: {
    INITIAL_SCALE: 2.5,
    INITIAL_DURATION: 500,
    LAYER_DURATION: 1000
  }
};

export const ZOOM = {
  MIN: 0.1,
  MAX: 3,
  CONSTELLATION_MIN: 0.1
};

export const NODE = {
  SIZE: {
    BASE: {
      WITH_CHILDREN: 6,
      WITHOUT_CHILDREN: 4
    },
    ACTIVE_MULTIPLIER: 1.5,
    MIN_SCALE: 0.5
  },
  OPACITY: {
    MAX: 1,
    MIN: 0.2,
    LEVEL_DECAY: 0.2,
    DISTANCE_FACTOR: 0.15
  },
  GLOW: {
    BLUR: 2
  }
};

export const LAYOUT = {
  DISTANCE: {
    MIN: 200,
    MAX: 300,
    LEVEL_MULTIPLIER: 100
  },
  RADIUS: {
    BASE: 200,
    VARIATION: 50
  }
};

export const DEFAULTS = {
  VIEWPORT: {
    WIDTH: 1920,
    HEIGHT: 1080
  },
  NEW_NODE: {
    LABEL: "New Star",
    METADATA: {
      name: "New Star",
      description: "A newly discovered celestial body"
    }
  }
};

export const STORAGE = {
  KEY: "cosmic-mind-map"
};