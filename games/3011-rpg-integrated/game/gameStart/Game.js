// gmae/gameStart/gameState.js

import { STATES, ACTIONS } from "../../config/constants.js";

export const gameState = {
  currentState: STATES.MAIN_MENU,
  previousState: STATES.MAIN_MENU,
  savedPlayerPosition: { x: 0, y: 0 },
  isGameStarted: false,
  selectedMenuOption: 0,
  currentFrame: 0,
  animationTimer: 0,
  animationSpeed: 10,
  currentAction: ACTIONS.IDLE,
  scanProgress: 0,
  maxScanProgress: 100,
  scanning: false,
};

// game/gameObjects.js

import { GameObject } from "./GameObject.js";
import { DIRECTION } from "../../config/constants.js";
import { Player } from "./Player.js";

export function initGameObjects() {
  const player = new Player(loadedImages["player"], 100, 100, 32, 32, 4, DIRECTION.DOWN); // Use Player class here

  const mriMachine = new GameObject({
    imgPath: loadedImages["mri"],
    imgSourceX: 0,
    imgSourceY: 0,
    imgSourceWidth: 556,
    imgSourceHeight: 449,
    x: 130,
    y: 130,
    width: 64,
    height: 64,
  });

  return { player, mriMachine };
}

const loadedImages = {
  mri: loadImage("assets/images/overworld/mri.png"),
  player: loadImage("assets/images/overworld/player.png"),
};

function loadImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}
