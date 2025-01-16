// game/GameState.js
import { STATES, ACTIONS, DIRECTION } from "../config/constants.js";

export default class GameState {
  constructor() {
    this.state = {
      currentState: STATES.MAIN_MENU,
      previousState: STATES.MAIN_MENU,
      player: {
        position: { x: 0, y: 0 },
        direction: DIRECTION.DOWN,
        currentAction: ACTIONS.IDLE,
      },
      game: {
        isStarted: false,
        isPaused: false,
        selectedMenuOption: 0,
      },
      animation: {
        currentFrame: 0,
        timer: 0,
        speed: 10,
      },
      scan: {
        progress: 0,
        maxProgress: 100,
        isScanning: false,
      },
    };

    this.listeners = new Set();
  }

  get currentState() {
    return this.state.currentState;
  }

  get previousState() {
    return this.state.previousState;
  }

  get playerPosition() {
    return this.state.player.position;
  }

  get isGameStarted() {
    return this.state.game.isStarted;
  }

  // State mutation methods
  setState(newState) {
    this.state.previousState = this.state.currentState;
    this.state.currentState = newState;
    this.notifyListeners();
  }

  setPlayerPosition(x, y) {
    this.state.player.position = { x, y };
    this.notifyListeners();
  }

  setPlayerDirection(direction) {
    this.state.player.direction = direction;
    this.notifyListeners();
  }

  setPlayerAction(action) {
    this.state.player.currentAction = action;
    this.notifyListeners();
  }

  setScanProgress(progress) {
    this.state.scan.progress = Math.min(progress, this.state.scan.maxProgress);
    this.notifyListeners();
  }

  setMenuOption(option) {
    this.state.game.selectedMenuOption = option;
    this.notifyListeners();
  }

  startGame() {
    this.state.game.isStarted = true;
    this.notifyListeners();
  }

  pauseGame() {
    this.state.game.isPaused = true;
    this.notifyListeners();
  }

  resumeGame() {
    this.state.game.isPaused = false;
    this.notifyListeners();
  }

  updateAnimation(deltaTime) {
    this.state.animation.timer += deltaTime;
    if (this.state.animation.timer >= this.state.animation.speed) {
      this.state.animation.currentFrame = (this.state.animation.currentFrame + 1) % 4; // Assuming 4 frames per animation
      this.state.animation.timer = 0;
      this.notifyListeners();
    }
  }

  addListener(listener) {
    this.listeners.add(listener);
  }

  removeListener(listener) {
    this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  serialize() {
    return JSON.stringify({
      player: this.state.player,
      game: this.state.game,
      scan: this.state.scan,
    });
  }

  deserialize(savedState) {
    const parsed = JSON.parse(savedState);
    this.state = {
      ...this.state,
      player: parsed.player,
      game: parsed.game,
      scan: parsed.scan,
    };
    this.notifyListeners();
  }
}
