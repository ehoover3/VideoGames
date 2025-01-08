import { updatePlayer } from "../player.js";
import { drawGameObjects, drawPlayer, drawHUD } from "../draw.js";

export function loadOverworld({ canvas, ctx, gameObjects, keys, gameState }) {
  let playerState = { gameObjects, keys, gameState };
  const updatedState = updatePlayer(playerState);
  Object.assign(gameState, {
    currentState: updatedState.currentState,
    previousState: updatedState.previousState,
    savedPlayerPosition: updatedState.savedPlayerPosition,
  });

  drawGameObjects({ canvas, ctx, gameObjects });
  drawPlayer(ctx, gameObjects.player, gameState.currentFrame);
  drawHUD(canvas, ctx, gameState.currentState);
}
