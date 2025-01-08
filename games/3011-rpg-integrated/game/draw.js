// draw.js
import { MENU_OPTIONS, BASE_MENU } from "../game/gameLoop/menu.js";

const playerSpriteSheet = new Image();
playerSpriteSheet.src = "assets/images/player.png";

const DIRECTIONS = {
  down: 0,
  up: 1,
  left: 2,
  right: 3,
};

export function drawOverworld(canvas, ctx, gameObjects, currentFrame, FRAME_SETTINGS) {
  let { player, mriMachine, xrayMachine } = gameObjects;
  const { FRAME_WIDTH, FRAME_HEIGHT } = FRAME_SETTINGS;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayerSprite(ctx, player, currentFrame, FRAME_WIDTH, FRAME_HEIGHT);
  drawMachine(ctx, mriMachine);
  drawMachine(ctx, xrayMachine);
}

export function drawHUD(canvas, ctx, currentState, STATES) {
  ctx.fillStyle = "lightgray";
  ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
  const hudText = currentState === STATES.OVERWORLD ? "Arrow Keys to Move | Space to Interact | ESC for Main Menu" : "Hold SPACE to Scan | X to Exit to Overworld | ESC for Main Menu";
  drawText(ctx, hudText, canvas.width / 2, canvas.height - 20);
}

export function drawMenu(drawMenuState) {
  let { canvas, ctx, isGameStarted, selectedOption } = drawMenuState;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawText(ctx, "Welcome to the Game", canvas.width / 2, canvas.height / 4, "30px Arial");
  const menu = isGameStarted ? [MENU_OPTIONS.RETURN_TO_GAME, ...BASE_MENU.slice(1)] : BASE_MENU;
  menu.forEach((option, index) => {
    drawText(ctx, option, canvas.width / 2, canvas.height / 2 + index * 30, "20px Arial", index === selectedOption ? "blue" : "black");
  });
}

export function drawText(ctx, text, x, y, font = "16px Arial", color = "black", align = "center") {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
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
