// index.js
import { STATES, ACTIONS, DIRECTION, FRAME_WIDTH, FRAME_HEIGHT, WALK_FRAMES, ATTACK_FRAMES } from "./config/constants.js";
import { checkCollisionWithGameObject } from "./game/game.js";
import { handleMainMenu, handleMenuSelection, drawMainMenu } from "./game/menu.js"; // Import new functions
import { drawOverworld } from "./game/world.js";
import { drawHUD } from "./game/hud.js";
import { drawMedicalScansGame } from "./game/minigames/medScan.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let currentState = STATES.MAIN_MENU;
let previousState = STATES.MAIN_MENU;
let isGameStarted = false;

let currentFrame = 0;
let animationTimer = 0;
let animationSpeed = 10;
let currentAction = ACTIONS.IDLE;

let selectedMenuOption = 0;

function createPlayer(x, y, width, height, color, speed) {
  return { x, y, width, height, color, speed, direction: DIRECTION.DOWN };
}

function createGameObject(x, y, width, height, color) {
  return { x, y, width, height, color };
}

const player = createPlayer(100, 100, 32, 32, "blue", 4);
const mriMachine = createGameObject(130, 130, 32, 32, "grey");
const xrayMachine = createGameObject(70, 130, 32, 32, "green");

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

function updatePlayer() {
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

  if (checkCollisionWithGameObject(player, mriMachine) && keys[" "]) {
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
      updatePlayer();
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
