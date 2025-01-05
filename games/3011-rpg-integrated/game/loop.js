export function startGameLoop({ ctx, canvas, keys, gameState, player, mriMachine, xrayMachine, drawText, handleMainMenu, handleMenuSelection, drawMainMenu, updatePlayer, drawOverworld, drawHUD, drawMedicalScansGame, updateMedScanLogic, STATES, WALK_FRAMES, ATTACK_FRAMES, FRAME_WIDTH, FRAME_HEIGHT }) {
  function handleMenu() {
    handleMainMenu(
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

    drawMainMenu(ctx, canvas, drawText, gameState.isGameStarted, gameState.selectedMenuOption);
  }

  function handleOverworld() {
    const updatedState = updatePlayer(player, keys, gameState.currentAction, gameState.animationTimer, gameState.animationSpeed, WALK_FRAMES, ATTACK_FRAMES, gameState.currentFrame, mriMachine, STATES, gameState.currentState, gameState.previousState, gameState.savedPlayerPosition);

    Object.assign(gameState, {
      currentState: updatedState.currentState,
      previousState: updatedState.previousState,
      savedPlayerPosition: updatedState.savedPlayerPosition,
    });

    drawOverworld(ctx, canvas, player, gameState.currentFrame, FRAME_WIDTH, FRAME_HEIGHT, mriMachine, xrayMachine);
    drawHUD(ctx, canvas, gameState.currentState, STATES, drawText);
  }

  function handleScanGame() {
    const updatedValues = updateMedScanLogic(keys, gameState.scanning, gameState.scanProgress, gameState.maxScanProgress, gameState.currentState, player, gameState.previousState, STATES, gameState.savedPlayerPosition);

    Object.assign(gameState, {
      scanProgress: updatedValues.scanProgress,
      scanning: updatedValues.scanning,
      currentState: updatedValues.currentState,
      previousState: updatedValues.previousState,
    });

    drawMedicalScansGame(ctx, canvas, gameState.scanProgress, gameState.maxScanProgress);
    drawHUD(ctx, canvas, gameState.currentState, STATES, drawText);
  }

  function gameLoop() {
    switch (gameState.currentState) {
      case STATES.MAIN_MENU:
        handleMenu();
        break;
      case STATES.OVERWORLD:
        handleOverworld();
        break;
      case STATES.SCAN_GAME:
        handleScanGame();
        break;
    }

    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}
