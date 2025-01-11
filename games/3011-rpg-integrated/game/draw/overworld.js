// game/draw/overworld.js
import { STATES } from "../../config/constants.js";
import { drawText } from "./utils.js";
import { drawPlayer } from "../gameStart/PlayerObject.js";

export function drawOverworld({ canvas, ctx, gameObjects, gameState }) {
  drawWorld({ canvas, ctx });
  drawGameObjects({ canvas, ctx, gameObjects });
  drawPlayer(canvas, ctx, gameObjects.player, gameState.currentFrame);
}

function drawWorld({ canvas, ctx }) {
  ctx.fillStyle = "darkseagreen";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawGameObjects({ canvas, ctx, gameObjects }) {
  let { mriMachine } = gameObjects;
  const scaleX = canvas.width / 640;
  const scaleY = canvas.height / 360;
  mriMachine.draw(ctx, scaleX, scaleY);
}

export function drawHUD(canvas, ctx, currentState) {
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
