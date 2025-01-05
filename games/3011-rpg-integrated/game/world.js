// world.js
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
