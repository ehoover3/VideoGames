// game/gameLoop/menu.js

import { updateMenu } from "../menu/index.js";
import { drawMenu } from "../draw.js";

export const MENU_OPTIONS = {
  START_NEW_GAME: "Start New Game",
  RETURN_TO_GAME: "Return to Game",
  LOAD_GAME: "Load Game",
  SETTINGS: "Settings",
  EXIT: "Exit",
};

export const BASE_MENU = [MENU_OPTIONS.START_NEW_GAME, MENU_OPTIONS.LOAD_GAME, MENU_OPTIONS.SETTINGS, MENU_OPTIONS.EXIT];

export function loadMenu(menu) {
  let { keys, gameState, ctx, canvas } = menu;
  let menuState = { keys, gameState };
  let drawMenuState = { ctx: ctx, canvas: canvas, isGameStarted: gameState.isGameStarted, selectedOption: gameState.selectedMenuOption };

  updateMenu(menuState);
  drawMenu(drawMenuState);
}
