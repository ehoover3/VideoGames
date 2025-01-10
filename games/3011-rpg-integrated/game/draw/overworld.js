// game/draw/overworld.js
import { STATES, FRAME_SETTINGS } from "../../config/constants.js";
import { drawText } from "./utils.js";

const playerSpriteSheet = new Image();
playerSpriteSheet.src = "assets/images/player.png";

const DIRECTIONS = {
  down: 0,
  up: 1,
  left: 2,
  right: 3,
};

export function drawOverworld({ canvas, ctx, gameObjects, gameState }) {
  let { player, currentFrame } = gameObjects;
  drawWorld({ canvas, ctx });
  drawGameObjects({ canvas, ctx, gameObjects });
  drawPlayer(canvas, ctx, gameObjects.player, gameState.currentFrame);
}

export function drawWorld({ canvas, ctx }) {
  ctx.fillStyle = "darkseagreen";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export function drawPlayer(canvas, ctx, player, currentFrame) {
  const { FRAME_WIDTH, FRAME_HEIGHT } = FRAME_SETTINGS;
  const spriteRow = DIRECTIONS[player.direction];
  const sourceX = currentFrame * FRAME_WIDTH;
  const sourceY = spriteRow * FRAME_HEIGHT;

  const scaleX = canvas.width / 640;
  const scaleY = canvas.height / 360;

  const scaledX = player.x * scaleX;
  const scaledY = player.y * scaleY;
  const scaledWidth = player.width * scaleX;
  const scaledHeight = player.height * scaleY;

  ctx.drawImage(playerSpriteSheet, sourceX, sourceY, FRAME_WIDTH, FRAME_HEIGHT, scaledX, scaledY, scaledWidth, scaledHeight);
}

export function drawGameObjects({ canvas, ctx, gameObjects }) {
  let { mriMachine, xrayMachine } = gameObjects;
  drawGameObject(canvas, ctx, mriMachine);
  drawGameObject(canvas, ctx, xrayMachine);
}

function drawGameObject(canvas, ctx, object) {
  const scaleX = canvas.width / 640;
  const scaleY = canvas.height / 360;

  const scaledX = object.x * scaleX;
  const scaledY = object.y * scaleY;
  const scaledWidth = object.width * scaleX;
  const scaledHeight = object.height * scaleY;

  ctx.fillStyle = object.color;
  ctx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
}

export function drawHUD(canvas, ctx, currentState) {
  const scaleX = canvas.width / 640;
  const scaleY = canvas.height / 360;

  const hudHeight = 50 * scaleY;
  ctx.fillStyle = "lightgray";
  ctx.fillRect(0, canvas.height - hudHeight, canvas.width, hudHeight);

  const scaledFontSize = Math.max(16 * scaleY, 16) + "px Arial";
  const textHeight = parseInt(scaledFontSize);
  const scaledTextY = canvas.height - hudHeight / 2 + textHeight / 4;
  const hudText = currentState === STATES.OVERWORLD ? "Arrow Keys to Move | Space to Interact | ESC for Main Menu" : "Hold SPACE to Scan | X to Exit | ESC for Main Menu";
  drawText(ctx, hudText, canvas.width / 2, scaledTextY, scaledFontSize);
}
