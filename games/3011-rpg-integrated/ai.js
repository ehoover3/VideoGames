I have an image in assets/images/overworld/dog.png.
I want the player to be able to pet the dog by pressing the spacebar, then the dog says "Woof woof!"

// index.js
import GameEngine from "./game/GameEngine.js";

const gameEngine = new GameEngine("gameCanvas");
gameEngine.start();

// game/GameEngine.js
import { STATES } from "../config/constants.js";
import Game from "./Game.js";
import MedScanGame from "./MedScanGame.js";
import Menu from "./Menu.js";
import Overworld from "./Overworld.js";
import Inventory from "./Inventory.js";
import HUD from "./HUD.js";

export default class GameEngine {
  constructor(canvasId) {
    this.ASPECT_RATIO = 16 / 9;
    this.setupCanvas(canvasId);
    this.keys = this.setupKeyboard();
    this.gameInstance = new Game();
    this.initializeGameComponents();
    this.bindEvents();
  }

  setupCanvas(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
  }

  setupKeyboard() {
    const keys = {};
    window.addEventListener("keydown", (e) => (keys[e.key] = true));
    window.addEventListener("keyup", (e) => (keys[e.key] = false));
    return keys;
  }

  initializeGameComponents() {
    this.menu = new Menu(this.canvas, this.ctx, this.keys, this.gameInstance.gameState);
    this.overworld = new Overworld(this.canvas, this.ctx, this.keys, this.gameInstance.gameState, this.gameInstance.gameObjects);
    this.scanGame = new MedScanGame(this.canvas, this.ctx, this.keys, this.gameInstance.gameState, this.gameInstance.gameObjects);
    this.inventory = new Inventory(this.canvas, this.ctx, this.keys, this.gameInstance.gameState);
    this.hud = new HUD(this.canvas, this.ctx);

    this.handleGameState = {
      [STATES.MAIN_MENU]: () => this.menu.load(),
      [STATES.OVERWORLD]: () => this.overworld.load(),
      [STATES.SCAN_GAME]: () => this.scanGame.load(),
      [STATES.INVENTORY]: () => {
        this.inventory.update(); // Added this line to handle keypress logic
        this.inventory.draw();
        this.hud.draw(this.gameInstance.gameState.currentState);
      },
    };
  }

  resizeCanvas = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (width / height > this.ASPECT_RATIO) {
      this.canvas.height = height;
      this.canvas.width = height * this.ASPECT_RATIO;
    } else {
      this.canvas.width = width;
      this.canvas.height = width / this.ASPECT_RATIO;
    }
  };

  bindEvents() {
    window.addEventListener("resize", this.resizeCanvas);
  }

  gameLoop = () => {
    const updateGameState = this.handleGameState[this.gameInstance.gameState.currentState];
    if (updateGameState) updateGameState();
    requestAnimationFrame(this.gameLoop);
  };

  start() {
    this.resizeCanvas();
    this.gameLoop();
  }
}

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

    const mriMachine = new GameObject({
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

    const dog = new NPC({
      image: this.loadedImages["dog"],
      x: 50,
      y: 50,
      width: 32,
      height: 32,
      interactionText: "Woof woof!",
    });

    return { dog, mriMachine, player };
  }
}


// game/GameObject.js
export default class GameObject {
    constructor({ imgPath, imgSourceX, imgSourceY, imgSourceWidth, imgSourceHeight, x, y, width = 32, height = 32 }) {
      this.imgPath = imgPath;
      this.imgSourceX = imgSourceX;
      this.imgSourceY = imgSourceY;
      this.imgSourceWidth = imgSourceWidth;
      this.imgSourceHeight = imgSourceHeight;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }
  
    getScaledDimensions(scaleX, scaleY) {
      return {
        scaledX: this.x * scaleX,
        scaledY: this.y * scaleY,
        scaledWidth: this.width * scaleX,
        scaledHeight: this.height * scaleY,
      };
    }
  
    draw(ctx, scaleX, scaleY) {
      const { imgSourceX, imgSourceY, imgSourceWidth, imgSourceHeight } = this;
      const { scaledX, scaledY, scaledWidth, scaledHeight } = this.getScaledDimensions(scaleX, scaleY);
      ctx.drawImage(this.imgPath, imgSourceX, imgSourceY, imgSourceWidth, imgSourceHeight, scaledX, scaledY, scaledWidth, scaledHeight);
    }
  }

// game/HUD.js
import { drawText } from "./utils/drawText.js";
import { STATES } from "../config/constants.js";

