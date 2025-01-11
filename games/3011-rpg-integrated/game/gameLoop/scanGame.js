// game/gameLoop/scanGame.js
import { drawHUD_2 } from "../gameStart/HUD.js";
import { drawText } from "../draw/drawText.js";
import { STATES } from "../../config/constants.js";

const BASE_RESOLUTION = { width: 640, height: 360 };
const MRI_IMAGE_DIMENSIONS = { width: 458, height: 248 };
const PROGRESS_BAR_DIMENSIONS = { width: 400, height: 24 };
const MRI_IMAGE_Y_OFFSET = 10;
const PROGRESS_BAR_Y_OFFSET = 270;
const MIN_FONT_SIZE = 20;

export function loadScanGame({ canvas, ctx, keys, gameState, gameObjects }) {
  const { player } = gameObjects;
  const update = runLogic(keys, player, gameState);
  Object.assign(gameState, update);
  drawMinigame({ canvas, ctx, gameState });
  drawHUD_2(canvas, ctx, gameState.currentState);
}

function drawMinigame({ canvas, ctx, gameState }) {
  let { scanProgress, maxScanProgress } = gameState;
  const mriImg = new Image();
  mriImg.src = "assets/images/scanGame/mri.png";
  mriImg.onload = () => drawScanScreen(canvas, ctx, mriImg, scanProgress, maxScanProgress);
  mriImg.onerror = () => console.error("Failed to load image: mri.png");
}

function drawScanScreen(canvas, ctx, mriImg, scanProgress, maxScanProgress) {
  clearCanvas(canvas, ctx);
  drawMRIImage(canvas, ctx, mriImg);
  drawProgressBar(canvas, ctx, scanProgress, maxScanProgress);
  if (scanProgress >= maxScanProgress) drawScanCompleteMessage(canvas, ctx);
}

function clearCanvas(canvas, ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawMRIImage(canvas, ctx, mriImg) {
  const scaleX = canvas.width / BASE_RESOLUTION.width;
  const scaleY = canvas.height / BASE_RESOLUTION.height;
  const imageWidth = MRI_IMAGE_DIMENSIONS.width * scaleX;
  const imageHeight = MRI_IMAGE_DIMENSIONS.height * scaleY;
  const x = (canvas.width - imageWidth) / 2;
  const y = MRI_IMAGE_Y_OFFSET * scaleY;
  ctx.drawImage(mriImg, 0, 0, MRI_IMAGE_DIMENSIONS.width, MRI_IMAGE_DIMENSIONS.height, x, y, imageWidth, imageHeight);
}

function drawProgressBar(canvas, ctx, scanProgress, maxScanProgress) {
  const scaleX = canvas.width / BASE_RESOLUTION.width;
  const scaleY = canvas.height / BASE_RESOLUTION.height;
  const barWidth = PROGRESS_BAR_DIMENSIONS.width * scaleX;
  const barHeight = PROGRESS_BAR_DIMENSIONS.height * scaleY;
  const x = (canvas.width - barWidth) / 2;
  const y = PROGRESS_BAR_Y_OFFSET * scaleY;
  drawBackgroundProgressBar(ctx, x, y, barWidth, barHeight);
  drawProgressFill(ctx, x, y, scanProgress, maxScanProgress, barWidth, barHeight);
}

function drawBackgroundProgressBar(ctx, x, y, barWidth, barHeight) {
  ctx.fillStyle = "lightgray";
  ctx.fillRect(x, y, barWidth, barHeight);
}

function drawProgressFill(ctx, x, y, scanProgress, maxScanProgress, barWidth, barHeight) {
  ctx.fillStyle = "#13beec"; // Turquoise blue
  ctx.fillRect(x, y, (scanProgress / maxScanProgress) * barWidth, barHeight);
}

function drawScanCompleteMessage(canvas, ctx) {
  const scaledFontSize = Math.max(MIN_FONT_SIZE * (canvas.height / BASE_RESOLUTION.height), MIN_FONT_SIZE) + "px Arial";
  drawText(ctx, "Scanning Complete! Press SPACE to return.", canvas.width / 2, PROGRESS_BAR_Y_OFFSET * (canvas.height / BASE_RESOLUTION.height), "center", scaledFontSize);
}

function runLogic(keys, player, gameState) {
  let scanning = gameState.scanning;
  let scanProgress = gameState.scanProgress;
  let maxScanProgress = gameState.maxScanProgress;
  let currentState = gameState.currentState;
  let previousState = gameState.previousState;
  let savedPlayerPosition = gameState.savedPlayerPosition;

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

  return { currentState, previousState, scanProgress, scanning };
}
