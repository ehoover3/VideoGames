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
