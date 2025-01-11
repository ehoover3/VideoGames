// game/draw/overworld.js

export function drawOverworld({ canvas, ctx, gameObjects, gameState }) {
  drawWorld({ canvas, ctx });
  drawGameObjects({ canvas, ctx, gameObjects });
  gameObjects.player.drawPlayer(canvas, ctx, gameState.currentFrame);
}

function drawWorld({ canvas, ctx }) {
  ctx.fillStyle = "darkseagreen";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export function drawGameObjects({ canvas, ctx, gameObjects }) {
  let { mriMachine } = gameObjects;
  const scaleX = canvas.width / 640;
  const scaleY = canvas.height / 360;
  mriMachine.draw(ctx, scaleX, scaleY);
}
