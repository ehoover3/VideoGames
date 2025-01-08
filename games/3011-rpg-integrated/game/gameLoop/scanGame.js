// game/gameLoop/scanGame.js
import { drawHUD } from "../draw.js";
import { runMedScanLogic } from "../minigames/medScan/logic.js";
import { drawMedScan } from "../minigames/medScan/draw.js";

export function loadScanGame({ canvas, ctx, keys, gameState, gameObjects }) {
  const { player } = gameObjects;
  const updatedValues = runMedScanLogic(keys, player, gameState);
  Object.assign(gameState, updatedValues);

  drawMedScan(canvas, ctx, gameState.scanProgress, gameState.maxScanProgress);
  drawHUD(canvas, ctx, gameState.currentState);
}
