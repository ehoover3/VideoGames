export function drawHUD(ctx, canvas, currentState, STATES, drawText) {
  ctx.fillStyle = "lightgray";
  ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
  const hudText = currentState === STATES.OVERWORLD ? "Arrow Keys to Move | Space to Interact | ESC for Main Menu" : "Hold SPACE to Scan | X to Exit to Overworld | ESC for Main Menu";
  drawText(hudText, canvas.width / 2, canvas.height - 20);
}
