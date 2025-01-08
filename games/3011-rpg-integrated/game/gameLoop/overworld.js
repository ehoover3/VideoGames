import { updatePlayer } from "../player.js";
import { drawOverworld, drawPlayer, drawHUD } from "../draw.js";

export function loadOverworld({ canvas, ctx, gameObjects, keys, gameState, FRAME_SETTINGS }) {
  let playerState = { gameObjects, keys, FRAME_SETTINGS, gameState };
  const updatedState = updatePlayer(playerState);
  Object.assign(gameState, {
    currentState: updatedState.currentState,
    previousState: updatedState.previousState,
    savedPlayerPosition: updatedState.savedPlayerPosition,
  });

  drawOverworld({ canvas, ctx, gameObjects });
  drawPlayer(ctx, gameObjects.player, gameState.currentFrame);
  drawHUD(canvas, ctx, gameState.currentState);
}
