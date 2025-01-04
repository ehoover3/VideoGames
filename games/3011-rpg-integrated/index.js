// index.js
import { drawMainMenu, mainMenuOptions } from "./drawMainMenu.js";
import { drawOverworld } from "./drawOverworld.js";
import { drawHUD } from "./drawHud.js";
import { drawScanningGame } from "./drawScanningGame.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game states
const STATES = {
  MAIN_MENU: "mainMenu",
  OVERWORLD: "overworld",
  MRI_SCANNING_GAME: "scanningGame",
};

let currentState = STATES.MAIN_MENU;
let previousState = STATES.MAIN_MENU;
let isGameStarted = false;

const spriteSheet = new Image();
spriteSheet.src = "images/characters/PC.png";

// Animation configuration
const FRAME_WIDTH = 133.5,
  FRAME_HEIGHT = 200,
  WALK_FRAMES = 4,
  ATTACK_FRAMES = 4;
let currentFrame = 0,
  animationTimer = 0,
  animationSpeed = 10;
let currentAction = "idle"; // "idle", "walking", "attacking"

// Menu options
let selectedOption = 0;

// Overworld variables
const player = { x: 100, y: 100, width: 32, height: 32, color: "blue", speed: 4 };
player.direction = "down";
const mriMachine = { x: 130, y: 130, width: 32, height: 32, color: "grey" };
const xrayMachine = { x: 70, y: 130, width: 32, height: 32, color: "green" };

// Scanning game variables
let scanProgress = 0,
  maxScanProgress = 100,
  scanning = false;
let savedPlayerPosition = { x: player.x, y: player.y };

// Input handling
const keys = {};
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

function drawText(text, x, y, font = "16px Arial", color = "black", align = "center") {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}

// function drawOverworld() {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);

//   // Draw the player sprite from the sprite sheet
//   const spriteRow = {
//     down: 0,
//     up: 1,
//     left: 2,
//     right: 3,
//   }[player.direction];
//   const sourceX = currentFrame * FRAME_WIDTH;
//   const sourceY = spriteRow * FRAME_HEIGHT;

//   ctx.drawImage(
//     spriteSheet, // Image
//     sourceX, // Source X (frame column)
//     sourceY, // Source Y (row for direction)
//     FRAME_WIDTH, // Source width
//     FRAME_HEIGHT, // Source height
//     player.x, // Destination X
//     player.y, // Destination Y
//     player.width, // Destination width
//     player.height // Destination height
//   );

//   // Draw the machine as a rectangle
//   ctx.fillStyle = mriMachine.color;
//   ctx.fillRect(mriMachine.x, mriMachine.y, mriMachine.width, mriMachine.height);

//   ctx.fillStyle = xrayMachine.color;
//   ctx.fillRect(xrayMachine.x, xrayMachine.y, xrayMachine.width, xrayMachine.height);
// }

function updateOverworld() {
  let isMoving = false;

  let moveX = 0,
    moveY = 0;

  if (keys["ArrowUp"]) {
    moveY -= 1;
    player.direction = "up";
    isMoving = true;
  }
  if (keys["ArrowDown"]) {
    moveY += 1;
    player.direction = "down";
    isMoving = true;
  }
  if (keys["ArrowLeft"]) {
    moveX -= 1;
    player.direction = "left";
    isMoving = true;
  }
  if (keys["ArrowRight"]) {
    moveX += 1;
    player.direction = "right";
    isMoving = true;
  }

  // Normalize diagonal movement
  if (moveX !== 0 && moveY !== 0) {
    const SQUARE_ROOT_OF_TWO = 1.4142;
    const diagonalSpeed = (SQUARE_ROOT_OF_TWO / 2) * player.speed;
    moveX *= diagonalSpeed;
    moveY *= diagonalSpeed;
  } else {
    moveX *= player.speed;
    moveY *= player.speed;
  }

  // Apply movement
  player.x += moveX;
  player.y += moveY;

  // Handle actions
  if (keys["z"] || keys["Z"]) {
    currentAction = "attacking";
  } else if (isMoving) {
    currentAction = "walking";
  } else {
    currentAction = "idle";
  }

  // Animation frame logic
  if (isMoving || currentAction === "attacking") {
    animationTimer++;
    if (animationTimer >= animationSpeed) {
      animationTimer = 0;
      currentFrame++;
      if ((currentAction === "walking" && currentFrame >= WALK_FRAMES) || (currentAction === "attacking" && currentFrame >= ATTACK_FRAMES)) {
        currentFrame = 0;
      }
    }
  } else {
    currentFrame = 0;
  }

  // Handle collision with machine and state transition
  if (isCollidingWithMRIMachine() && keys[" "]) {
    savedPlayerPosition = { x: player.x, y: player.y };
    previousState = currentState;
    currentState = STATES.MRI_SCANNING_GAME;
  }

  // Exit to main menu
  if (keys["Escape"]) {
    previousState = currentState;
    savedPlayerPosition = { x: player.x, y: player.y };
    currentState = STATES.MAIN_MENU;
  }
}

