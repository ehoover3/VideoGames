// index.js

import GameEngine from "./game/GameEngine.js";

const gameEngine = new GameEngine("gameCanvas");
gameEngine.start();

// game/Game.js
import { ACTIONS, STATES } from "../config/constants.js";
import { DIRECTION } from "../config/constants.js";
import GameObject from "./GameObject.js";
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

    return { player, mriMachine };
  }
}

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
    this.inventory = new Inventory(this.canvas, this.ctx, this.gameInstance.gameState); // Pass gameState here
    this.hud = new HUD(this.canvas, this.ctx);

    this.handleGameState = {
      [STATES.MAIN_MENU]: () => this.menu.load(),
      [STATES.OVERWORLD]: () => this.overworld.load(),
      [STATES.SCAN_GAME]: () => this.scanGame.load(),
      [STATES.INVENTORY]: () => {
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
        hudText = "Arrow Keys to Move | Space to Interact | ESC for Main Menu";
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

// game/Inventory.js
import { drawText } from "./utils/drawText.js";
import { STATES } from "../config/constants.js";

export default class Inventory {
  static BASE_RESOLUTION = { width: 640, height: 360 };
  static INVENTORY_PADDING = 20;
  static SLOT_SIZE = 40;
  static SLOTS_PER_ROW = 5;
  static TOTAL_SLOTS = 15;

  constructor(canvas, ctx, gameState) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.gameState = gameState;
    this.items = [];
  }

  load() {
    this.update();
    this.draw();
  }

  update() {
    if (this.keys["x"] || this.keys["X"]) {
      this.gameState.currentState = STATES.OVERWORLD;
      this.keys["x"] = false;
      this.keys["X"] = false;
    }
  }

  draw() {
    const scaleX = this.canvas.width / Inventory.BASE_RESOLUTION.width;
    const scaleY = this.canvas.height / Inventory.BASE_RESOLUTION.height;
    const scale = Math.min(scaleX, scaleY);

    // Draw semi-transparent background
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Calculate inventory window dimensions
    const padding = Inventory.INVENTORY_PADDING * scale;
    const slotSize = Inventory.SLOT_SIZE * scale;
    const windowWidth = slotSize * Inventory.SLOTS_PER_ROW + padding * 2;
    const windowHeight = slotSize * Math.ceil(Inventory.TOTAL_SLOTS / Inventory.SLOTS_PER_ROW) + padding * 2;
    const startX = (this.canvas.width - windowWidth) / 2;
    const startY = (this.canvas.height - windowHeight) / 2;

    // Draw inventory window background
    this.ctx.fillStyle = "rgba(211, 211, 211, 0.95)";
    this.ctx.fillRect(startX, startY, windowWidth, windowHeight);

    // Draw title
    const fontSize = Math.floor(20 * scale);
    drawText(this.ctx, "Inventory", startX + windowWidth / 2, startY + padding, `${fontSize}px Arial`, "black", "center");

    // Draw inventory slots
    for (let i = 0; i < Inventory.TOTAL_SLOTS; i++) {
      const row = Math.floor(i / Inventory.SLOTS_PER_ROW);
      const col = i % Inventory.SLOTS_PER_ROW;
      const x = startX + padding + col * slotSize;
      const y = startY + padding * 2 + row * slotSize;

      // Draw slot background
      this.ctx.fillStyle = "white";
      this.ctx.fillRect(x, y, slotSize, slotSize);

      // Draw slot border
      this.ctx.strokeStyle = "gray";
      this.ctx.strokeRect(x, y, slotSize, slotSize);

      // If there's an item in this slot, draw it (placeholder)
      if (this.items[i]) {
        this.ctx.fillStyle = "blue";
        this.ctx.fillRect(x + 5, y + 5, slotSize - 10, slotSize - 10);
      }
    }
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

// game/Menu.js
import { drawText } from "./utils/drawText.js";
import { STATES } from "../config/constants.js";

const TITLE_HEIGHT_RATIO = 1 / 12;
const MENU_START_Y_RATIO = 1 / 2.5;
const MENU_SPACING_RATIO = 1 / 11;
const MENU_FONT_SIZE_RATIO = 1 / 20;
const BUTTON_PADDING_RATIO = 1 / 40;
const BUTTON_WIDTH_RATIO = 0.25;
const BUTTON_RADIUS_RATIO = 0.5;
const SHADOW_BLUR = 0;
const SHADOW_OFFSET_X = 2;
const SHADOW_OFFSET_Y = 2;
const SHADOW_COLOR = "rgba(0, 0, 0, 0.2)";
const BUTTON_COLOR_SELECTED = "orange";
const BUTTON_COLOR_DEFAULT = "white";
const TEXT_COLOR_SELECTED = "white";
const TEXT_COLOR_DEFAULT = "black";
const STROKE_COLOR = "lightgrey";

const MENU_OPTIONS = {
  START_NEW_GAME: "Start New Game",
  RETURN_TO_GAME: "Return to Game",
  LOAD_GAME: "Load Game",
  SETTINGS: "Settings",
  EXIT: "Exit",
};

const menuBackground = new Image();
menuBackground.src = "assets/images/menu/menu.jpeg";

const BASE_MENU = [MENU_OPTIONS.START_NEW_GAME, MENU_OPTIONS.LOAD_GAME, MENU_OPTIONS.SETTINGS, MENU_OPTIONS.EXIT];

export default class Menu {
  constructor(canvas, ctx, keys, gameState) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.keys = keys;
    this.gameState = gameState;
  }

  load() {
    this.updateMenu();
    this.drawMenu();
  }

  updateMenu() {
    const { keys, gameState } = this;
    let { selectedMenuOption } = gameState;

    const setCurrentState = (newState) => {
      gameState.currentState = newState;
    };

    const setIsGameStarted = (newGameStarted) => {
      gameState.isGameStarted = newGameStarted;
    };

    const setSelectedMenuOption = (newSelected) => {
      gameState.selectedMenuOption = newSelected;
    };

    const handleLoadGame = () => {
      alert("Load Game functionality is not implemented yet.");
    };

    const handleMenuSelection = () => {
      const menu = gameState.isGameStarted ? [MENU_OPTIONS.RETURN_TO_GAME, ...BASE_MENU.slice(1)] : BASE_MENU;
      const selected = menu[selectedMenuOption];

      switch (selected) {
        case MENU_OPTIONS.START_NEW_GAME:
          this.handleStartNewGame(setCurrentState, setIsGameStarted);
          break;
        case MENU_OPTIONS.RETURN_TO_GAME:
          this.handleReturnToGame(gameState.previousState, setCurrentState);
          break;
        case MENU_OPTIONS.LOAD_GAME:
          handleLoadGame();
          break;
        case MENU_OPTIONS.SETTINGS:
          this.handleSettings();
          break;
        case MENU_OPTIONS.EXIT:
          this.handleExit();
          break;
        default:
          console.warn("Invalid menu option selected");
      }
    };

    const menuLength = BASE_MENU.length;

    if (keys["ArrowUp"]) {
      setSelectedMenuOption((selectedMenuOption - 1 + menuLength) % menuLength);
      keys["ArrowUp"] = false;
    }
    if (keys["ArrowDown"]) {
      setSelectedMenuOption((selectedMenuOption + 1) % menuLength);
      keys["ArrowDown"] = false;
    }

    if (keys["Enter"]) {
      handleMenuSelection();
      keys["Enter"] = false;
    }
  }

  handleReturnToGame(previousState, setCurrentState) {
    const stateMap = {
      [STATES.SCAN_GAME]: STATES.SCAN_GAME,
    };
    const state = stateMap[previousState] || previousState;
    setCurrentState(state);
  }

  handleSettings() {
    alert("Settings functionality is not implemented yet.");
  }

  handleStartNewGame(setCurrentState, setIsGameStarted) {
    setCurrentState(STATES.OVERWORLD);
    setIsGameStarted(true);
  }

  handleExit() {
    alert("Exiting the game...");
  }

  drawMenu() {
    const { canvas, ctx, gameState } = this;
    const isGameStarted = gameState.isGameStarted;
    const selectedOption = gameState.selectedMenuOption;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(menuBackground, 0, 0, menuBackground.width, menuBackground.height, 0, 0, canvas.width, canvas.height);

    const titleFontSize = Math.round(canvas.height * TITLE_HEIGHT_RATIO);
    drawText(ctx, "Science Game", canvas.width / 2, canvas.height / 4, `${titleFontSize}px Arial`, "black");

    const menu = isGameStarted ? [MENU_OPTIONS.RETURN_TO_GAME, ...BASE_MENU.slice(1)] : BASE_MENU;

    const menuStartY = canvas.height * MENU_START_Y_RATIO;
    const menuSpacing = canvas.height * MENU_SPACING_RATIO;
    const menuFontSize = Math.round(canvas.height * MENU_FONT_SIZE_RATIO);
    const buttonPadding = canvas.height * BUTTON_PADDING_RATIO;

    menu.forEach((option, index) => {
      const isSelected = index === selectedOption;

      const buttonWidth = canvas.width * BUTTON_WIDTH_RATIO;
      const buttonHeight = menuFontSize + buttonPadding;
      const buttonX = (canvas.width - buttonWidth) * BUTTON_RADIUS_RATIO;
      const buttonY = menuStartY + index * menuSpacing - buttonHeight;

      const buttonColor = isSelected ? BUTTON_COLOR_SELECTED : BUTTON_COLOR_DEFAULT;
      const textColor = isSelected ? TEXT_COLOR_SELECTED : TEXT_COLOR_DEFAULT;

      ctx.beginPath();
      ctx.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, buttonHeight / 2);
      ctx.fillStyle = buttonColor;
      ctx.fill();
      ctx.shadowColor = SHADOW_COLOR;
      ctx.shadowBlur = SHADOW_BLUR;
      ctx.shadowOffsetX = SHADOW_OFFSET_X;
      ctx.shadowOffsetY = SHADOW_OFFSET_Y;
      ctx.strokeStyle = STROKE_COLOR;
      ctx.stroke();
      ctx.shadowBlur = SHADOW_BLUR;

      drawText(ctx, option, canvas.width / 2, buttonY + buttonHeight / 2 + menuFontSize / 3, `${menuFontSize}px Arial`, textColor);
    });
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
    const { mriMachine } = this.gameObjects;
    const scaleX = this.canvas.width / 640;
    const scaleY = this.canvas.height / 360;
    mriMachine.draw(this.ctx, scaleX, scaleY);
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
