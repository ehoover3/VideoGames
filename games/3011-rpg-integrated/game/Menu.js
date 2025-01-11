// game/Menu.js

import { STATES } from "../config/constants.js";
import { drawText } from "./utils/drawText.js";

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

const MENU_OPTIONS = {
  START_NEW_GAME: "Start New Game",
  RETURN_TO_GAME: "Return to Game",
  LOAD_GAME: "Load Game",
  SETTINGS: "Settings",
  EXIT: "Exit",
};

const menuBackground = new Image();
menuBackground.src = "assets/images/menu/menu.jpeg";

const BASE_MENU = [MENU_OPTIONS.START_NEW_GAME, MENU_OPTIONS.LOAD_GAME, MENU_OPTIONS.SETTINGS, MENU_OPTIONS.EXIT];

export class Menu {
  constructor(canvas, ctx, keys, gameState) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.keys = keys;
    this.gameState = gameState;
  }

  load() {
    this.updateMenu();
    this.drawMenu();
  }

  updateMenu() {
    const { keys, gameState } = this;
    let { selectedMenuOption } = gameState;

    const setCurrentState = (newState) => {
      gameState.currentState = newState;
    };

    const setIsGameStarted = (newGameStarted) => {
      gameState.isGameStarted = newGameStarted;
    };

    const setSelectedMenuOption = (newSelected) => {
      gameState.selectedMenuOption = newSelected;
    };

    const handleLoadGame = () => {
      alert("Load Game functionality is not implemented yet.");
    };

    const handleMenuSelection = () => {
      const menu = gameState.isGameStarted ? [MENU_OPTIONS.RETURN_TO_GAME, ...BASE_MENU.slice(1)] : BASE_MENU;
      const selected = menu[selectedMenuOption];

      switch (selected) {
        case MENU_OPTIONS.START_NEW_GAME:
          this.handleStartNewGame(setCurrentState, setIsGameStarted);
          break;
        case MENU_OPTIONS.RETURN_TO_GAME:
          this.handleReturnToGame(gameState.previousState, setCurrentState);
          break;
        case MENU_OPTIONS.LOAD_GAME:
          handleLoadGame();
          break;
        case MENU_OPTIONS.SETTINGS:
          this.handleSettings();
          break;
        case MENU_OPTIONS.EXIT:
          this.handleExit();
          break;
        default:
          console.warn("Invalid menu option selected");
      }
    };

    const menuLength = BASE_MENU.length;

    if (keys["ArrowUp"]) {
      setSelectedMenuOption((selectedMenuOption - 1 + menuLength) % menuLength);
      keys["ArrowUp"] = false;
    }
    if (keys["ArrowDown"]) {
      setSelectedMenuOption((selectedMenuOption + 1) % menuLength);
      keys["ArrowDown"] = false;
    }

    if (keys["Enter"]) {
      handleMenuSelection();
      keys["Enter"] = false;
    }
  }

  handleReturnToGame(previousState, setCurrentState) {
    const stateMap = {
      [STATES.SCAN_GAME]: STATES.SCAN_GAME,
    };
    const state = stateMap[previousState] || previousState;
    setCurrentState(state);
  }

  handleSettings() {
    alert("Settings functionality is not implemented yet.");
  }

  handleStartNewGame(setCurrentState, setIsGameStarted) {
    setCurrentState(STATES.OVERWORLD);
    setIsGameStarted(true);
  }

  handleExit() {
    alert("Exiting the game...");
  }

  drawMenu() {
    const { canvas, ctx, gameState } = this;
    const isGameStarted = gameState.isGameStarted;
    const selectedOption = gameState.selectedMenuOption;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(menuBackground, 0, 0, menuBackground.width, menuBackground.height, 0, 0, canvas.width, canvas.height);

    const titleFontSize = Math.round(canvas.height * TITLE_HEIGHT_RATIO);
    drawText(ctx, "Science Game", canvas.width / 2, canvas.height / 4, `${titleFontSize}px Arial`, "black");

    const menu = isGameStarted ? [MENU_OPTIONS.RETURN_TO_GAME, ...BASE_MENU.slice(1)] : BASE_MENU;

    const menuStartY = canvas.height * MENU_START_Y_RATIO;
    const menuSpacing = canvas.height * MENU_SPACING_RATIO;
    const menuFontSize = Math.round(canvas.height * MENU_FONT_SIZE_RATIO);
    const buttonPadding = canvas.height * BUTTON_PADDING_RATIO;

    menu.forEach((option, index) => {
      const isSelected = index === selectedOption;

      const buttonWidth = canvas.width * BUTTON_WIDTH_RATIO;
      const buttonHeight = menuFontSize + buttonPadding;
      const buttonX = (canvas.width - buttonWidth) * BUTTON_RADIUS_RATIO;
      const buttonY = menuStartY + index * menuSpacing - buttonHeight;

      const buttonColor = isSelected ? BUTTON_COLOR_SELECTED : BUTTON_COLOR_DEFAULT;
      const textColor = isSelected ? TEXT_COLOR_SELECTED : TEXT_COLOR_DEFAULT;

      ctx.beginPath();
      ctx.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, buttonHeight / 2);
      ctx.fillStyle = buttonColor;
      ctx.fill();
      ctx.shadowColor = SHADOW_COLOR;
      ctx.shadowBlur = SHADOW_BLUR;
      ctx.shadowOffsetX = SHADOW_OFFSET_X;
      ctx.shadowOffsetY = SHADOW_OFFSET_Y;
      ctx.strokeStyle = STROKE_COLOR;
      ctx.stroke();
      ctx.shadowBlur = SHADOW_BLUR;

      drawText(ctx, option, canvas.width / 2, buttonY + buttonHeight / 2 + menuFontSize / 3, `${menuFontSize}px Arial`, textColor);
    });
  }
}
