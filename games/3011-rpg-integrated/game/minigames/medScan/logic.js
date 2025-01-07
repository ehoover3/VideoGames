// game/minigames/medScan.js

export function updateMedScanLogic(keys, scanning, scanProgress, maxScanProgress, currentState, player, previousState, STATES, savedPlayerPosition) {
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
