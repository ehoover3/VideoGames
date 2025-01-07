// game/gameLoop/scanGame.js
import { drawHUD } from "../draw.js";
import { runMedScanLogic } from "../minigames/medScan/logic.js";
import { drawMedScan } from "../minigames/medScan/draw.js";

export function loadScanGame({ gameObjects, keys, gameState, STATES, canvas, ctx }) {
  const { player } = gameObjects;
  const updatedValues = runMedScanLogic(keys, player, STATES, gameState);
  Object.assign(gameState, updatedValues);

  drawMedScan(canvas, ctx, gameState.scanProgress, gameState.maxScanProgress);
  drawHUD(canvas, ctx, gameState.currentState, STATES);
}
