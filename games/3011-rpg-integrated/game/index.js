// games/loop.js
import { STATES } from "../config/constants.js";
import { loadOverworld } from "./Overworld.js";
import { loadScanGame } from "./MedScanGame.js";
import { loadMenu } from "./Menu.js";

export function startGame({ canvas, ctx, keys, gameState, gameObjects }) {
  let menu = { canvas, ctx, keys, gameState };
  let overworld = { canvas, ctx, keys, gameState, gameObjects };
  let scanGame = { canvas, ctx, keys, gameState, gameObjects };

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
