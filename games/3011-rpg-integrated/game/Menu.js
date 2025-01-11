// game/menu/index.js

import { STATES } from "../config/constants.js";
import { drawText } from "./utils/drawText.js";
const menuBackground = new Image();
menuBackground.src = "assets/images/menu/menu.jpeg";

const TITLE_HEIGHT_RATIO = 1 / 12;
const MENU_START_Y_RATIO = 1 / 2.5;
const MENU_SPACING_RATIO = 1 / 11;
const MENU_FONT_SIZE_RATIO = 1 / 20;
const BUTTON_PADDING_RATIO = 1 / 40;
const BUTTON_WIDTH_RATIO = 0.25;
const BUTTON_RADIUS_RATIO = 0.5;
const SHADOW_BLUR = 0;
const SHADOW_OFFSET_X = 2;
const SHADOW_OFFSET_Y = 2;
const SHADOW_COLOR = "rgba(0, 0, 0, 0.2)";
const BUTTON_COLOR_SELECTED = "orange";
const BUTTON_COLOR_DEFAULT = "white";
const TEXT_COLOR_SELECTED = "white";
const TEXT_COLOR_DEFAULT = "black";
const STROKE_COLOR = "lightgrey";

export const MENU_OPTIONS = {
  START_NEW_GAME: "Start New Game",
  RETURN_TO_GAME: "Return to Game",
  LOAD_GAME: "Load Game",
  SETTINGS: "Settings",
  EXIT: "Exit",
};

export const BASE_MENU = [MENU_OPTIONS.START_NEW_GAME, MENU_OPTIONS.LOAD_GAME, MENU_OPTIONS.SETTINGS, MENU_OPTIONS.EXIT];

export function loadMenu({ canvas, ctx, keys, gameState }) {
  let menuState = { keys, gameState };
  let drawMenuState = { canvas: canvas, ctx: ctx, isGameStarted: gameState.isGameStarted, selectedOption: gameState.selectedMenuOption };

  updateMenu(menuState);
  drawMenu(drawMenuState);
}

export function updateMenu({ keys, gameState }) {
  let selectedMenuOption = gameState.selectedMenuOption;

  function setCurrentState(newState) {
    gameState.currentState = newState;
  }

  function setIsGameStarted(newGameStarted) {
    gameState.isGameStarted = newGameStarted;
  }

  function setSelectedMenuOption(newSelected) {
    gameState.selectedMenuOption = newSelected;
  }

  function handleLoadGame() {
    alert("Load Game functionality is not implemented yet.");
  }

  function handleMenuSelection() {
    const menu = gameState.isGameStarted ? [MENU_OPTIONS.RETURN_TO_GAME, ...BASE_MENU.slice(1)] : BASE_MENU;
    const selected = menu[selectedMenuOption];

    switch (selected) {
      case MENU_OPTIONS.START_NEW_GAME:
        handleStartNewGame(setCurrentState, setIsGameStarted);
        break;
      case MENU_OPTIONS.RETURN_TO_GAME:
        handleReturnToGame(gameState.previousState, setCurrentState);
        break;
      case MENU_OPTIONS.LOAD_GAME:
        handleLoadGame();
        break;
      case MENU_OPTIONS.SETTINGS:
        handleSettings();
        break;
      case MENU_OPTIONS.EXIT:
        handleExit();
        break;
      default:
        console.warn("Invalid menu option selected");
    }
  }

  let menuLength = BASE_MENU.length;
  let selectedOptionsState = { keys, selectedMenuOption, setSelectedMenuOption, menuLength };

  updateSelectedOption(selectedOptionsState);
  handleEnterKey(keys, handleMenuSelection);
}

function updateSelectedOption({ keys, selectedMenuOption, setSelectedMenuOption, menuLength }) {
  if (keys["ArrowUp"]) {
    setSelectedMenuOption((selectedMenuOption - 1 + menuLength) % menuLength);
    keys["ArrowUp"] = false;
  }
  if (keys["ArrowDown"]) {
    setSelectedMenuOption((selectedMenuOption + 1) % menuLength);
    keys["ArrowDown"] = false;
  }
}

function handleEnterKey(keys, handleMenuSelection) {
  if (keys["Enter"]) {
    handleMenuSelection();
    keys["Enter"] = false; // Prevent multiple triggers
  }
}

function handleReturnToGame(previousState, setCurrentState) {
  const stateMap = {
    [STATES.SCAN_GAME]: STATES.SCAN_GAME,
  };
  const state = stateMap[previousState] || previousState;
  setCurrentState(state);
}

function handleSettings() {
  alert("Settings functionality is not implemented yet.");
}

function handleStartNewGame(setCurrentState, setIsGameStarted) {
  setCurrentState(STATES.OVERWORLD);
  setIsGameStarted(true);
}

function handleExit() {
  alert("Exiting the game...");
}

export function drawMenu(drawMenuState) {
  const { canvas, ctx, isGameStarted, selectedOption } = drawMenuState;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the background image
  ctx.drawImage(menuBackground, 0, 0, menuBackground.width, menuBackground.height, 0, 0, canvas.width, canvas.height);

  // Draw the title
  const titleFontSize = Math.round(canvas.height * TITLE_HEIGHT_RATIO);
  drawText(ctx, "Science Game", canvas.width / 2, canvas.height / 4, `${titleFontSize}px Arial`, "black");

  // Determine the menu options
  const menu = isGameStarted ? [MENU_OPTIONS.RETURN_TO_GAME, ...BASE_MENU.slice(1)] : BASE_MENU;

  // Dynamic menu item spacing
  const menuStartY = canvas.height * MENU_START_Y_RATIO;
  const menuSpacing = canvas.height * MENU_SPACING_RATIO;
  const menuFontSize = Math.round(canvas.height * MENU_FONT_SIZE_RATIO);
  const buttonPadding = canvas.height * BUTTON_PADDING_RATIO;

  // Draw each menu option
  menu.forEach((option, index) => {
    const isSelected = index === selectedOption;

    // Calculate button dimensions
    const buttonWidth = canvas.width * BUTTON_WIDTH_RATIO;
    const buttonHeight = menuFontSize + buttonPadding;
    const buttonX = (canvas.width - buttonWidth) * BUTTON_RADIUS_RATIO;
    const buttonY = menuStartY + index * menuSpacing - buttonHeight;

    // Set colors for the button and text
    const buttonColor = isSelected ? BUTTON_COLOR_SELECTED : BUTTON_COLOR_DEFAULT;
    const textColor = isSelected ? TEXT_COLOR_SELECTED : TEXT_COLOR_DEFAULT;
    const shadowColor = SHADOW_COLOR;

    // Draw the button with rounded corners
    ctx.beginPath();
    ctx.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, buttonHeight / 2);
    ctx.fillStyle = buttonColor;
    ctx.fill();
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = SHADOW_BLUR;
    ctx.shadowOffsetX = SHADOW_OFFSET_X;
    ctx.shadowOffsetY = SHADOW_OFFSET_Y;
    ctx.strokeStyle = STROKE_COLOR;
    ctx.stroke();
    ctx.shadowBlur = SHADOW_BLUR;

    drawText(ctx, option, canvas.width / 2, buttonY + buttonHeight / 2 + menuFontSize / 3, `${menuFontSize}px Arial`, textColor);
  });
}
