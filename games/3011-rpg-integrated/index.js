// index.js

// Import Modules
import { updatePlayer } from "./game/player.js";
import { STATES, ACTIONS, DIRECTION, FRAME_WIDTH, FRAME_HEIGHT, WALK_FRAMES, ATTACK_FRAMES } from "./config/constants.js";
import { handleMainMenu, handleMenuSelection, drawMainMenu } from "./game/menu/index.js";
import { drawOverworld } from "./game/world.js";
import { drawHUD } from "./game/hud.js";
import { drawMedicalScansGame, updateMedScanLogic } from "./game/minigames/medScan.js";
import { createPlayer } from "./game/player.js";
import { createGameObject } from "./utils/helpers.js";

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

// Player and Objects Setup
const player = createPlayer(100, 100, 32, 32, "blue", 4, DIRECTION.DOWN);
const mriMachine = createGameObject(130, 130, 32, 32, "grey");
const xrayMachine = createGameObject(70, 130, 32, 32, "green");

// Input Handling
const keys = {};
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

// Utility Functions
function drawText(text, x, y, font = "16px Arial", color = "black", align = "center") {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}

// Game Handlers
function handleMenu() {
  handleMainMenu(
    keys,
    gameState.selectedMenuOption,
    (newSelected) => (gameState.selectedMenuOption = newSelected),
    () => {
      handleMenuSelection(
        gameState.selectedMenuOption,
        gameState.previousState,
        gameState.currentState,
        gameState.isGameStarted,
        (newState) => (gameState.currentState = newState),
        (newGameStarted) => (gameState.isGameStarted = newGameStarted)
      );
    }
  );

  drawMainMenu(ctx, canvas, drawText, gameState.isGameStarted, gameState.selectedMenuOption);
}

function handleOverworld() {
  const updatedState = updatePlayer(player, keys, gameState.currentAction, gameState.animationTimer, gameState.animationSpeed, WALK_FRAMES, ATTACK_FRAMES, gameState.currentFrame, mriMachine, STATES, gameState.currentState, gameState.previousState, gameState.savedPlayerPosition);

  Object.assign(gameState, {
    currentState: updatedState.currentState,
    previousState: updatedState.previousState,
    savedPlayerPosition: updatedState.savedPlayerPosition,
  });

  drawOverworld(ctx, canvas, player, gameState.currentFrame, FRAME_WIDTH, FRAME_HEIGHT, mriMachine, xrayMachine);
  drawHUD(ctx, canvas, gameState.currentState, STATES, drawText);
}

function handleScanGame() {
  const updatedValues = updateMedScanLogic(keys, gameState.scanning, gameState.scanProgress, gameState.maxScanProgress, gameState.currentState, player, gameState.previousState, STATES, gameState.savedPlayerPosition);

  Object.assign(gameState, {
    scanProgress: updatedValues.scanProgress,
    scanning: updatedValues.scanning,
    currentState: updatedValues.currentState,
    previousState: updatedValues.previousState,
  });

  drawMedicalScansGame(ctx, canvas, gameState.scanProgress, gameState.maxScanProgress);
  drawHUD(ctx, canvas, gameState.currentState, STATES, drawText);
}

// Main Game Loop
function gameLoop() {
  switch (gameState.currentState) {
    case STATES.MAIN_MENU:
      handleMenu();
      break;
    case STATES.OVERWORLD:
      handleOverworld();
      break;
    case STATES.SCAN_GAME:
      handleScanGame();
      break;
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
