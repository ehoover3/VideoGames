// globalState.js

const STATES = {
  MAIN_MENU: "mainMenu",
  OVERWORLD: "overworld",
  MEDICAL_SCANS_GAME: "medicalScansGame",
};

const globalState = {
  data: {
    currentState: STATES.MAIN_MENU,
    previousState: STATES.MAIN_MENU,
    savedPlayerPosition: { x: 0, y: 0 },
  },

  getCurrentState() {
    return this.data.currentState;
  },

  getPreviousState() {
    return this.data.previousState;
  },

  getSavedPlayerPosition() {
    return this.data.savedPlayerPosition;
  },

  setCurrentState(state) {
    this.data.previousState = this.data.currentState;
    this.data.currentState = state;
  },

  setPreviousState(state) {
    this.data.previousState = state;
  },

  setSavedPlayerPosition(position) {
    this.data.savedPlayerPosition = position;
  },
};

export default globalState;
