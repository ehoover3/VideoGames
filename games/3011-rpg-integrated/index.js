// index.js

import { updatePlayer } from "./game/player.js";
// import { STATES, WALK_FRAMES, ATTACK_FRAMES, FRAME_WIDTH, FRAME_HEIGHT } from "./config/constants.js";
import { drawOverworld } from "./game/world.js";
import { drawHUD } from "./game/hud.js";
import { drawMedicalScansGame, updateMedScanLogic } from "./game/minigames/medScan.js";
import { startGameLoop } from "./game/loop.js";
import { setupCanvas } from "./utils/canvasSetup.js";
import { setupKeyboard } from "./utils/keyboard.js";
import { initGameObjects } from "./game/gameObjects.js";
import { gameState } from "./utils/gameState.js";

const { ctx, canvas } = setupCanvas("gameCanvas");
const keys = setupKeyboard();
const gameObjects = initGameObjects();

function drawText(text, x, y, font = "16px Arial", color = "black", align = "center") {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}

startGameLoop({
  ctx,
  canvas,
  keys,
  gameState,
  gameObjects,
  drawText,
  updatePlayer,
  drawOverworld,
  drawHUD,
  drawMedicalScansGame,
  updateMedScanLogic,
  // STATES,
  // WALK_FRAMES,
  // ATTACK_FRAMES,
  // FRAME_WIDTH,
  // FRAME_HEIGHT,
});
