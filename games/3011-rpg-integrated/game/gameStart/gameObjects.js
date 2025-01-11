// game/gameObjects.js

import { DIRECTION } from "../../config/constants.js";

const loadedImages = {
  mri: loadImage("assets/images/overworld/mri.png"),
};

export function initGameObjects() {
  const player = createPlayer(100, 100, 32, 32, 4, DIRECTION.DOWN);

  const mriMachine = createGameObject(130, 130, 64, 64, "mri", {
    sourceX: 0,
    sourceY: 0,
    sourceWidth: 556,
    sourceHeight: 449,
    destinationX: 0,
    destinationY: 0,
    destinationWidth: 32,
    destinationHeight: 32,
  });

  const xrayMachine = createGameObject(70, 130, 32, 32, "mri", {
    sourceX: 0,
    sourceY: 0,
    sourceWidth: 556,
    sourceHeight: 449,
    destinationX: 0,
    destinationY: 0,
    destinationWidth: 32,
    destinationHeight: 32,
  });

  return { player, mriMachine, xrayMachine };
}

function loadImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}

export function createPlayer(x, y, width, height, speed, direction) {
  return { x, y, width, height, speed, direction };
}

function createGameObject(x, y, width, height, imageKey, imageConfig, interactCallback) {
  return {
    x,
    y,
    width,
    height,
    image: {
      imagePath: loadedImages[imageKey],
      ...imageConfig,
    },
    interact: interactCallback || (() => {}),
  };
}
