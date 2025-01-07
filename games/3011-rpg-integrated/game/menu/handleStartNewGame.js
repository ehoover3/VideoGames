import { STATES } from "../../config/constants.js";

export function handleStartNewGame(setCurrentState, setIsGameStarted) {
  setCurrentState(STATES.OVERWORLD);
  setIsGameStarted(true);
}
