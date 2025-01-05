// index.js

import { updatePlayer } from "./game/player.js";
import { STATES, ACTIONS, FRAME_WIDTH, FRAME_HEIGHT, WALK_FRAMES, ATTACK_FRAMES } from "./config/constants.js";
import { handleMainMenu, handleMenuSelection, drawMainMenu } from "./game/menu/index.js";
import { drawOverworld } from "./game/world.js";
import { drawHUD } from "./game/hud.js";
import { drawMedicalScansGame, updateMedScanLogic } from "./game/minigames/medScan.js";
import { startGameLoop } from "./game/loop.js";
import { setupCanvas } from "./utils/canvasSetup.js";
import { setupKeyboard } from "./utils/keyboard.js";
import { setupObjects } from "./game/setupObjects.js";
import { gameState } from "./utils/gameState.js";

const { canvas, ctx } = setupCanvas("gameCanvas");
const keys = setupKeyboard();
const { player, mriMachine, xrayMachine } = setupObjects();

// Utility Functions
function drawText(text, x, y, font = "16px Arial", color = "black", align = "center") {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}

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