export default class HUD {
  static BASE_RESOLUTION = { width: 640, height: 360 };
  static MIN_HUD_HEIGHT = 40;
  static MIN_FONT_SIZE = 16;

  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.calculateScaling();
  }

  calculateScaling() {
    this.scaleX = this.canvas.width / HUD.BASE_RESOLUTION.width;
    this.scaleY = this.canvas.height / HUD.BASE_RESOLUTION.height;
    this.scale = Math.min(this.scaleX, this.scaleY);

    this.hudHeight = Math.max(50 * this.scale, HUD.MIN_HUD_HEIGHT);
    this.fontSize = Math.max(HUD.MIN_FONT_SIZE * this.scale, HUD.MIN_FONT_SIZE);
  }

  draw(currentState) {
    this.calculateScaling();

    this.ctx.fillStyle = "rgba(211, 211, 211, 0.9)";
    this.ctx.fillRect(0, this.canvas.height - this.hudHeight, this.canvas.width, this.hudHeight);

    const font = `${Math.floor(this.fontSize)}px Arial`;
    const textY = this.canvas.height - this.hudHeight / 2 + this.fontSize / 3;

    let hudText;
    switch (currentState) {
      case STATES.OVERWORLD:
        hudText = "Arrow Keys to Move | Space to Interact | I for Inventory | ESC for Main Menu";
        break;
      case STATES.SCAN_GAME:
        hudText = "Hold SPACE to Scan | X to Exit | ESC for Main Menu";
        break;
      case STATES.INVENTORY:
        hudText = "X to Return to Overworld | ESC for Main Menu";
        break;
      default:
        hudText = "ESC for Main Menu";
    }

    drawText(this.ctx, hudText, this.canvas.width / 2, textY, font, "black", "center");
  }
}
      
// game/Overworld.js
import HUD from "./HUD.js";

export default class Overworld {
  constructor(canvas, ctx, keys, gameState, gameObjects) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.keys = keys;
    this.gameState = gameState;
    this.gameObjects = gameObjects;
    this.hud = new HUD(canvas, ctx);
  }

  load() {
    const update = this.gameObjects.player.update({
      keys: this.keys,
      gameState: this.gameState,
      gameObjects: this.gameObjects,
    });

    this.gameState.currentState = update.currentState;
    this.gameState.previousState = update.previousState;
    this.gameState.savedPlayerPosition = update.savedPlayerPosition;

    this.draw();
    this.hud.draw(this.gameState.currentState);
  }

  draw() {
    this.drawWorld();
    this.drawGameObjects();
    this.gameObjects.player.drawPlayer(this.canvas, this.ctx, this.gameState.currentFrame);
  }

  drawWorld() {
    this.ctx.fillStyle = "darkseagreen";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawGameObjects() {
    const { dog, mriMachine } = this.gameObjects;
    const scaleX = this.canvas.width / 640;
    const scaleY = this.canvas.height / 360;
    mriMachine.draw(this.ctx, scaleX, scaleY);
    dog.draw(this.ctx, scaleX, scaleY);
  }
}


// game/Player.js
import { ACTIONS, DIRECTION, STATES } from "../config/constants.js";

const FRAME_SETTINGS = {
  FRAME_WIDTH: 102,
  FRAME_HEIGHT: 152.75,
  WALK_FRAMES: 4,
  ATTACK_FRAMES: 1,
};

const DIRECTIONS = {
  down: 0,
  up: 1,
  left: 2,
  right: 3,
};

