import { drawHUD } from "../draw.js";
import { updateMedScanLogic } from "../minigames/medScan/logic.js";
import { drawMedScan } from "../minigames/medScan/draw.js";

export function loadScanGame(gameObjects, keys, gameState, STATES, ctx, canvas) {
  const { player } = gameObjects;
  const updatedValues = updateMedScanLogic(keys, gameState.scanning, gameState.scanProgress, gameState.maxScanProgress, gameState.currentState, player, gameState.previousState, STATES, gameState.savedPlayerPosition);

  Object.assign(gameState, {
    scanProgress: updatedValues.scanProgress,
    scanning: updatedValues.scanning,
    currentState: updatedValues.currentState,
    previousState: updatedValues.previousState,
  });

  drawMedScan(ctx, canvas, gameState.scanProgress, gameState.maxScanProgress);
  drawHUD(ctx, canvas, gameState.currentState, STATES);
}
