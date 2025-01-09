// game/gameLoop/scanGame.js
import { drawHUD } from "../draw/drawOverworld.js";
import { runLogic } from "../minigames/medScan/logic.js";
import { drawMinigame } from "../minigames/medScan/draw.js";

export function loadScanGame({ canvas, ctx, keys, gameState, gameObjects }) {
  const { player } = gameObjects;

  const update = runLogic(keys, player, gameState);
  Object.assign(gameState, update);

  drawMinigame({ canvas, ctx, gameState });
  drawHUD(canvas, ctx, gameState.currentState);
}
