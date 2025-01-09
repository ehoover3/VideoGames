// game/draw/drawOverworld.js

import { STATES, FRAME_SETTINGS } from "../../config/constants.js";
import { ASPECT_RATIO } from "../../index.js";
const playerSpriteSheet = new Image();
playerSpriteSheet.src = "assets/images/player.png";

const DIRECTIONS = {
  down: 0,
  up: 1,
  left: 2,
  right: 3,
};

export function drawWorld({ canvas, ctx }) {
  ctx.fillStyle = "lightblue";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// export function drawPlayer(ctx, player, currentFrame) {
//   const { FRAME_WIDTH, FRAME_HEIGHT } = FRAME_SETTINGS;
//   const spriteRow = DIRECTIONS[player.direction];
//   const sourceX = currentFrame * FRAME_WIDTH;
//   const sourceY = spriteRow * FRAME_HEIGHT;
//   ctx.drawImage(playerSpriteSheet, sourceX, sourceY, FRAME_WIDTH, FRAME_HEIGHT, player.x, player.y, player.width, player.height);
// }

export function drawPlayer(ctx, player, currentFrame, canvas) {
  const { FRAME_WIDTH, FRAME_HEIGHT } = FRAME_SETTINGS;
  const spriteRow = DIRECTIONS[player.direction];
  const sourceX = currentFrame * FRAME_WIDTH;
  const sourceY = spriteRow * FRAME_HEIGHT;

  // Scale player position and size based on canvas size
  const scaleX = canvas.width / 640; // Base scale for width (assuming base resolution is 1920x1080)
  const scaleY = canvas.height / 360; // Base scale for height (assuming base resolution is 1920x1080)

  const scaledX = player.x * scaleX;
  const scaledY = player.y * scaleY;
  const scaledWidth = player.width * scaleX;
  const scaledHeight = player.height * scaleY;

  ctx.drawImage(playerSpriteSheet, sourceX, sourceY, FRAME_WIDTH, FRAME_HEIGHT, scaledX, scaledY, scaledWidth, scaledHeight);
}

export function drawGameObjects({ canvas, ctx, gameObjects }) {
  let { mriMachine, xrayMachine } = gameObjects;
  drawGameObject(ctx, mriMachine, canvas);
  drawGameObject(ctx, xrayMachine, canvas);
}

// function drawGameObject(ctx, object) {
//   ctx.fillStyle = object.color;
//   ctx.fillRect(object.x, object.y, object.width, object.height);
// }

function drawGameObject(ctx, object, canvas) {
  // Scale object position and size based on canvas size
  const scaleX = canvas.width / 640; // Base scale for width
  const scaleY = canvas.height / 360; // Base scale for height

  const scaledX = object.x * scaleX;
  const scaledY = object.y * scaleY;
  const scaledWidth = object.width * scaleX;
  const scaledHeight = object.height * scaleY;

  ctx.fillStyle = object.color;
  ctx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
}

export function drawHUD(canvas, ctx, currentState) {
  ctx.fillStyle = "lightgray";
  ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
  const hudText = currentState === STATES.OVERWORLD ? "Arrow Keys to Move | Space to Interact | ESC for Main Menu" : "Hold SPACE to Scan | X to Exit to Overworld | ESC for Main Menu";
  drawText(ctx, hudText, canvas.width / 2, canvas.height - 20);
}

export function drawText(ctx, text, x, y, font = "16px Arial", color = "black", align = "center") {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}
