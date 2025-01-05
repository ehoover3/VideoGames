import { updatePlayer } from "./player.js";
import { STATES, ACTIONS, FRAME_WIDTH, FRAME_HEIGHT, WALK_FRAMES, ATTACK_FRAMES } from "../config/constants.js";
import { handleMainMenu, handleMenuSelection, drawMainMenu } from "./menu/index.js";
import { drawOverworld } from "./world.js";
import { drawHUD } from "./hud.js";
import { drawMedicalScansGame, updateMedScanLogic } from "./minigames/medScan.js";

export function gameLoop({ ctx, canvas, keys, player, mriMachine, xrayMachine, drawText, animationSettings, gameState }) {
  const { currentState, previousState, savedPlayerPosition, isGameStarted, selectedMenuOption, currentFrame, animationTimer, animationSpeed, currentAction, scanProgress, maxScanProgress, scanning } = gameState;

  switch (currentState) {
    case STATES.MAIN_MENU:
      handleMainMenu(
        keys,
        selectedMenuOption,
        (newSelected) => {
          gameState.selectedMenuOption = newSelected;
        },
        () =>
          handleMenuSelection(
            selectedMenuOption,
            previousState,
            currentState,
            isGameStarted,
            (newState) => {
              gameState.currentState = newState;
            },
            (newGameStarted) => {
              gameState.isGameStarted = newGameStarted;
            }
          )
      );
      drawMainMenu(ctx, canvas, drawText, isGameStarted, selectedMenuOption);
      break;
    case STATES.OVERWORLD:
      let updatedState = updatePlayer(player, keys, currentAction, animationTimer, animationSpeed, WALK_FRAMES, ATTACK_FRAMES, currentFrame, mriMachine, STATES, currentState, previousState, savedPlayerPosition);
      gameState.currentState = updatedState.currentState;
      gameState.previousState = updatedState.previousState;
      gameState.savedPlayerPosition = updatedState.savedPlayerPosition;
      drawOverworld(ctx, canvas, player, currentFrame, FRAME_WIDTH, FRAME_HEIGHT, mriMachine, xrayMachine);
      drawHUD(ctx, canvas, currentState, STATES, drawText);
      break;
    case STATES.SCAN_GAME:
      const updatedValues = updateMedScanLogic(keys, scanning, scanProgress, maxScanProgress, currentState, player, previousState, STATES, savedPlayerPosition);
      gameState.scanProgress = updatedValues.scanProgress;
      gameState.scanning = updatedValues.scanning;
      gameState.currentState = updatedValues.currentState;
      gameState.previousState = updatedValues.previousState;
      drawMedicalScansGame(ctx, canvas, scanProgress, maxScanProgress);
      drawHUD(ctx, canvas, currentState, STATES, drawText);
      break;
  }

  requestAnimationFrame(() =>
    gameLoop({
      ctx,
      canvas,
      keys,
      player,
      mriMachine,
      xrayMachine,
      drawText,
      animationSettings,
      gameState,
    })
  );
}
