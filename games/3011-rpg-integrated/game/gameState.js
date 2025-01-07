export const STATES = {
  MAIN_MENU: "mainMenu",
  OVERWORLD: "overworld",
  SCAN_GAME: "medicalScansGame",
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

export const FRAME_WIDTH = 133.5;
export const FRAME_HEIGHT = 200;
export const WALK_FRAMES = 4;
export const ATTACK_FRAMES = 4;

export const gameState = {
  currentState: STATES.MAIN_MENU,
  previousState: STATES.MAIN_MENU,
  savedPlayerPosition: { x: 0, y: 0 },
  isGameStarted: false,
  selectedMenuOption: 0,
  currentFrame: 0,
  animationTimer: 0,
  animationSpeed: 10,
  currentAction: ACTIONS.IDLE,
  scanProgress: 0,
  maxScanProgress: 100,
  scanning: false,
};
