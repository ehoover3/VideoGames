// game/gameLoop/overworld.js

import { updatePlayer } from "../gameStart/PlayerObject.js";
import { drawOverworld, drawHUD } from "../draw/overworld.js";

export function loadOverworld({ canvas, ctx, keys, gameState, gameObjects }) {
  let playerState = { keys, gameState, gameObjects };
  const update = updatePlayer(playerState);

  gameState.currentState = update.currentState;
  gameState.previousState = update.previousState;
  gameState.savedPlayerPosition = update.savedPlayerPosition;

  drawOverworld({ canvas, ctx, gameObjects, gameState });
  drawHUD(canvas, ctx, gameState.currentState);
}
