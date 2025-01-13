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
      [STATES.MED_SCAN_GAME]: () => this.scanGame.load(),
      [STATES.INVENTORY]: () => {
        this.inventory.update();
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

    return { dog, mriMachine, player };
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

    this.draw(update.interactionMessage);
    // Pass the interacting NPC if there's an interaction message
    const interactingNPC = update.interactionMessage ? this.gameObjects.dog : null;
    this.hud.draw(this.gameState.currentState, update.interactionMessage, interactingNPC);
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
    this.isInteracting = false;
    this.interactionMessage = null;
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

  handleInteraction(keys, dog) {
    if (this.checkCollisionWithGameObject(dog) && keys[" "]) {
      this.isInteracting = true;
      this.interactionMessage = dog.interact();
      return this.interactionMessage;
    }
    return null;
  }

  handleEnterKey(keys) {
    if (keys["Enter"] && this.isInteracting) {
      this.isInteracting = false;
      this.interactionMessage = null;
      return true;
    }
    return false;
  }

  handleAnimation(gameState, currentAction) {
    const WALK_FRAMES = FRAME_SETTINGS.WALK_FRAMES;
    const ANIMATION_SPEED = 8;

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

  handleCollision(keys, dog, mriMachine, currentState) {
    if (this.checkCollisionWithGameObject(dog) && keys[" "]) {
      this.isInteracting = true;
      this.interactionMessage = dog.interact();
      return {
        savedPlayerPosition: { x: this.x, y: this.y },
        previousState: currentState,
        currentState: currentState,
        interactionMessage: this.interactionMessage,
      };
    }

    if (this.checkCollisionWithGameObject(mriMachine) && keys[" "]) {
      return {
        savedPlayerPosition: { x: this.x, y: this.y },
        previousState: currentState,
        currentState: STATES.MED_SCAN_GAME,
      };
    }

    return null;
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
    const sourceX = this.currentFrame * FRAME_WIDTH;
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
    const { dog, mriMachine } = gameObjects;

    const isMoving = this.handleMovement(keys);
    currentAction = isMoving ? ACTIONS.WALKING : ACTIONS.IDLE;
    this.handleAnimation(gameState, currentAction);

    const collisionResult = this.handleCollision(keys, dog, mriMachine, currentState);

    // Handle Enter key to clear interaction message
    if (this.handleEnterKey(keys)) {
      return {
        currentState,
        previousState,
        savedPlayerPosition,
        interactionMessage: null,
      };
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
      interactionMessage: this.isInteracting ? this.interactionMessage : null,
    };
  }
}

// game/HUD.js
import { drawText } from "./utils/drawText.js";
import { STATES } from "../config/constants.js";

export default class HUD {
  static BASE_RESOLUTION = { width: 640, height: 360 };
  static MIN_HUD_HEIGHT = 40;
  static MIN_FONT_SIZE = 16;
  static PORTRAIT_PADDING = 10;

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

    // Portrait dimensions based on HUD height
    this.portraitSize = this.hudHeight - HUD.PORTRAIT_PADDING * 2;
  }

  drawPortrait(npc) {
    if (!npc || !npc.imgPath) return;

    const portraitX = HUD.PORTRAIT_PADDING;
    const portraitY = this.canvas.height - this.hudHeight + HUD.PORTRAIT_PADDING;

    // Draw portrait background (optional - adds a nice frame effect)
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(portraitX, portraitY, this.portraitSize, this.portraitSize);

    // Draw the NPC portrait
    this.ctx.drawImage(npc.imgPath, npc.imgSourceX, npc.imgSourceY, npc.imgSourceWidth, npc.imgSourceHeight, portraitX, portraitY, this.portraitSize, this.portraitSize);
  }

  draw(currentState, interactionMessage, interactingNPC) {
    this.calculateScaling();

    // Draw HUD background
    this.ctx.fillStyle = "rgba(211, 211, 211, 0.9)";
    this.ctx.fillRect(0, this.canvas.height - this.hudHeight, this.canvas.width, this.hudHeight);

    const font = `${Math.floor(this.fontSize)}px Arial`;
    const textY = this.canvas.height - this.hudHeight / 2 + this.fontSize / 3;

    let textX = this.canvas.width / 2;
    let textAlign = "center";

    // If there's an interacting NPC, adjust text position and draw portrait
    if (interactingNPC && interactionMessage) {
      this.drawPortrait(interactingNPC);
      textX = this.portraitSize + HUD.PORTRAIT_PADDING * 3;
      textAlign = "left";
    }

    let hudText;
    if (interactionMessage) {
      hudText = interactionMessage;
    } else {
      switch (currentState) {
        case STATES.OVERWORLD:
          hudText = "Arrow Keys to Move | Space to Interact | I for Inventory | ESC for Main Menu";
          break;
        case STATES.MED_SCAN_GAME:
          hudText = "Hold SPACE to Scan | X to Exit | ESC for Main Menu";
          break;
        case STATES.INVENTORY:
          hudText = "X to Return to Overworld | ESC for Main Menu";
          break;
        default:
          hudText = "ESC for Main Menu";
      }
    }

    drawText(this.ctx, hudText, textX, textY, font, "black", textAlign);
  }
}

