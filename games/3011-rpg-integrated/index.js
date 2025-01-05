// index.js

import { updatePlayer } from "./game/player.js";
import { STATES, ACTIONS, DIRECTION, FRAME_WIDTH, FRAME_HEIGHT, WALK_FRAMES, ATTACK_FRAMES } from "./config/constants.js";
import { handleMainMenu, handleMenuSelection, drawMainMenu } from "./game/menu.js";
import { drawOverworld } from "./game/world.js";
import { drawHUD } from "./game/hud.js";
import { drawMedicalScansGame, updateMedScanLogic } from "./game/minigames/medScan.js";
import { createPlayer } from "./game/player.js";

// Canvas Setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game State and Configuration
let currentState = STATES.MAIN_MENU;
let previousState = STATES.MAIN_MENU;
let savedPlayerPosition = { x: 0, y: 0 };
let isGameStarted = false;
let selectedMenuOption = 0;
let currentFrame = 0;
let animationTimer = 0;
let animationSpeed = 10;
let currentAction = ACTIONS.IDLE;
let scanProgress = 0;
let maxScanProgress = 100;
let scanning = false;

// Player and Objects Setup
const player = createPlayer(100, 100, 32, 32, "blue", 4, DIRECTION.DOWN);
const mriMachine = createGameObject(130, 130, 32, 32, "grey");
const xrayMachine = createGameObject(70, 130, 32, 32, "green");

// OnKey Handling
const keys = {};
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

// Game Object Factory
function createGameObject(x, y, width, height, color) {
  return { x, y, width, height, color };
}

// Utility Function
function drawText(text, x, y, font = "16px Arial", color = "black", align = "center") {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}

// Game Loop
function gameLoop() {
  switch (currentState) {
    case STATES.MAIN_MENU:
      handleMainMenu(
        keys,
        selectedMenuOption,
        (newSelected) => {
          selectedMenuOption = newSelected;
        },
        () =>
          handleMenuSelection(
            selectedMenuOption,
            previousState,
            currentState,
            isGameStarted,
            (newState) => {
              currentState = newState;
            },
            (newGameStarted) => {
              isGameStarted = newGameStarted;
            }
          )
      );
      drawMainMenu(ctx, canvas, drawText, isGameStarted, selectedMenuOption);
      break;
    case STATES.OVERWORLD:
      let updatedState = updatePlayer(player, keys, currentAction, animationTimer, animationSpeed, WALK_FRAMES, ATTACK_FRAMES, currentFrame, mriMachine, STATES, currentState, previousState, savedPlayerPosition);
      currentState = updatedState.currentState;
      previousState = updatedState.previousState;
      savedPlayerPosition = updatedState.savedPlayerPosition;
      drawOverworld(ctx, canvas, player, currentFrame, FRAME_WIDTH, FRAME_HEIGHT, mriMachine, xrayMachine);
      drawHUD(ctx, canvas, currentState, STATES, drawText);
      break;
    case STATES.MEDICAL_SCANS_GAME:
      const updatedValues = updateMedScanLogic(keys, scanning, scanProgress, maxScanProgress, currentState, player, previousState, STATES, savedPlayerPosition);
      scanProgress = updatedValues.scanProgress;
      scanning = updatedValues.scanning;
      currentState = updatedValues.currentState;
      previousState = updatedValues.previousState;
      drawMedicalScansGame(ctx, canvas, scanProgress, maxScanProgress);
      drawHUD(ctx, canvas, currentState, STATES, drawText);
      break;
  }
  requestAnimationFrame(gameLoop);
}

gameLoop();
