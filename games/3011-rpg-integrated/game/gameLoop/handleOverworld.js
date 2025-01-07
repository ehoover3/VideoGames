import { updatePlayer } from "../player.js";
import { drawHUD, drawOverworld } from "../draw.js";

export function handleOverworld(gameObjects, keys, gameState, WALK_FRAMES, ATTACK_FRAMES, FRAME_WIDTH, FRAME_HEIGHT, STATES, ctx, canvas, drawText) {
  const { player, mriMachine, xrayMachine } = gameObjects;
  const updatedState = updatePlayer(player, keys, gameState.currentAction, gameState.animationTimer, gameState.animationSpeed, WALK_FRAMES, ATTACK_FRAMES, gameState.currentFrame, mriMachine, STATES, gameState.currentState, gameState.previousState, gameState.savedPlayerPosition);
  Object.assign(gameState, {
    currentState: updatedState.currentState,
    previousState: updatedState.previousState,
    savedPlayerPosition: updatedState.savedPlayerPosition,
  });
  drawOverworld(ctx, canvas, player, gameState.currentFrame, FRAME_WIDTH, FRAME_HEIGHT, mriMachine, xrayMachine);
  drawHUD(ctx, canvas, gameState.currentState, STATES);
}
