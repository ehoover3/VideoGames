import { updatePlayer } from "../player.js";
import { drawWorld, drawGameObjects, drawPlayer, drawHUD } from "../draw/overworld.js";

export function loadOverworld({ canvas, ctx, keys, gameState, gameObjects }) {
  let playerState = { keys, gameState, gameObjects };
  const update = updatePlayer(playerState);

  gameState.currentState = update.currentState;
  gameState.previousState = update.previousState;
  gameState.savedPlayerPosition = update.savedPlayerPosition;

  drawWorld({ canvas, ctx });
  drawGameObjects({ canvas, ctx, gameObjects });
  drawPlayer(canvas, ctx, gameObjects.player, gameState.currentFrame);
  drawHUD(canvas, ctx, gameState.currentState);
}