// game/MedScanGame.js
import { drawText } from "./utils/drawText.js";
import { STATES } from "../config/constants.js";
import HUD from "./HUD.js";

export default class MedScanGame {
  static BASE_RESOLUTION = { width: 640, height: 360 };
  static MRI_IMAGE_DIMENSIONS = { width: 458, height: 248 };
  static PROGRESS_BAR_DIMENSIONS = { width: 400, height: 24 };
  static MRI_IMAGE_Y_OFFSET = 10;
  static PROGRESS_BAR_Y_OFFSET = 270;
  static MIN_FONT_SIZE = 20;

  constructor(canvas, ctx, keys, gameState, gameObjects) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.keys = keys;
    this.gameState = gameState;
    this.gameObjects = gameObjects;
    this.hud = new HUD(canvas, ctx);
    this.mriImg = new Image();
    this.mriImg.src = "assets/images/scanGame/mri.png";
    this.mriImg.onerror = () => console.error("Failed to load image: mri.png");
  }

  load() {
    this.update();
    this.draw();
  }

  update() {
    const {
      keys,
      gameObjects: { player },
      gameState,
    } = this;
    let { scanning, scanProgress, maxScanProgress, currentState, previousState, savedPlayerPosition } = gameState;

    if (this.keys[" "]) {
      scanning = true;
      if (scanProgress < maxScanProgress) {
        scanProgress++;
      }
    } else {
      scanning = false;
    }

    if (this.keys["x"] || this.keys["X"] || (scanProgress >= maxScanProgress && this.keys[" "])) {
      currentState = STATES.OVERWORLD;
      player.x = savedPlayerPosition.x;
      player.y = savedPlayerPosition.y;
      scanProgress = 0;
    }

    if (this.keys["Escape"]) {
      previousState = currentState;
      currentState = STATES.MAIN_MENU;
    }

    Object.assign(this.gameState, { currentState, previousState, scanProgress, scanning });
  }

  draw() {
    this.clearCanvas();
    if (this.mriImg.complete) {
      this.drawMRIImage();
      this.drawProgressBar();
      if (this.gameState.scanProgress >= this.gameState.maxScanProgress) {
        this.drawScanCompleteMessage();
      }
    }
    this.hud.draw(this.gameState.currentState);
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawMRIImage() {
    const scaleX = this.canvas.width / MedScanGame.BASE_RESOLUTION.width;
    const scaleY = this.canvas.height / MedScanGame.BASE_RESOLUTION.height;
    const imageWidth = MedScanGame.MRI_IMAGE_DIMENSIONS.width * scaleX;
    const imageHeight = MedScanGame.MRI_IMAGE_DIMENSIONS.height * scaleY;
    const x = (this.canvas.width - imageWidth) / 2;
    const y = MedScanGame.MRI_IMAGE_Y_OFFSET * scaleY;

    this.ctx.drawImage(this.mriImg, 0, 0, MedScanGame.MRI_IMAGE_DIMENSIONS.width, MedScanGame.MRI_IMAGE_DIMENSIONS.height, x, y, imageWidth, imageHeight);
  }

  drawProgressBar() {
    const scaleX = this.canvas.width / MedScanGame.BASE_RESOLUTION.width;
    const scaleY = this.canvas.height / MedScanGame.BASE_RESOLUTION.height;
    const barWidth = MedScanGame.PROGRESS_BAR_DIMENSIONS.width * scaleX;
    const barHeight = MedScanGame.PROGRESS_BAR_DIMENSIONS.height * scaleY;
    const x = (this.canvas.width - barWidth) / 2;
    const y = MedScanGame.PROGRESS_BAR_Y_OFFSET * scaleY;

    // Background
    this.ctx.fillStyle = "lightgray";
    this.ctx.fillRect(x, y, barWidth, barHeight);

    // Progress fill
    this.ctx.fillStyle = "#13beec";
    this.ctx.fillRect(x, y, (this.gameState.scanProgress / this.gameState.maxScanProgress) * barWidth, barHeight);
  }

  drawScanCompleteMessage() {
    const scaledFontSize = Math.max(MedScanGame.MIN_FONT_SIZE * (this.canvas.height / MedScanGame.BASE_RESOLUTION.height), MedScanGame.MIN_FONT_SIZE) + "px Arial";
    drawText(this.ctx, "Scanning Complete! Press SPACE to return.", this.canvas.width / 2, MedScanGame.PROGRESS_BAR_Y_OFFSET * (this.canvas.height / MedScanGame.BASE_RESOLUTION.height), "center", scaledFontSize);
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
  