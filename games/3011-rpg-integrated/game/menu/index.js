// game/menu/index.js

import { handleStartNewGame } from "./startNewGame.js";
import { handleReturnToGame } from "./returnToGame.js";
import { handleLoadGame } from "./loadGame.js";
import { handleSettings } from "./settings.js";
import { handleExit } from "./exit.js";
import { MENU_OPTIONS, BASE_MENU } from "../gameLoop/menu.js";

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
