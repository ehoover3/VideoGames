// menuHandler.js
import { MENU_OPTIONS, STATES } from "./constants.js";

const mainMenuOptions = [MENU_OPTIONS.START_NEW_GAME, MENU_OPTIONS.LOAD_GAME, MENU_OPTIONS.SETTINGS, MENU_OPTIONS.EXIT];

export function handleMainMenu(keys, selectedMenuOption, setSelectedMenuOption, handleMenuSelection) {
  if (keys["ArrowUp"]) {
    setSelectedMenuOption((selectedMenuOption - 1 + mainMenuOptions.length) % mainMenuOptions.length);
    keys["ArrowUp"] = false;
  }
  if (keys["ArrowDown"]) {
    setSelectedMenuOption((selectedMenuOption + 1) % mainMenuOptions.length);
    keys["ArrowDown"] = false;
  }
  if (keys["Enter"]) {
    handleMenuSelection();
    keys["Enter"] = false; // Prevent multiple triggers
  }
}

export function handleMenuSelection(selectedMenuOption, previousState, currentState, isGameStarted, setCurrentState, setIsGameStarted) {
  const selected = mainMenuOptions[selectedMenuOption];
  switch (selected) {
    case !isGameStarted && MENU_OPTIONS.START_NEW_GAME:
      setCurrentState(STATES.OVERWORLD);
      setIsGameStarted(true);
      break;
    case isGameStarted && MENU_OPTIONS.START_NEW_GAME:
      if (previousState === STATES.MEDICAL_SCANS_GAME) {
        setCurrentState(STATES.MEDICAL_SCANS_GAME);
      } else {
        setCurrentState(previousState);
      }
      setIsGameStarted(true);
      break;
    case MENU_OPTIONS.LOAD_GAME:
      alert("Load Game functionality is not implemented yet.");
      break;
    case MENU_OPTIONS.SETTINGS:
      alert("Settings functionality is not implemented yet.");
      break;
    case MENU_OPTIONS.EXIT:
      alert("Exiting the game...");
      break;
  }
}

// mainMenu.js
// export const mainMenuOptions = ["Start New Game", "Load Game", "Settings", "Exit"];

export function drawMainMenu(ctx, canvas, drawText, isGameStarted, selectedOption) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawText("Welcome to the Game", canvas.width / 2, canvas.height / 4, "30px Arial");
  let options = [...mainMenuOptions];
  if (isGameStarted) options[0] = "Return to Game";

  options.forEach((option, index) => {
    drawText(option, canvas.width / 2, canvas.height / 2 + index * 30, "20px Arial", index === selectedOption ? "blue" : "black");
  });
}
