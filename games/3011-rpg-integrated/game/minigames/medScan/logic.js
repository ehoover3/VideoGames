// game/minigames/medScan/logic.js

import { STATES } from "../../../config/constants.js";

export function runLogic(keys, player, gameState) {
  let scanning = gameState.scanning;
  let scanProgress = gameState.scanProgress;
  let maxScanProgress = gameState.maxScanProgress;
  let currentState = gameState.currentState;
  let previousState = gameState.previousState;
  let savedPlayerPosition = gameState.savedPlayerPosition;

  if (keys[" "]) {
    scanning = true;
    if (scanProgress < maxScanProgress) {
      scanProgress++;
    }
  } else {
    scanning = false;
  }

  if (keys["x"] || keys["X"] || (scanProgress >= maxScanProgress && keys[" "])) {
    currentState = STATES.OVERWORLD;
    player.x = savedPlayerPosition.x;
    player.y = savedPlayerPosition.y;
    scanProgress = 0;
  }

  if (keys["Escape"]) {
    previousState = currentState;
    currentState = STATES.MAIN_MENU;
  }

  return { currentState, previousState, scanProgress, scanning };
}
