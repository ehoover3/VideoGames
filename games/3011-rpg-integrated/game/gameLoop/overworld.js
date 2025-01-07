import { updatePlayer } from "../player.js";
import { drawHUD, drawOverworld } from "../draw.js";

export function loadOverworld(gameObjects, keys, gameState, FRAME_SETTINGS, STATES, ctx, canvas) {
  const WALK_FRAMES = FRAME_SETTINGS.WALK_FRAMES;
  const ATTACK_FRAMES = FRAME_SETTINGS.ATTACK_FRAMES;
  const FRAME_WIDTH = FRAME_SETTINGS.FRAME_WIDTH;
  const FRAME_HEIGHT = FRAME_SETTINGS.FRAME_HEIGHT;

  const { player, mriMachine, xrayMachine } = gameObjects;
  // const updatedState = updatePlayer(player, mriMachine, STATES, keys, WALK_FRAMES, ATTACK_FRAMES, gameState.currentAction, gameState.animationTimer, gameState.animationSpeed, gameState.currentFrame, gameState.currentState, gameState.previousState, gameState.savedPlayerPosition);
  const updatedState = updatePlayer(player, mriMachine, STATES, keys, WALK_FRAMES, ATTACK_FRAMES, gameState);
  Object.assign(gameState, {
    currentState: updatedState.currentState,
    previousState: updatedState.previousState,
    savedPlayerPosition: updatedState.savedPlayerPosition,
  });
  drawOverworld(ctx, canvas, player, gameState.currentFrame, FRAME_WIDTH, FRAME_HEIGHT, mriMachine, xrayMachine);
  drawHUD(ctx, canvas, gameState.currentState, STATES);
}
