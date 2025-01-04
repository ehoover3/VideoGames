// index.js
import { STATES, ACTIONS, DIRECTION, MENU_OPTIONS } from "./constants.js";
import { drawMainMenu, mainMenuOptions } from "./drawMainMenu.js";
import { drawOverworld } from "./overworld/drawOverworld.js";
import { drawHUD } from "./drawHud.js";
import { drawMedicalScansGame } from "./minigames/medicalScans/drawMedicalScansGame.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let currentState = STATES.MAIN_MENU;
let previousState = STATES.MAIN_MENU;
let isGameStarted = false;

const FRAME_WIDTH = 133.5,
  FRAME_HEIGHT = 200,
  WALK_FRAMES = 4,
  ATTACK_FRAMES = 4;
let currentFrame = 0,
  animationTimer = 0,
  animationSpeed = 10;
let currentAction = ACTIONS.IDLE;

let selectedMenuOption = 0;

const player = { x: 100, y: 100, width: 32, height: 32, color: "blue", speed: 4 };
player.direction = "down";
const mriMachine = { x: 130, y: 130, width: 32, height: 32, color: "grey" };
const xrayMachine = { x: 70, y: 130, width: 32, height: 32, color: "green" };

let scanProgress = 0,
  maxScanProgress = 100,
  scanning = false;
let savedPlayerPosition = { x: player.x, y: player.y };

const keys = {};
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

function drawText(text, x, y, font = "16px Arial", color = "black", align = "center") {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}

function updatePlayerInOverworld() {
  let isMoving = false;

  let moveX = 0,
    moveY = 0;

  if (keys["ArrowUp"]) {
    moveY -= 1;
    player.direction = DIRECTION.UP;
    isMoving = true;
  }
  if (keys["ArrowDown"]) {
    moveY += 1;
    player.direction = DIRECTION.DOWN;
    isMoving = true;
  }
  if (keys["ArrowLeft"]) {
    moveX -= 1;
    player.direction = DIRECTION.LEFT;
    isMoving = true;
  }
  if (keys["ArrowRight"]) {
    moveX += 1;
    player.direction = DIRECTION.RIGHT;
    isMoving = true;
  }

  if (moveX !== 0 && moveY !== 0) {
    const SQUARE_ROOT_OF_TWO = 1.4142;
    const diagonalSpeed = (SQUARE_ROOT_OF_TWO / 2) * player.speed;
    moveX *= diagonalSpeed;
    moveY *= diagonalSpeed;
  } else {
    moveX *= player.speed;
    moveY *= player.speed;
  }

  player.x += moveX;
  player.y += moveY;

  if (keys["z"] || keys["Z"]) {
    currentAction = ACTIONS.ATTACKING;
  } else if (isMoving) {
    currentAction = ACTIONS.WALKING;
  } else {
    currentAction = ACTIONS.IDLE;
  }

  if (isMoving || currentAction === ACTIONS.ATTACKING) {
    animationTimer++;
    if (animationTimer >= animationSpeed) {
      animationTimer = 0;
      currentFrame++;
      if ((currentAction === ACTIONS.WALKING && currentFrame >= WALK_FRAMES) || (currentAction === ACTIONS.ATTACKING && currentFrame >= ATTACK_FRAMES)) {
        currentFrame = 0;
      }
    }
  } else {
    currentFrame = 0;
  }

  if (isCollidingWithMedicalScanGame() && keys[" "]) {
    savedPlayerPosition = { x: player.x, y: player.y };
    previousState = currentState;
    currentState = STATES.MEDICAL_SCANS_GAME;
  }

  if (keys["Escape"]) {
    previousState = currentState;
    savedPlayerPosition = { x: player.x, y: player.y };
    currentState = STATES.MAIN_MENU;
  }
}

function isCollidingWithMedicalScanGame() {
  return player.x < mriMachine.x + mriMachine.width && player.x + player.width > mriMachine.x && player.y < mriMachine.y + mriMachine.height && player.y + player.height > mriMachine.y;
}

function updateMedicalScanGame() {
  if (keys[" "]) {
    scanning = true;
    if (scanProgress < maxScanProgress) {
      scanProgress++;
    }
  } else {
    scanning = false;
  }

  if (keys["x"] || keys["X"] || (scanProgress >= maxScanProgress && keys[" "])) {
    currentState = STATES.OVERWORLD;
    player.x = savedPlayerPosition.x;
    player.y = savedPlayerPosition.y;
    scanProgress = 0;
  }

  if (keys["Escape"]) {
    previousState = currentState;
    currentState = STATES.MAIN_MENU;
  }
}

function updateMainMenu() {
  if (keys["ArrowUp"]) {
    selectedMenuOption = (selectedMenuOption - 1 + mainMenuOptions.length) % mainMenuOptions.length;
    keys["ArrowUp"] = false;
  }
  if (keys["ArrowDown"]) {
    selectedMenuOption = (selectedMenuOption + 1) % mainMenuOptions.length;
    keys["ArrowDown"] = false;
  }

  if (keys["Enter"]) {
    handleMenuSelection();
    keys["Enter"] = false; // Prevent multiple triggers
  }
}

function handleMenuSelection() {
  const selected = mainMenuOptions[selectedMenuOption];
  switch (selected) {
    case !isGameStarted && MENU_OPTIONS.START_NEW_GAME:
      currentState = STATES.OVERWORLD;
      isGameStarted = true;
      break;
    case isGameStarted && MENU_OPTIONS.START_NEW_GAME:
      if (previousState === STATES.MEDICAL_SCANS_GAME) {
        currentState = STATES.MEDICAL_SCANS_GAME;
      } else {
        currentState = previousState;
      }
      isGameStarted = true;
      break;
    case MENU_OPTIONS.LOAD_GAME:
      alert("Load Game functionality is not implemented yet.");
      break;
    case MENU_OPTIONS.SETTINGS:
      alert("Settings functionality is not implemented yet.");
      break;
    case MENU_OPTIONS.EXIT:
      alert("Exiting the game...");
      break;
  }
}

function gameLoop() {
  switch (currentState) {
    case STATES.MAIN_MENU:
      updateMainMenu();
      drawMainMenu(ctx, canvas, drawText, isGameStarted, selectedMenuOption);
      break;
    case STATES.OVERWORLD:
      updatePlayerInOverworld();
      drawOverworld(ctx, canvas, player, currentFrame, FRAME_WIDTH, FRAME_HEIGHT, mriMachine, xrayMachine);
      drawHUD(ctx, canvas, currentState, STATES, drawText);

      break;
    case STATES.MEDICAL_SCANS_GAME:
      updateMedicalScanGame();
      drawMedicalScansGame(ctx, canvas, scanProgress, maxScanProgress);
      drawHUD(ctx, canvas, currentState, STATES, drawText);
      break;
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
