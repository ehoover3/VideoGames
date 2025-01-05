// menu.js

import { STATES } from "../config/constants.js";

const MENU_OPTIONS = {
  START_NEW_GAME: "Start New Game",
  LOAD_GAME: "Load Game",
  SETTINGS: "Settings",
  EXIT: "Exit",
  RETURN_TO_GAME: "Return to Game",
};

const menu = [MENU_OPTIONS.START_NEW_GAME, MENU_OPTIONS.LOAD_GAME, MENU_OPTIONS.SETTINGS, MENU_OPTIONS.EXIT];

function updateSelectedOption(keys, selectedMenuOption, setSelectedMenuOption) {
  if (keys["ArrowUp"]) {
    setSelectedMenuOption((selectedMenuOption - 1 + menu.length) % menu.length);
    keys["ArrowUp"] = false;
  }
  if (keys["ArrowDown"]) {
    setSelectedMenuOption((selectedMenuOption + 1) % menu.length);
    keys["ArrowDown"] = false;
  }
}

function handleEnterKey(keys, handleMenuSelection) {
  if (keys["Enter"]) {
    handleMenuSelection();
    keys["Enter"] = false; // Prevent multiple triggers
  }
}

export function handleMainMenu(keys, selectedMenuOption, setSelectedMenuOption, handleMenuSelection) {
  updateSelectedOption(keys, selectedMenuOption, setSelectedMenuOption);
  handleEnterKey(keys, handleMenuSelection);
}

function handleStartNewGame(isGameStarted, previousState, setCurrentState, setIsGameStarted) {
  if (isGameStarted) {
    const state = previousState === STATES.MEDICAL_SCANS_GAME ? STATES.MEDICAL_SCANS_GAME : previousState;
    setCurrentState(state);
  } else {
    setCurrentState(STATES.OVERWORLD);
    setIsGameStarted(true);
  }
}

function handleExitGame() {
  alert("Exiting the game...");
}

function handleLoadGame() {
  alert("Load Game functionality is not implemented yet.");
}

function handleSettings() {
  alert("Settings functionality is not implemented yet.");
}

export function handleMenuSelection(selectedMenuOption, previousState, currentState, isGameStarted, setCurrentState, setIsGameStarted) {
  const selected = menu[selectedMenuOption];
  switch (selected) {
    case MENU_OPTIONS.START_NEW_GAME:
      handleStartNewGame(isGameStarted, previousState, setCurrentState, setIsGameStarted);
      break;
    case MENU_OPTIONS.LOAD_GAME:
      handleLoadGame();
      break;
    case MENU_OPTIONS.SETTINGS:
      handleSettings();
      break;
    case MENU_OPTIONS.EXIT:
      handleExitGame();
      break;
  }
}

export function drawMainMenu(ctx, canvas, drawText, isGameStarted, selectedOption) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawText("Welcome to the Game", canvas.width / 2, canvas.height / 4, "30px Arial");

  let options = [...menu];
  if (isGameStarted) options[0] = MENU_OPTIONS.RETURN_TO_GAME;

  options.forEach((option, index) => {
    drawText(option, canvas.width / 2, canvas.height / 2 + index * 30, "20px Arial", index === selectedOption ? "blue" : "black");
  });
}
