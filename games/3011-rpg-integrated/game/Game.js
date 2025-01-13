// game/Game.js
import { ACTIONS, STATES } from "../config/constants.js";
import { DIRECTION } from "../config/constants.js";
import GameObject from "./GameObject.js";
import NPC from "./NPC.js";
import Player from "./Player.js";

export default class Game {
  constructor() {
    this.gameState = {
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

    this.loadedImages = {
      ball: this.loadImage("assets/images/overworld/tennisBall.png"),
      dog: this.loadImage("assets/images/overworld/dog.png"),
      mri: this.loadImage("assets/images/overworld/mri.png"),
      player: this.loadImage("assets/images/overworld/player.png"),
    };

    this.gameObjects = this.initGameObjects();
  }

  loadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
  }

  initGameObjects() {
    const player = new Player(this.loadedImages["player"], 100, 100, 32, 32, 4, DIRECTION.DOWN);

    const dog = new NPC({
      imgPath: this.loadedImages["dog"],
      imgSourceX: 0,
      imgSourceY: 0,
      imgSourceWidth: 489,
      imgSourceHeight: 510,
      x: 50,
      y: 50,
      width: 32,
      height: 32,
      interactionText: "Woof woof!",
    });

    const mri = new GameObject({
      imgPath: this.loadedImages["mri"],
      imgSourceX: 0,
      imgSourceY: 0,
      imgSourceWidth: 556,
      imgSourceHeight: 449,
      x: 130,
      y: 130,
      width: 64,
      height: 64,
    });

    const ball = new GameObject({
      imgPath: this.loadedImages["ball"],
      imgSourceX: 0,
      imgSourceY: 0,
      imgSourceWidth: 155,
      imgSourceHeight: 155,
      x: 76,
      y: 130,
      width: 16,
      height: 16,
    });

    return { ball, dog, mri, player };
  }
}
