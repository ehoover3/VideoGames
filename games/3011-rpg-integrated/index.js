// index.js

import { initGameObjects } from "./game/Game.js";
import { gameState } from "./game/Game.js";
import { Menu } from "./game/Menu.js";
import { STATES } from "./config/constants.js";
import { loadOverworld } from "./game/Overworld.js";
import { loadScanGame } from "./game/MedScanGame.js";

const ASPECT_RATIO = 16 / 9;
const { canvas, ctx } = setupCanvas("gameCanvas");
const keys = setupKeyboard();
const gameObjects = initGameObjects();
let game = { canvas, ctx, keys, gameState, gameObjects };

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
startGame(game);

function resizeCanvas() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  if (width / height > ASPECT_RATIO) {
    canvas.height = height;
    canvas.width = height * ASPECT_RATIO;
  } else {
    canvas.width = width;
    canvas.height = width / ASPECT_RATIO;
  }
  ctx.imageSmoothingEnabled = false;
}

function setupKeyboard() {
  const keys = {};
  window.addEventListener("keydown", (e) => (keys[e.key] = true));
  window.addEventListener("keyup", (e) => (keys[e.key] = false));
  return keys;
}

function setupCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  return { canvas, ctx };
}

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
