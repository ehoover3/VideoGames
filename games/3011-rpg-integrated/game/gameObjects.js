// game/gameObjects.js
import { DIRECTION } from "../config/constants.js";

export function initGameObjects() {
  const player = createPlayer(100, 100, 32, 32, "blue", 4, DIRECTION.DOWN);
  const mriMachine = createGameObject(130, 130, 32, 32, "grey");
  const xrayMachine = createGameObject(70, 130, 32, 32, "green");
  return { player, mriMachine, xrayMachine };
}

export function createPlayer(x, y, width, height, color, speed, direction) {
  return { x, y, width, height, color, speed, direction };
}

export function createGameObject(x, y, width, height, color) {
  return { x, y, width, height, color };
}
