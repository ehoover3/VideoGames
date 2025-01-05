// event_manager.js  # Event handler and triggers

export function handleEscapeKey(keys, currentState, previousState, player, savedPlayerPosition, STATES) {
  if (keys["Escape"]) {
    previousState = currentState;
    savedPlayerPosition.x = player.x;
    savedPlayerPosition.y = player.y;
    currentState = STATES.MAIN_MENU;
  }
  return { currentState, previousState, savedPlayerPosition };
}
