// index.js

import { updatePlayer } from "./game/player.js";
import { STATES, ACTIONS, DIRECTION, FRAME_WIDTH, FRAME_HEIGHT, WALK_FRAMES, ATTACK_FRAMES } from "./config/constants.js";
import { handleMainMenu, handleMenuSelection, drawMainMenu } from "./game/menu/index.js";
import { drawOverworld } from "./game/world.js";
import { drawHUD } from "./game/hud.js";
import { drawMedicalScansGame, updateMedScanLogic } from "./game/minigames/medScan.js";
import { createPlayer } from "./game/player.js";
import { createGameObject } from "./utils/helpers.js";
import { startGameLoop } from "./game/loop.js";

// Canvas Setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game State and Configuration
const gameState = {
  currentState: STATES.MAIN_MENU,
  previousState: STATES.MAIN_MENU,
  savedPlayerPosition: { x: 0, y: 0 },
  isGameStarted: false,
  selectedMenuOption: 0,
  currentFrame: 0,
  animationTimer: 0,
  animationSpeed: 10,
  currentAction: ACTIONS.IDLE,
  scanProgress: 0,
  maxScanProgress: 100,
  scanning: false,
};

// Utility Functions
function drawText(text, x, y, font = "16px Arial", color = "black", align = "center") {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}

// Player and Objects Setup
const player = createPlayer(100, 100, 32, 32, "blue", 4, DIRECTION.DOWN);
const mriMachine = createGameObject(130, 130, 32, 32, "grey");
const xrayMachine = createGameObject(70, 130, 32, 32, "green");

// Input Handling
const keys = {};
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

// Start the game loop
startGameLoop({
  ctx,
  canvas,
  keys,
  gameState,
  player,
  mriMachine,
  xrayMachine,
  drawText,
  handleMainMenu,
  handleMenuSelection,
  drawMainMenu,
  updatePlayer,
  drawOverworld,
  drawHUD,
  drawMedicalScansGame,
  updateMedScanLogic,
  STATES,
  WALK_FRAMES,
  ATTACK_FRAMES,
  FRAME_WIDTH,
  FRAME_HEIGHT,
});
