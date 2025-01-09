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
  drawText(ctx, "Science Game", canvas.width / 2, canvas.height / 4, `${titleFontSize}px Arial`, "black");

  // Determine the menu options
  const menu = isGameStarted ? [MENU_OPTIONS.RETURN_TO_GAME, ...BASE_MENU.slice(1)] : BASE_MENU;

  // Dynamic menu item spacing
  const menuStartY = canvas.height / 2.5; // Starting Y position for menu options
  const menuSpacing = canvas.height / 11; // Space between menu options
  const menuFontSize = Math.round(canvas.height / 20); // Font size based on canvas height
  const buttonPadding = canvas.height / 40; // Padding around the text in the button

  // Draw each menu option
  menu.forEach((option, index) => {
    const isSelected = index === selectedOption;

    // Calculate button dimensions
    const buttonWidth = canvas.width * 0.25; // 60% of canvas width
    const buttonHeight = menuFontSize + buttonPadding * 1;
    const buttonX = (canvas.width - buttonWidth) / 2;
    const buttonY = menuStartY + index * menuSpacing - buttonHeight;

    // Set colors for the button and text
    const buttonColor = isSelected ? "orange" : "white";
    const textColor = isSelected ? "white" : "black";
    const shadowColor = "rgba(0, 0, 0, 0.2)";

    // Draw the button with rounded corners
    ctx.beginPath();
    ctx.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, buttonHeight / 2); // Rounded corners
    ctx.fillStyle = buttonColor;
    ctx.fill();
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.strokeStyle = "lightgrey";
    ctx.stroke();
    ctx.shadowBlur = 0; // Reset shadow

    // Draw the text on the button
    drawText(ctx, option, canvas.width / 2, buttonY + buttonHeight / 2 + menuFontSize / 3, `${menuFontSize}px Arial`, textColor);
  });
}

// Helper function to draw rounded rectangles (if not already implemented)
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x + r, y);
  this.arcTo(x + w, y, x + w, y + h, r);
  this.arcTo(x + w, y + h, x, y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x + w, y, r);
  this.closePath();
  return this;
};

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