function isCollidingWithMRIMachine() {
  return player.x < mriMachine.x + mriMachine.width && player.x + player.width > mriMachine.x && player.y < mriMachine.y + mriMachine.height && player.y + player.height > mriMachine.y;
}

function updateMriScanningGame() {
  if (keys[" "]) {
    scanning = true;
    if (scanProgress < maxScanProgress) {
      scanProgress++;
    }
  } else {
    scanning = false;
  }

  // Handle returning to overworld or exiting
  if (keys["x"] || keys["X"] || (scanProgress >= maxScanProgress && keys[" "])) {
    currentState = STATES.OVERWORLD;
    player.x = savedPlayerPosition.x;
    player.y = savedPlayerPosition.y;
    scanProgress = 0;
  }

  // Exit to main menu
  if (keys["Escape"]) {
    previousState = currentState;
    currentState = STATES.MAIN_MENU;
  }
}

function updateMainMenu() {
  if (keys["ArrowUp"]) {
    selectedOption = (selectedOption - 1 + mainMenuOptions.length) % mainMenuOptions.length;
    keys["ArrowUp"] = false;
  }
  if (keys["ArrowDown"]) {
    selectedOption = (selectedOption + 1) % mainMenuOptions.length;
    keys["ArrowDown"] = false;
  }

  if (keys["Enter"]) {
    handleMenuSelection();
    keys["Enter"] = false; // Prevent multiple triggers
  }
}

function handleMenuSelection() {
  const selected = mainMenuOptions[selectedOption];
  switch (selected) {
    case !isGameStarted && "Start New Game":
      currentState = STATES.OVERWORLD;
      isGameStarted = true;
      break;
    case isGameStarted && "Start New Game": // "Return to Game"
      if (previousState === STATES.MRI_SCANNING_GAME) {
        currentState = STATES.MRI_SCANNING_GAME;
      } else {
        currentState = previousState;
      }
      isGameStarted = true;
      break;
    case "Load Game":
      alert("Load Game functionality is not implemented yet.");
      break;
    case "Settings":
      alert("Settings functionality is not implemented yet.");
      break;
    case "Exit":
      alert("Exiting the game...");
      break;
  }
}

function gameLoop() {
  switch (currentState) {
    case STATES.MAIN_MENU:
      updateMainMenu();
      drawMainMenu(ctx, canvas, drawText, isGameStarted, selectedOption);
      break;
    case STATES.OVERWORLD:
      updateOverworld();
      drawOverworld(ctx, canvas, player, currentFrame, FRAME_WIDTH, FRAME_HEIGHT, spriteSheet, mriMachine, xrayMachine);
      drawHUD(ctx, canvas, currentState, STATES, drawText);

      break;
    case STATES.MRI_SCANNING_GAME:
      updateMriScanningGame();
      drawScanningGame(ctx, canvas, scanProgress, maxScanProgress);
      drawHUD(ctx, canvas, currentState, STATES, drawText);
      break;
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
