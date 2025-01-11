// game/Overworld.js

import HUD from "./HUD.js";

export function loadOverworld({ canvas, ctx, keys, gameState, gameObjects }) {
  const update = gameObjects.player.update({ keys, gameState, gameObjects });
  const hud = new HUD(canvas, ctx);

  gameState.currentState = update.currentState;
  gameState.previousState = update.previousState;
  gameState.savedPlayerPosition = update.savedPlayerPosition;

  drawOverworld({ canvas, ctx, gameObjects, gameState });
  hud.draw(gameState.currentState);
}

function drawOverworld({ canvas, ctx, gameObjects, gameState }) {
  drawWorld({ canvas, ctx });
  drawGameObjects({ canvas, ctx, gameObjects });
  gameObjects.player.drawPlayer(canvas, ctx, gameState.currentFrame);
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
