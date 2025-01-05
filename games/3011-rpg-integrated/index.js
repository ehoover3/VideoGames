// index.js

// import { updatePlayer } from "./game/player.js";
// import { STATES, ACTIONS, DIRECTION, FRAME_WIDTH, FRAME_HEIGHT, WALK_FRAMES, ATTACK_FRAMES } from "./config/constants.js";
// import { handleMainMenu, handleMenuSelection, drawMainMenu } from "./game/menu.js";
// import { drawOverworld } from "./game/world.js";
// import { drawHUD } from "./game/hud.js";
// import { drawMedicalScansGame } from "./game/minigames/medScan.js";
// import { createPlayer } from "./game/player.js";
// import { handleEscapeKey } from "./events/eventsManager.js";
// import globalState from "./game/state.js";

// const canvas = document.getElementById("gameCanvas");
// const ctx = canvas.getContext("2d");

// let isGameStarted = false;

// let currentFrame = 0;
// let animationTimer = 0;
// let animationSpeed = 10;
// let currentAction = ACTIONS.IDLE;

// let selectedMenuOption = 0;

// function createGameObject(x, y, width, height, color) {
//   return { x, y, width, height, color };
// }

// const player = createPlayer(100, 100, 32, 32, "blue", 4, DIRECTION.DOWN);
// const mriMachine = createGameObject(130, 130, 32, 32, "grey");
// const xrayMachine = createGameObject(70, 130, 32, 32, "green");

// let scanProgress = 0;
// let maxScanProgress = 100;
// let scanning = false;

// const keys = {};
// window.addEventListener("keydown", (e) => (keys[e.key] = true));
// window.addEventListener("keyup", (e) => (keys[e.key] = false));

// function drawText(text, x, y, font = "16px Arial", color = "black", align = "center") {
//   ctx.fillStyle = color;
//   ctx.font = font;
//   ctx.textAlign = align;
//   ctx.fillText(text, x, y);
// }

// export function updateMedScanLogic() {
//   if (keys[" "]) {
//     scanning = true;
//     if (scanProgress < maxScanProgress) {
//       scanProgress++;
//     }
//   } else {
//     scanning = false;
//   }

//   if (keys["x"] || keys["X"] || (scanProgress >= maxScanProgress && keys[" "])) {
//     globalState.setCurrentState(STATES.OVERWORLD);
//     const savedPosition = globalState.getSavedPlayerPosition();
//     player.x = savedPosition.x;
//     player.y = savedPosition.y;
//     scanProgress = 0;
//   }

//   const updatedValues = handleEscapeKey(keys, globalState.getCurrentState(), globalState.getPreviousState(), player, globalState.getSavedPlayerPosition(), STATES);

//   globalState.setCurrentState(updatedValues.currentState);
//   globalState.setPreviousState(updatedValues.previousState);
//   globalState.setSavedPlayerPosition(updatedValues.savedPlayerPosition);
// }

// function gameLoop() {
//   switch (globalState.getCurrentState()) {
//     case STATES.MAIN_MENU:
//       handleMainMenu(
//         keys,
//         selectedMenuOption,
//         (newSelected) => {
//           selectedMenuOption = newSelected;
//         },
//         () =>
//           handleMenuSelection(
//             selectedMenuOption,
//             globalState.getPreviousState(),
//             globalState.getCurrentState(),
//             isGameStarted,
//             (newState) => {
//               globalState.setCurrentState(newState);
//             },
//             (newGameStarted) => {
//               isGameStarted = newGameStarted;
//             }
//           )
//       );
//       drawMainMenu(ctx, canvas, drawText, isGameStarted, selectedMenuOption);
//       break;
//     case STATES.OVERWORLD:
//       updatePlayer(player, keys, currentAction, animationTimer, animationSpeed, WALK_FRAMES, ATTACK_FRAMES, currentFrame, mriMachine, STATES);
//       drawOverworld(ctx, canvas, player, currentFrame, FRAME_WIDTH, FRAME_HEIGHT, mriMachine, xrayMachine);
//       drawHUD(ctx, canvas, globalState.getCurrentState(), STATES, drawText);
//       break;
//     case STATES.MEDICAL_SCANS_GAME:
//       updateMedScanLogic();
//       drawMedicalScansGame(ctx, canvas, scanProgress, maxScanProgress);
//       drawHUD(ctx, canvas, globalState.getCurrentState(), STATES, drawText);
//       break;
//   }
//   requestAnimationFrame(gameLoop);
// }

// gameLoop();

// index.js

import { updatePlayer } from "./game/player.js";
import { STATES, ACTIONS, DIRECTION, FRAME_WIDTH, FRAME_HEIGHT, WALK_FRAMES, ATTACK_FRAMES } from "./config/constants.js";
import { handleMainMenu, handleMenuSelection, drawMainMenu } from "./game/menu.js";
import { drawOverworld } from "./game/world.js";
import { drawHUD } from "./game/hud.js";
import { drawMedicalScansGame, updateMedScanLogic } from "./game/minigames/medScan.js";
import { createPlayer } from "./game/player.js";
import { handleEscapeKey } from "./events/eventsManager.js";
import globalState from "./game/state.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let isGameStarted = false;

let currentFrame = 0;
let animationTimer = 0;
let animationSpeed = 10;
let currentAction = ACTIONS.IDLE;

let selectedMenuOption = 0;

function createGameObject(x, y, width, height, color) {
  return { x, y, width, height, color };
}

const player = createPlayer(100, 100, 32, 32, "blue", 4, DIRECTION.DOWN);
const mriMachine = createGameObject(130, 130, 32, 32, "grey");
const xrayMachine = createGameObject(70, 130, 32, 32, "green");

let scanProgress = 0;
let maxScanProgress = 100;
let scanning = false;

const keys = {};
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

function drawText(text, x, y, font = "16px Arial", color = "black", align = "center") {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}

function gameLoop() {
  switch (globalState.getCurrentState()) {
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
            globalState.getPreviousState(),
            globalState.getCurrentState(),
            isGameStarted,
            (newState) => {
              globalState.setCurrentState(newState);
            },
            (newGameStarted) => {
              isGameStarted = newGameStarted;
            }
          )
      );
      drawMainMenu(ctx, canvas, drawText, isGameStarted, selectedMenuOption);
      break;
    case STATES.OVERWORLD:
      updatePlayer(player, keys, currentAction, animationTimer, animationSpeed, WALK_FRAMES, ATTACK_FRAMES, currentFrame, mriMachine, STATES);
      drawOverworld(ctx, canvas, player, currentFrame, FRAME_WIDTH, FRAME_HEIGHT, mriMachine, xrayMachine);
      drawHUD(ctx, canvas, globalState.getCurrentState(), STATES, drawText);
      break;
    case STATES.MEDICAL_SCANS_GAME:
      const updatedValues = updateMedScanLogic(keys, scanning, scanProgress, maxScanProgress, globalState.getCurrentState(), player, globalState.getPreviousState(), STATES, globalState.getSavedPlayerPosition());
      scanProgress = updatedValues.scanProgress;
      scanning = updatedValues.scanning;
      globalState.setCurrentState(updatedValues.currentState);
      globalState.setPreviousState(updatedValues.previousState);
      drawMedicalScansGame(ctx, canvas, scanProgress, maxScanProgress);
      drawHUD(ctx, canvas, globalState.getCurrentState(), STATES, drawText);
      break;
  }
  requestAnimationFrame(gameLoop);
}

gameLoop();
