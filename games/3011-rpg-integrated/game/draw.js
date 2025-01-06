// draw.js
const playerSpriteSheet = new Image();
playerSpriteSheet.src = "assets/images/player.png";

const DIRECTIONS = {
  down: 0,
  up: 1,
  left: 2,
  right: 3,
};

export function drawOverworld(ctx, canvas, player, currentFrame, FRAME_WIDTH, FRAME_HEIGHT, mriMachine, xrayMachine) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayerSprite(ctx, player, currentFrame, FRAME_WIDTH, FRAME_HEIGHT);
  drawMachine(ctx, mriMachine);
  drawMachine(ctx, xrayMachine);
}

function drawPlayerSprite(ctx, player, currentFrame, FRAME_WIDTH, FRAME_HEIGHT) {
  const spriteRow = DIRECTIONS[player.direction];
  const sourceX = currentFrame * FRAME_WIDTH;
  const sourceY = spriteRow * FRAME_HEIGHT;

  ctx.drawImage(playerSpriteSheet, sourceX, sourceY, FRAME_WIDTH, FRAME_HEIGHT, player.x, player.y, player.width, player.height);
}

function drawMachine(ctx, machine) {
  ctx.fillStyle = machine.color;
  ctx.fillRect(machine.x, machine.y, machine.width, machine.height);
}

export function drawHUD(ctx, canvas, currentState, STATES, drawText) {
  ctx.fillStyle = "lightgray";
  ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
  const hudText = currentState === STATES.OVERWORLD ? "Arrow Keys to Move | Space to Interact | ESC for Main Menu" : "Hold SPACE to Scan | X to Exit to Overworld | ESC for Main Menu";
  drawText(hudText, canvas.width / 2, canvas.height - 20);
}
