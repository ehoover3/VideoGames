import { updatePlayer } from "../player.js";
import { drawGameObjects, drawPlayer, drawHUD } from "../draw.js";

export function loadOverworld({ canvas, ctx, keys, gameState, gameObjects }) {
  let playerState = { keys, gameState, gameObjects };
  const update = updatePlayer(playerState);

  gameState.currentState = update.currentState;
  gameState.previousState = update.previousState;
  gameState.savedPlayerPosition = update.savedPlayerPosition;

  drawGameObjects({ canvas, ctx, gameObjects });
  drawPlayer(ctx, gameObjects.player, gameState.currentFrame);
  drawHUD(canvas, ctx, gameState.currentState);
}
