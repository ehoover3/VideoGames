import { updatePlayer } from "../player.js";
import { drawHUD, drawOverworld } from "../draw.js";

export function loadOverworld({ gameObjects, keys, gameState, FRAME_SETTINGS, STATES, canvas, ctx }) {
  const { player, mriMachine, xrayMachine } = gameObjects;
  let playerState = { player, mriMachine, STATES, keys, FRAME_SETTINGS, gameState };
  const updatedState = updatePlayer(playerState);
  Object.assign(gameState, {
    currentState: updatedState.currentState,
    previousState: updatedState.previousState,
    savedPlayerPosition: updatedState.savedPlayerPosition,
  });
  drawOverworld(canvas, ctx, player, gameState.currentFrame, FRAME_SETTINGS, mriMachine, xrayMachine);
  drawHUD(canvas, ctx, gameState.currentState, STATES);
}
