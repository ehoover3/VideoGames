// game/Menu.js
import { drawText } from "./utils/drawText.js";
import { STATES, UI_CONFIG } from "../config/constants.js";

const SHADOW_BLUR = 0;
const SHADOW_OFFSET_X = 2;
const SHADOW_OFFSET_Y = 2;
const SHADOW_COLOR = "rgba(0, 0, 0, 0.2)";

const MENU_OPTIONS = {
  START_NEW_GAME: "Start New Game",
  RETURN_TO_GAME: "Return to Game",
  LOAD_GAME: "Load Game",
  SETTINGS: "Settings",
  EXIT: "Exit",
};

const menuBackground = new Image();
const BASE_MENU = [MENU_OPTIONS.START_NEW_GAME, MENU_OPTIONS.LOAD_GAME, MENU_OPTIONS.SETTINGS, MENU_OPTIONS.EXIT];

export default class Menu {
  constructor(canvas, ctx, keys, gameState) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.keys = keys;
    this.gameState = gameState;
  }

  load() {
    this.setBackground();
    this.updateMenu();
    this.drawMenu();
  }

  setBackground() {
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour < 18) {
      menuBackground.src = "assets/images/menu/menuDay.png";
    } else {
      menuBackground.src = "assets/images/menu/menuNight.png";
    }
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
      [STATES.MED_SCAN_GAME]: STATES.MED_SCAN_GAME,
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

    const titleFontSize = Math.round(canvas.height * UI_CONFIG.MENU.TITLE_HEIGHT_RATIO);
    drawText(ctx, "Human Again", canvas.width / 2, canvas.height / 4, `${titleFontSize}px Arial`, "black");

    const menu = isGameStarted ? [MENU_OPTIONS.RETURN_TO_GAME, ...BASE_MENU.slice(1)] : BASE_MENU;

    const menuStartY = canvas.height * UI_CONFIG.MENU.MENU_START_Y_RATIO;
    const menuSpacing = canvas.height * UI_CONFIG.MENU.SPACING_RATIO;
    const menuFontSize = Math.round(canvas.height * UI_CONFIG.MENU.FONT_SIZE_RATIO);
    const buttonPadding = canvas.height * UI_CONFIG.MENU.BUTTON.PADDING_RATIO;

    menu.forEach((option, index) => {
      const isSelected = index === selectedOption;

      const buttonWidth = canvas.width * UI_CONFIG.MENU.BUTTON.WIDTH_RATIO;
      const buttonHeight = menuFontSize + buttonPadding;
      const buttonX = (canvas.width - buttonWidth) * UI_CONFIG.MENU.BUTTON.RADIUS_RATIO;
      const buttonY = menuStartY + index * menuSpacing - buttonHeight;

      const buttonColor = isSelected ? UI_CONFIG.MENU.COLORS.SELECTED : UI_CONFIG.MENU.COLORS.TEXT_SELECTED;
      const textColor = isSelected ? UI_CONFIG.MENU.COLORS.DEFAULT : UI_CONFIG.MENU.COLORS.TEXT_DEFAULT;

      ctx.beginPath();
      ctx.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, buttonHeight / 2);
      ctx.fillStyle = buttonColor;
      ctx.fill();
      ctx.shadowColor = SHADOW_COLOR;
      ctx.shadowBlur = SHADOW_BLUR;
      ctx.shadowOffsetX = SHADOW_OFFSET_X;
      ctx.shadowOffsetY = SHADOW_OFFSET_Y;
      ctx.strokeStyle = UI_CONFIG.MENU.COLORS.STROKE;
      ctx.stroke();
      ctx.shadowBlur = SHADOW_BLUR;

      drawText(ctx, option, canvas.width / 2, buttonY + buttonHeight / 2 + menuFontSize / 3, `${menuFontSize}px Arial`, textColor);
    });
  }
}
