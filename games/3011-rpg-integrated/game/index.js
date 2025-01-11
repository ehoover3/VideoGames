// game/index.js

import { STATES } from "../config/constants.js";
import { loadOverworld } from "./Overworld.js";
import { loadScanGame } from "./MedScanGame.js";
import { Menu } from "./Menu.js";

export function startGame({ canvas, ctx, keys, gameState, gameObjects }) {
  let menu = new Menu(canvas, ctx, keys, gameState);
  let overworld = { canvas, ctx, keys, gameState, gameObjects };
  let scanGame = { canvas, ctx, keys, gameState, gameObjects };

  const handleGameState = {
    [STATES.MAIN_MENU]: () => menu.load(),
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
