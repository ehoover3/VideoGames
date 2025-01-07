// game/gameLoop/menu.js

import { updateMenu } from "../menu/index.js";
import { drawMenu } from "../draw.js";

export function loadMenu(menu) {
  let { keys, gameState, ctx, canvas } = menu;
  let menuState = { keys, gameState };
  let drawMenuState = { ctx: ctx, canvas: canvas, isGameStarted: gameState.isGameStarted, selectedOption: gameState.selectedMenuOption };

  updateMenu(menuState);
  drawMenu(drawMenuState);
}
