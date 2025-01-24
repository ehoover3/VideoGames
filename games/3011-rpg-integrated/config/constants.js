// constants.js

export const STATES = {
  MAIN_MENU: "MAIN_MENU",
  OVERWORLD: "OVERWORLD",
  MED_SCAN_GAME: "MED_SCAN_GAME",
  INVENTORY: "INVENTORY",
  ADVENTURE_LOG: "ADVENTURE_LOG",
  SYSTEM: "SYSTEM",
};

export const ACTIONS = {
  IDLE: "idle",
  WALKING: "walking",
  ATTACKING: "attacking",
};

export const DIRECTION = {
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
};

export const GAME_CONFIG = {
  BASE_RESOLUTION: {
    width: 640,
    height: 360,
  },
  ASPECT_RATIO: 16 / 9,
  ANIMATION: {
    DEFAULT_SPEED: 10,
    PLAYER_SPEED: 4,
    FRAME_RATE: 60,
  },
  PLAYER: {
    SPRITE: {
      FRAME_WIDTH: 102,
      FRAME_HEIGHT: 152.75,
      WALK_FRAMES: 4,
      ATTACK_FRAMES: 1,
    },
    DIMENSIONS: {
      width: 32,
      height: 32,
    },
    START_POSITION: {
      x: 100,
      y: 100,
    },
  },
  INTERACTION: {
    DISTANCE: 40,
  },
};

export const UI_CONFIG = {
  MENU: {
    TITLE_HEIGHT_RATIO: 1 / 12,
    MENU_START_Y_RATIO: 1 / 2.5,
    SPACING_RATIO: 1 / 11,
    FONT_SIZE_RATIO: 1 / 20,
    BUTTON: {
      PADDING_RATIO: 1 / 40,
      WIDTH_RATIO: 0.25,
      RADIUS_RATIO: 0.5,
    },
    COLORS: {
      SELECTED: "orange",
      DEFAULT: "white",
      TEXT_SELECTED: "white",
      TEXT_DEFAULT: "black",
      STROKE: "lightgrey",
      SHADOW: "rgba(0, 0, 0, 0.2)",
    },
  },
  HUD: {
    MIN_HEIGHT: 40,
    MIN_FONT_SIZE: 16,
    PADDING: 10,
    BACKGROUND: "rgba(211, 211, 211, 0.9)",
  },
};
