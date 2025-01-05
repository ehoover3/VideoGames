export function handleReturnToGame(previousState, setCurrentState, STATES) {
  const stateMap = {
    [STATES.SCAN_GAME]: STATES.SCAN_GAME,
  };
  const state = stateMap[previousState] || previousState;
  setCurrentState(state);
}
