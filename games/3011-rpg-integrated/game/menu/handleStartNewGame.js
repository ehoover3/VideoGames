export function handleStartNewGame(setCurrentState, setIsGameStarted, STATES) {
  setCurrentState(STATES.OVERWORLD);
  setIsGameStarted(true);
}
