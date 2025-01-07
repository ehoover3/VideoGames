import { updatePlayer } from "../player.js";
import { drawHUD, drawOverworld } from "../draw.js";

export function loadOverworld({ gameObjects, keys, gameState, FRAME_SETTINGS, STATES, ctx, canvas }) {
  const { player, mriMachine, xrayMachine } = gameObjects;
  let playerState = { player, mriMachine, STATES, keys, FRAME_SETTINGS, gameState };
  const updatedState = updatePlayer(playerState);
  Object.assign(gameState, {
    currentState: updatedState.currentState,
    previousState: updatedState.previousState,
    savedPlayerPosition: updatedState.savedPlayerPosition,
  });
  drawOverworld(ctx, canvas, player, gameState.currentFrame, FRAME_SETTINGS, mriMachine, xrayMachine);
  drawHUD(ctx, canvas, gameState.currentState, STATES);
}
