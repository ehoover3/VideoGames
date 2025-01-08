import { updatePlayer } from "../player.js";
import { drawHUD, drawOverworld } from "../draw.js";

export function loadOverworld({ canvas, ctx, gameObjects, keys, gameState, FRAME_SETTINGS, STATES }) {
  let playerState = { gameObjects, STATES, keys, FRAME_SETTINGS, gameState };
  const updatedState = updatePlayer(playerState);
  Object.assign(gameState, {
    currentState: updatedState.currentState,
    previousState: updatedState.previousState,
    savedPlayerPosition: updatedState.savedPlayerPosition,
  });
  drawOverworld(canvas, ctx, gameObjects, gameState.currentFrame, FRAME_SETTINGS);
  drawHUD(canvas, ctx, gameState.currentState);
}
