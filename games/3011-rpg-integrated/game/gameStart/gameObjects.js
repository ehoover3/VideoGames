// game/gameObjects.js

import { GameObject } from "./GameObject.js";
import { DIRECTION } from "../../config/constants.js";
import { Player } from "./Player.js";

const loadedImages = {
  mri: loadImage("assets/images/overworld/mri.png"),
  player: loadImage("assets/images/overworld/player.png"),
};

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

function loadImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}
