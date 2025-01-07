import { handleMenu, handleMenuSelection } from "../menu/index.js";
import { drawMenu } from "../draw.js";

export function loadMenu(keys, gameState, ctx, canvas, drawText) {
  handleMenu(
    keys,
    gameState.selectedMenuOption,
    (newSelected) => (gameState.selectedMenuOption = newSelected),
    () => {
      handleMenuSelection(
        gameState.selectedMenuOption,
        gameState.previousState,
        gameState.currentState,
        gameState.isGameStarted,
        (newState) => (gameState.currentState = newState),
        (newGameStarted) => (gameState.isGameStarted = newGameStarted)
      );
    }
  );
  drawMenu(ctx, canvas, drawText, gameState.isGameStarted, gameState.selectedMenuOption);
}
