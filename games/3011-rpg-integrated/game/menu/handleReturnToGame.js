import { STATES } from "../../config/constants.js";

export function handleReturnToGame(previousState, setCurrentState) {
  const stateMap = {
    [STATES.SCAN_GAME]: STATES.SCAN_GAME,
  };
  const state = stateMap[previousState] || previousState;
  setCurrentState(state);
}
