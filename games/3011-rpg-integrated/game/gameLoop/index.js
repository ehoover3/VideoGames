// games/loop.js
import { STATES, FRAME_SETTINGS } from "../../config/constants.js";
import { loadOverworld } from "./overworld.js";
import { loadScanGame } from "./scanGame.js";
import { loadMenu } from "./menu.js";

export function startGame({ canvas, ctx, keys, gameState, gameObjects }) {
  let menu = { keys, gameState, canvas, ctx };
  let overworld = { gameObjects, keys, gameState, FRAME_SETTINGS, STATES, canvas, ctx };
  let scanGame = { gameObjects, keys, gameState, STATES, canvas, ctx };

  const handleGameState = {
    [STATES.MAIN_MENU]: () => loadMenu(menu),
    [STATES.OVERWORLD]: () => loadOverworld(overworld),
    [STATES.SCAN_GAME]: () => loadScanGame(scanGame),
  };

  function gameLoop() {
    const updateGameState = handleGameState[gameState.currentState];
    if (updateGameState) updateGameState();
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}