export default class Player {
  constructor(image, x, y, width, height, speed, direction) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.direction = direction;
    this.animationTimer = 0;
    this.currentFrame = 0;
  }

  handleMovement(keys) {
    let isMoving = false;
    let moveX = 0,
      moveY = 0;

    if (keys["ArrowUp"]) {
      moveY -= 1;
      this.direction = DIRECTION.UP;
      isMoving = true;
    }
    if (keys["ArrowDown"]) {
      moveY += 1;
      this.direction = DIRECTION.DOWN;
      isMoving = true;
    }
    if (keys["ArrowLeft"]) {
      moveX -= 1;
      this.direction = DIRECTION.LEFT;
      isMoving = true;
    }
    if (keys["ArrowRight"]) {
      moveX += 1;
      this.direction = DIRECTION.RIGHT;
      isMoving = true;
    }

    if (moveX !== 0 && moveY !== 0) {
      const SQUARE_ROOT_OF_TWO = 1.4142;
      const diagonalSpeed = (SQUARE_ROOT_OF_TWO / 2) * this.speed;
      moveX *= diagonalSpeed;
      moveY *= diagonalSpeed;
    } else {
      moveX *= this.speed;
      moveY *= this.speed;
    }

    this.x += moveX;
    this.y += moveY;
    return isMoving;
  }

  handleAction(keys) {
    if (keys["ArrowUp"] || keys["ArrowDown"] || keys["ArrowLeft"] || keys["ArrowRight"]) {
      return ACTIONS.WALKING;
    } else {
      return ACTIONS.IDLE;
    }
  }

  handleAnimation(gameState, currentAction) {
    const WALK_FRAMES = FRAME_SETTINGS.WALK_FRAMES;
    const ANIMATION_SPEED = 8; // Added constant for animation speed

    if (currentAction === ACTIONS.WALKING) {
      this.animationTimer++;
      if (this.animationTimer >= ANIMATION_SPEED) {
        this.animationTimer = 0;
        this.currentFrame = (this.currentFrame + 1) % WALK_FRAMES;
      }
    } else {
      this.animationTimer = 0;
      this.currentFrame = 0;
    }
    gameState.currentFrame = this.currentFrame;
  }

  handleCollision(keys, mriMachine, currentState) {
    if (this.checkCollisionWithGameObject(mriMachine) && keys[" "]) {
      return {
        savedPlayerPosition: { x: this.x, y: this.y },
        previousState: currentState,
        currentState: STATES.SCAN_GAME,
      };
    }
  }

  checkCollisionWithGameObject(gameObject) {
    return this.x < gameObject.x + gameObject.width && this.x + this.width > gameObject.x && this.y < gameObject.y + gameObject.height && this.y + this.height > gameObject.y;
  }

  handleEscapeKeyLogic(keys, currentState, previousState, savedPlayerPosition) {
    if (keys["Escape"]) {
      return {
        savedPlayerPosition: { x: this.x, y: this.y },
        previousState: currentState,
        currentState: STATES.MAIN_MENU,
      };
    }
    return {
      savedPlayerPosition: savedPlayerPosition,
      previousState: previousState,
      currentState: currentState,
    };
  }

  drawPlayer(canvas, ctx, currentFrame) {
    const { FRAME_WIDTH, FRAME_HEIGHT } = FRAME_SETTINGS;
    const spriteRow = DIRECTIONS[this.direction];
    const sourceX = this.currentFrame * FRAME_WIDTH; // Use instance's currentFrame
    const sourceY = spriteRow * FRAME_HEIGHT;

    const scaleX = canvas.width / 640;
    const scaleY = canvas.height / 360;

    const scaledX = this.x * scaleX;
    const scaledY = this.y * scaleY;
    const scaledWidth = this.width * scaleX;
    const scaledHeight = this.height * scaleY;

    ctx.drawImage(this.image, sourceX, sourceY, FRAME_WIDTH, FRAME_HEIGHT, scaledX, scaledY, scaledWidth, scaledHeight);
  }

  update({ keys, gameState, gameObjects }) {
    if (keys["i"] || keys["I"]) {
      return {
        savedPlayerPosition: { x: this.x, y: this.y },
        previousState: gameState.currentState,
        currentState: STATES.INVENTORY,
      };
    }

    let { currentAction, currentState, previousState, savedPlayerPosition } = gameState;
    const { mriMachine } = gameObjects;

    const isMoving = this.handleMovement(keys);
    currentAction = isMoving ? ACTIONS.WALKING : ACTIONS.IDLE;
    this.handleAnimation(gameState, currentAction);

    const collisionResult = this.handleCollision(keys, mriMachine, currentState);

    if (collisionResult) {
      savedPlayerPosition = collisionResult.savedPlayerPosition;
      previousState = collisionResult.previousState;
      currentState = collisionResult.currentState;
    }

    const escapeKeyResult = this.handleEscapeKeyLogic(keys, currentState, previousState, savedPlayerPosition);

    if (escapeKeyResult) {
      savedPlayerPosition = escapeKeyResult.savedPlayerPosition;
      previousState = escapeKeyResult.previousState;
      currentState = escapeKeyResult.currentState;
    }

    return {
      currentState,
      previousState,
      savedPlayerPosition,
    };
  }
}


// game/NPC.js
export default class NPC {
    constructor({ image, x, y, width, height, interactionText }) {
      this.image = image;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.interactionText = interactionText;
    }
  
    draw(ctx, scaleX, scaleY) {
      const scaledX = this.x * scaleX;
      const scaledY = this.y * scaleY;
      const scaledWidth = this.width * scaleX;
      const scaledHeight = this.height * scaleY;
  
      ctx.drawImage(this.image, 0, 0, this.width, this.height, scaledX, scaledY, scaledWidth, scaledHeight);
    }
  
    interact() {
      return this.interactionText;
    }
  }
  