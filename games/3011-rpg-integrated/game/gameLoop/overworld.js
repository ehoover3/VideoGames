// game/gameLoop/overworld.js

import { updatePlayer } from "../gameStart/PlayerObject.js";
import { drawOverworld } from "../draw/overworld.js";
import { drawHUD_2 } from "../gameStart/HUD.js";
export function loadOverworld({ canvas, ctx, keys, gameState, gameObjects }) {
  let playerState = { keys, gameState, gameObjects };
  const update = updatePlayer(playerState);

  gameState.currentState = update.currentState;
  gameState.previousState = update.previousState;
  gameState.savedPlayerPosition = update.savedPlayerPosition;

  drawOverworld({ canvas, ctx, gameObjects, gameState });
  drawHUD_2(canvas, ctx, gameState.currentState);
}
