// games/loop.js
import { STATES, FRAME_SETTINGS } from "../../config/constants.js";
import { loadOverworld } from "./overworld.js";
import { loadScanGame } from "./scanGame.js";
import { loadMenu } from "./menu.js";

export function startGame({ ctx, canvas, keys, gameState, gameObjects }) {
  function gameLoop() {
    switch (gameState.currentState) {
      case STATES.MAIN_MENU:
        loadMenu(keys, gameState, ctx, canvas);
        break;
      case STATES.OVERWORLD:
        loadOverworld(gameObjects, keys, gameState, FRAME_SETTINGS, STATES, ctx, canvas);
        break;
      case STATES.SCAN_GAME:
        loadScanGame(gameObjects, keys, gameState, STATES, ctx, canvas);
        break;
    }
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}
