import { handleMenu, handleMenuSelection } from "../menu/index.js";
import { drawMenu } from "../draw.js";

export function loadMenu(menu) {
  let { keys, gameState, ctx, canvas } = menu;
  let menuState = { keys, gameState };

  handleMenu(
    menuState,
    (newSelected) => (gameState.selectedMenuOption = newSelected),
    () => {
      handleMenuSelection(
        gameState.selectedMenuOption,
        gameState.previousState,
        gameState.isGameStarted,
        (newState) => (gameState.currentState = newState),
        (newGameStarted) => (gameState.isGameStarted = newGameStarted)
      );
    }
  );
  drawMenu(ctx, canvas, gameState.isGameStarted, gameState.selectedMenuOption);
}
