// index.js
import Game from "./game/Game.js";
import { Menu } from "./game/Menu.js";
import { STATES } from "./config/constants.js";
import { loadOverworld } from "./game/Overworld.js";
import { loadScanGame } from "./game/MedScanGame.js";

const ASPECT_RATIO = 16 / 9;
const { canvas, ctx } = setupCanvas("gameCanvas");
const keys = setupKeyboard();
const gameInstance = new Game();

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
startGame({ canvas, ctx, keys, gameInstance });

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

function startGame({ canvas, ctx, keys, gameInstance }) {
  let menu = new Menu(canvas, ctx, keys, gameInstance.gameState);
  let overworld = {
    canvas,
    ctx,
    keys,
    gameState: gameInstance.gameState,
    gameObjects: gameInstance.gameObjects,
  };
  let scanGame = {
    canvas,
    ctx,
    keys,
    gameState: gameInstance.gameState,
    gameObjects: gameInstance.gameObjects,
  };

  const handleGameState = {
    [STATES.MAIN_MENU]: () => menu.load(),
    [STATES.OVERWORLD]: () => loadOverworld(overworld),
    [STATES.SCAN_GAME]: () => loadScanGame(scanGame),
  };

  function gameLoop() {
    const updateGameState = handleGameState[gameInstance.gameState.currentState];
    if (updateGameState) updateGameState();
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}
