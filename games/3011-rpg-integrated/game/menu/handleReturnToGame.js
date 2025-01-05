export function handleReturnToGame(previousState, setCurrentState, STATES) {
  const stateMap = {
    [STATES.MEDICAL_SCANS_GAME]: STATES.MEDICAL_SCANS_GAME,
  };
  const state = stateMap[previousState] || previousState;
  setCurrentState(state);
}
