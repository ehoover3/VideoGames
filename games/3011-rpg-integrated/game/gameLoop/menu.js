import { handleMenu, handleMenuSelection } from "../menu/index.js";
import { drawMenu } from "../draw.js";

export function loadMenu(keys, gameState, ctx, canvas) {
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
  drawMenu(ctx, canvas, gameState.isGameStarted, gameState.selectedMenuOption);
}
