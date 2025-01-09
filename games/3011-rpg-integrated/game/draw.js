// draw.js
import { MENU_OPTIONS, BASE_MENU } from "../game/gameLoop/menu.js";
import { STATES, FRAME_SETTINGS } from "../config/constants.js";
import { ASPECT_RATIO } from "../index.js";
const playerSpriteSheet = new Image();
playerSpriteSheet.src = "assets/images/player.png";

const menuBackground = new Image();
menuBackground.src = "assets/images/menu.jpeg";

const DIRECTIONS = {
  down: 0,
  up: 1,
  left: 2,
  right: 3,
};

export function drawMenu(drawMenuState) {
  const { canvas, ctx, isGameStarted, selectedOption } = drawMenuState;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the background image
  ctx.drawImage(menuBackground, 0, 0, menuBackground.width, menuBackground.height, 0, 0, canvas.width, canvas.height);

  // Draw the title
  const titleFontSize = Math.round(canvas.height / 12); // Scales with canvas size
  drawText(ctx, "Science Game", canvas.width / 2, canvas.height / 5, `${titleFontSize}px Arial`, "black");

  // Determine the menu options
  const menu = isGameStarted ? [MENU_OPTIONS.RETURN_TO_GAME, ...BASE_MENU.slice(1)] : BASE_MENU;

  // Dynamic menu item spacing
  const menuStartY = canvas.height / 2.5; // Starting Y position for menu options
  const menuSpacing = canvas.height / 15; // Space between menu options
  const menuFontSize = Math.round(canvas.height / 20); // Font size based on canvas height

  // Draw each menu option
  menu.forEach((option, index) => {
    const isSelected = index === selectedOption;
    const textColor = isSelected ? "orange" : "darkgrey";
    const fontStyle = isSelected
      ? `${menuFontSize + 2}px Arial ` // Highlight selected option with bold and larger font
      : `${menuFontSize}px Arial bold`;

    drawText(ctx, option, canvas.width / 2, menuStartY + index * menuSpacing, fontStyle, textColor);
  });
}

export function drawWorld({ canvas, ctx }) {
  ctx.fillStyle = "lightblue";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export function drawGameObjects({ canvas, ctx, gameObjects }) {
  let { mriMachine, xrayMachine } = gameObjects;
  drawGameObject(ctx, mriMachine);
  drawGameObject(ctx, xrayMachine);
}

function drawGameObject(ctx, object) {
  ctx.fillStyle = object.color;
  ctx.fillRect(object.x, object.y, object.width, object.height);
}

export function drawPlayer(ctx, player, currentFrame) {
  const { FRAME_WIDTH, FRAME_HEIGHT } = FRAME_SETTINGS;
  const spriteRow = DIRECTIONS[player.direction];
  const sourceX = currentFrame * FRAME_WIDTH;
  const sourceY = spriteRow * FRAME_HEIGHT;
  ctx.drawImage(playerSpriteSheet, sourceX, sourceY, FRAME_WIDTH, FRAME_HEIGHT, player.x, player.y, player.width, player.height);
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
