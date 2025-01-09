// game/draw/menu.js

import { MENU_OPTIONS, BASE_MENU } from "../gameLoop/menu.js";
import { drawText } from "./utils.js";

const menuBackground = new Image();
menuBackground.src = "assets/images/menu.jpeg";

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
