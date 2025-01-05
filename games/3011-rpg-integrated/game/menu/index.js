// menu/index.js

import { STATES } from "../../config/constants.js";
import { handleStartNewGame } from "./handleStartNewGame.js";
import { handleReturnToGame } from "./handleReturnToGame.js";
import { handleLoadGame } from "./handleLoadGame.js";
import { handleSettings } from "./handleSettings.js";
import { handleExit } from "./handleExit.js";

const MENU_OPTIONS = {
  START_NEW_GAME: "Start New Game",
  RETURN_TO_GAME: "Return to Game",
  LOAD_GAME: "Load Game",
  SETTINGS: "Settings",
  EXIT: "Exit",
};

const BASE_MENU = [MENU_OPTIONS.START_NEW_GAME, MENU_OPTIONS.LOAD_GAME, MENU_OPTIONS.SETTINGS, MENU_OPTIONS.EXIT];

export function handleMainMenu(keys, selectedMenuOption, setSelectedMenuOption, handleMenuSelection) {
  updateSelectedOption(keys, selectedMenuOption, setSelectedMenuOption, BASE_MENU.length);
  handleEnterKey(keys, handleMenuSelection);
}

export function handleMenuSelection(selectedMenuOption, previousState, currentState, isGameStarted, setCurrentState, setIsGameStarted) {
  const menu = isGameStarted ? [MENU_OPTIONS.RETURN_TO_GAME, ...BASE_MENU.slice(1)] : BASE_MENU;
  const selected = menu[selectedMenuOption];

  switch (selected) {
    case MENU_OPTIONS.START_NEW_GAME:
      handleStartNewGame(setCurrentState, setIsGameStarted, STATES);
      break;
    case MENU_OPTIONS.RETURN_TO_GAME:
      handleReturnToGame(previousState, setCurrentState, STATES);
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

export function drawMainMenu(ctx, canvas, drawText, isGameStarted, selectedOption) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawText("Welcome to the Game", canvas.width / 2, canvas.height / 4, "30px Arial");
  const menu = isGameStarted ? [MENU_OPTIONS.RETURN_TO_GAME, ...BASE_MENU.slice(1)] : BASE_MENU;
  menu.forEach((option, index) => {
    drawText(option, canvas.width / 2, canvas.height / 2 + index * 30, "20px Arial", index === selectedOption ? "blue" : "black");
  });
}

function updateSelectedOption(keys, selectedMenuOption, setSelectedMenuOption, menuLength) {
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
