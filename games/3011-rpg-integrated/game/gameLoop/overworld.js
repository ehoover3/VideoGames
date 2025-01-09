import { updatePlayer } from "../player.js";
import { drawWorld, drawGameObjects, drawPlayer, drawHUD } from "../draw/drawOverworld.js";

export function loadOverworld({ canvas, ctx, keys, gameState, gameObjects }) {
  let playerState = { keys, gameState, gameObjects };
  const update = updatePlayer(playerState);

  gameState.currentState = update.currentState;
  gameState.previousState = update.previousState;
  gameState.savedPlayerPosition = update.savedPlayerPosition;

  drawWorld({ canvas, ctx });
  drawGameObjects({ canvas, ctx, gameObjects });
  drawPlayer(ctx, gameObjects.player, gameState.currentFrame, canvas);
  drawHUD(canvas, ctx, gameState.currentState);
}
