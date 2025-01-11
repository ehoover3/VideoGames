// game/gameObjects.js
import { DIRECTION } from "../../config/constants.js";

const mriImg = new Image();
mriImg.src = "assets/images/overworld/mri.png";

export function initGameObjects() {
  const player = createPlayer(100, 100, 32, 32, "blue", 4, DIRECTION.DOWN);
  const mriMachine = {
    x: 130,
    y: 130,
    width: 64,
    height: 64,
    image: {
      imagePath: mriImg,
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 556,
      sourceHeight: 449,
      destiationX: 0,
      destinationY: 0,
      destinationWidth: 32,
      destinationHeight: 32,
    },
  };
  const xrayMachine = {
    x: 70,
    y: 130,
    width: 32,
    height: 32,
    image: {
      imagePath: mriImg,
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 556,
      sourceHeight: 449,
      destiationX: 0,
      destinationY: 0,
      destinationWidth: 32,
      destinationHeight: 32,
    },
  };
  return { player, mriMachine, xrayMachine };
}

export function createPlayer(x, y, width, height, color, speed, direction) {
  return { x, y, width, height, color, speed, direction };
}

function createGameObject(x, y, width, height, imageKey, interactCallback) {
  return {
    x,
    y,
    width,
    height,
    image: loadedImages[imageKey],
    interact: interactCallback || (() => {}),
  };
}
