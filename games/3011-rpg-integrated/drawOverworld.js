// drawOverworld.js
const spriteSheet = new Image();
spriteSheet.src = "images/characters/PC.png";

export function drawOverworld(ctx, canvas, player, currentFrame, FRAME_WIDTH, FRAME_HEIGHT, mriMachine) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the player sprite from the sprite sheet
  const spriteRow = {
    down: 0,
    up: 1,
    left: 2,
    right: 3,
  }[player.direction];
  const SOURCE_FRAME_WIDTH = 133.5;
  const SOURCE_FRAME_HEIGHT = 133.5;
  const sourceX = currentFrame * FRAME_WIDTH;
  const sourceY = spriteRow * FRAME_HEIGHT;

  ctx.drawImage(
    spriteSheet, // Image
    sourceX, // Source X (frame column)
    sourceY, // Source Y (row for direction)
    FRAME_WIDTH, // Source width
    FRAME_HEIGHT, // Source height
    player.x, // Destination X
    player.y, // Destination Y
    player.width, // Destination width
    player.height // Destination height
  );

  // Draw the machine as a rectangle
  ctx.fillStyle = mriMachine.color;
  ctx.fillRect(mriMachine.x, mriMachine.y, mriMachine.width, mriMachine.height);
}
