// game/gameLoop/scanGame.js
import { drawHUD } from "../draw.js";
import { runMedScanLogic } from "../minigames/medScan/logic.js";
import { drawMedScan } from "../minigames/medScan/draw.js";

export function loadScanGame({ gameObjects, keys, gameState, STATES, ctx, canvas }) {
  const { player } = gameObjects;
  const updatedValues = runMedScanLogic(keys, player, STATES, gameState);
  Object.assign(gameState, updatedValues);

  drawMedScan(ctx, canvas, gameState.scanProgress, gameState.maxScanProgress);
  drawHUD(ctx, canvas, gameState.currentState, STATES);
}
