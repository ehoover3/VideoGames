When user drops the ball, it shows dog instead of ball image.

// index.js
import Game from "./game/Game.js";

const game = new Game("gameCanvas");
game.start();

// game/Game.js
import { ACTIONS, STATES, DIRECTION } from "../config/constants.js";
import MedScanGame from "./MedScanGame.js";
import Menu from "./Menu.js";
import Overworld from "./Overworld.js";
import Inventory from "./Inventory.js";
import HUD from "./HUD.js";
import Item from "./Item.js";
import NPC from "./NPC.js";
import Player from "./Player.js";

export default class Game {
  constructor(canvasId) {
    this.ASPECT_RATIO = 16 / 9;
    this.setupCanvas(canvasId);
    this.keys = this.setupKeyboard();
    this.startGameState();
    this.loadImages();
    this.inventory = new Inventory(this.canvas, this.ctx, this.keys, this.gameState);
    this.gameObjects = this.getGameObjects();
    this.startGameComponents();
    this.bindEvents();
    window.gameInstance = this;
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

  startGameState() {
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
  }

  loadImages() {
    const loadImage = (src) => {
      const img = new Image();
      img.src = src;
      return img;
    };
    this.images = {
      ball: loadImage("assets/images/overworld/tennisBall.png"),
      dog: loadImage("assets/images/overworld/dog.png"),
      mri: loadImage("assets/images/overworld/mri.png"),
      player: loadImage("assets/images/overworld/player.png"),
    };
  }

  getGameObjects() {
    const player = new Player(this.images["player"], 100, 100, 32, 32, 4, DIRECTION.DOWN);

    const dog = new NPC({
      imgPath: this.images["dog"],
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

    const mri = new Item({
      imgPath: this.images["mri"],
      imgSourceX: 0,
      imgSourceY: 0,
      imgSourceWidth: 556,
      imgSourceHeight: 449,
      x: 130,
      y: 130,
      width: 64,
      height: 64,
      name: "MRI Machine",
    });

    const ball = new Item({
      imgPath: this.images["ball"],
      imgSourceX: 0,
      imgSourceY: 0,
      imgSourceWidth: 155,
      imgSourceHeight: 155,
      x: 76,
      y: 130,
      width: 16,
      height: 16,
      name: "Tennis Ball",
      isPickedUp: false,
    });

    return { ball, dog, mri, player };
  }

  startGameComponents() {
    this.menu = new Menu(this.canvas, this.ctx, this.keys, this.gameState);
    this.overworld = new Overworld(this.canvas, this.ctx, this.keys, this.gameState, this.gameObjects, this.inventory);
    this.medScanGame = new MedScanGame(this.canvas, this.ctx, this.keys, this.gameState, this.gameObjects);
    this.hud = new HUD(this.canvas, this.ctx);

    this.handleGameState = {
      [STATES.MAIN_MENU]: () => this.menu.load(),
      [STATES.OVERWORLD]: () => this.overworld.load(),
      [STATES.MED_SCAN_GAME]: () => this.medScanGame.load(),
      [STATES.INVENTORY]: () => this.inventory.load(),
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
    const updateGameState = this.handleGameState[this.gameState.currentState];
    if (updateGameState) updateGameState();
    requestAnimationFrame(this.gameLoop);
  };

  start() {
    this.resizeCanvas();
    this.gameLoop();
  }

  getInventory() {
    return this.inventory;
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
  
    draw(ctx, scaleX, scaleY) {
      const { imgSourceX, imgSourceY, imgSourceWidth, imgSourceHeight } = this;
      const { scaledX, scaledY, scaledWidth, scaledHeight } = this.getScaledDimensions(scaleX, scaleY);
      ctx.drawImage(this.imgPath, imgSourceX, imgSourceY, imgSourceWidth, imgSourceHeight, scaledX, scaledY, scaledWidth, scaledHeight);
    }
  
    getScaledDimensions(scaleX, scaleY) {
      return {
        scaledX: this.x * scaleX,
        scaledY: this.y * scaleY,
        scaledWidth: this.width * scaleX,
        scaledHeight: this.height * scaleY,
      };
    }
  
    getBoundingBox() {
      return {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
      };
    }
  
    isColliding(otherObject) {
      const box1 = this.getBoundingBox();
      const box2 = otherObject.getBoundingBox();
  
      return box1.x < box2.x + box2.width && box1.x + box1.width > box2.x && box1.y < box2.y + box2.height && box1.y + box1.height > box2.y;
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
      this.portraitSize = this.hudHeight - HUD.PORTRAIT_PADDING * 2;
    }
  
    drawBackground() {
      this.ctx.fillStyle = "rgba(211, 211, 211, 0.9)";
      this.ctx.fillRect(0, this.canvas.height - this.hudHeight, this.canvas.width, this.hudHeight);
    }
  
    drawObject(gameObject) {
      if (!gameObject || !gameObject.imgPath) return;
  
      const portraitX = HUD.PORTRAIT_PADDING;
      const portraitY = this.canvas.height - this.hudHeight + HUD.PORTRAIT_PADDING;
  
      this.ctx.fillStyle = "white";
      this.ctx.fillRect(portraitX, portraitY, this.portraitSize, this.portraitSize);
  
      this.ctx.drawImage(gameObject.imgPath, gameObject.imgSourceX, gameObject.imgSourceY, gameObject.imgSourceWidth, gameObject.imgSourceHeight, portraitX, portraitY, this.portraitSize, this.portraitSize);
    }
  
    draw(currentState, interactionMessage, displayObject) {
      this.calculateScaling();
      this.drawBackground();
  
      const font = `${Math.floor(this.fontSize)}px Arial`;
      const textY = this.canvas.height - this.hudHeight / 2 + this.fontSize / 3;
      let textX = this.canvas.width / 2;
      let textAlign = "center";
  
      // Draw the object if present
      if (displayObject) {
        this.drawObject(displayObject);
        textX = this.portraitSize + HUD.PORTRAIT_PADDING * 3;
        textAlign = "left";
      }
  
      let hudText = interactionMessage;
      if (!hudText) {
        switch (currentState) {
          case STATES.OVERWORLD:
            hudText = "↑ ↓ → ← to Move | Space to Interact | I for Inventory | ESC for Main Menu";
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
  
  // game/Inventory.js
  import { STATES } from "../config/constants.js";
  import { drawText } from "./utils/drawText.js";
  
  export default class Inventory {
    static BASE_RESOLUTION = { width: 640, height: 360 };
    static INVENTORY_PADDING = 20;
    static SLOT_SIZE = 40;
    static SLOTS_PER_ROW = 5;
    static TOTAL_SLOTS = 15;
    static INTERACTION_DISTANCE = 40;
  
    constructor(canvas, ctx, keys, gameState) {
      this.canvas = canvas;
      this.ctx = ctx;
      this.keys = keys;
      this.gameState = gameState;
      this.items = [];
      this.selectedSlot = -1;
    }
  
    load() {
      this.update();
      this.draw();
      const game = window.gameInstance;
      if (game) {
        game.hud.draw(this.gameState.currentState);
      }
    }
  
    addItem(item) {
      if (this.items.length < Inventory.TOTAL_SLOTS) {
        this.items.push(item);
        return {
          success: true,
          message: `Picked up ${item.name || "item"}!`,
        };
      }
      return {
        success: false,
        message: "Inventory is full! Drop something first.",
      };
    }
  
    dropItem(slotIndex) {
      if (slotIndex >= 0 && slotIndex < this.items.length) {
        const item = this.items[slotIndex];
        const game = window.gameInstance;
        if (game && game.gameObjects.player) {
          const player = game.gameObjects.player;
          item.x = player.x + player.width;
          item.y = player.y;
          item.isPickedUp = false;
        }
        this.items.splice(slotIndex, 1);
        return {
          success: true,
          message: `Dropped ${item.name || "item"}`,
        };
      }
      return {
        success: false,
        message: "No item to drop",
      };
    }
  
    update() {
      if (this.keys["x"] || this.keys["X"]) {
        this.gameState.previousState = this.gameState.currentState;
        this.gameState.currentState = STATES.OVERWORLD;
        this.keys["x"] = false;
        this.keys["X"] = false;
      }
  
      for (let i = 1; i <= 9; i++) {
        if (this.keys[i.toString()]) {
          this.selectedSlot = i - 1;
          this.keys[i.toString()] = false;
        }
      }
  
      if ((this.keys["d"] || this.keys["D"]) && this.selectedSlot !== -1) {
        const result = this.dropItem(this.selectedSlot);
        if (result.success) {
          this.selectedSlot = -1;
        }
        const game = window.gameInstance;
        if (game && game.gameObjects.player) {
          game.gameObjects.player.interaction.isInteracting = true;
          game.gameObjects.player.interaction.message = result.message;
        }
        this.keys["d"] = false;
        this.keys["D"] = false;
      }
    }
  
    draw() {
      const scaleX = this.canvas.width / Inventory.BASE_RESOLUTION.width;
      const scaleY = this.canvas.height / Inventory.BASE_RESOLUTION.height;
      const scale = Math.min(scaleX, scaleY);
  
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  
      const padding = Inventory.INVENTORY_PADDING * scale;
      const slotSize = Inventory.SLOT_SIZE * scale;
      const windowWidth = slotSize * Inventory.SLOTS_PER_ROW + padding * 2;
      const windowHeight = slotSize * Math.ceil(Inventory.TOTAL_SLOTS / Inventory.SLOTS_PER_ROW) + padding * 2;
      const startX = (this.canvas.width - windowWidth) / 2;
      const startY = (this.canvas.height - windowHeight) / 2;
  
      this.ctx.fillStyle = "rgba(211, 211, 211, 0.95)";
      this.ctx.fillRect(startX, startY, windowWidth, windowHeight);
  
      const fontSize = Math.floor(20 * scale);
      drawText(this.ctx, "Inventory", startX + windowWidth / 2, startY + padding, `${fontSize}px Arial`, "black", "center");
  
      const smallerFontSize = Math.floor(14 * scale);
      drawText(this.ctx, "Press 1-9 to select slot, D to drop selected item", startX + windowWidth / 2, startY + padding + fontSize + 5, `${smallerFontSize}px Arial`, "gray", "center");
  
      for (let i = 0; i < Inventory.TOTAL_SLOTS; i++) {
        const row = Math.floor(i / Inventory.SLOTS_PER_ROW);
        const col = i % Inventory.SLOTS_PER_ROW;
        const x = startX + padding + col * slotSize;
        const y = startY + padding * 2 + fontSize + 10 + row * slotSize;
  
        this.ctx.fillStyle = i === this.selectedSlot ? "rgba(255, 165, 0, 0.3)" : "white";
        this.ctx.fillRect(x, y, slotSize, slotSize);
  
        this.ctx.strokeStyle = i === this.selectedSlot ? "orange" : "gray";
        this.ctx.strokeRect(x, y, slotSize, slotSize);
  
        this.ctx.fillStyle = "gray";
        this.ctx.font = `${Math.floor(12 * scale)}px Arial`;
        this.ctx.fillText((i + 1).toString(), x + 4, y + 14);
  
        if (this.items[i]) {
          const item = this.items[i];
          const itemPadding = slotSize * 0.1;
          this.ctx.drawImage(item.imgPath, item.imgSourceX, item.imgSourceY, item.imgSourceWidth, item.imgSourceHeight, x + itemPadding, y + itemPadding, slotSize - itemPadding * 2, slotSize - itemPadding * 2);
        }
      }
    }
  }
  
  // game/Item.js
  import GameObject from "./GameObject.js";
  
  export default class Item extends GameObject {
    constructor(config) {
      super(config);
      this.name = config.name || "Unknown Item";
      this.isPickedUp = config.isPickedUp || false;
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
  
  // game/NPC.js
  import GameObject from "./GameObject.js";
  
  export default class NPC extends GameObject {
    constructor(config) {
      super(config);
      this.interactionText = config.interactionText;
    }
  
    interact() {
      return this.interactionText;
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
      this.isPlayerMoving = false;
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
  
      // Update movement state
      this.isPlayerMoving = Boolean(this.keys["ArrowUp"] || this.keys["ArrowDown"] || this.keys["ArrowLeft"] || this.keys["ArrowRight"]);
  
      let displayObject = null;
      let displayMessage = null;
  
      if (!this.isPlayerMoving) {
        if (update.showPickupNotification && update.lastPickedUpItem) {
          // Show pickup notification and item
          displayObject = update.lastPickedUpItem;
          displayMessage = update.interactionMessage;
        } else if (update.isInteracting) {
          // Show dog during conversation
          displayObject = this.gameObjects.dog;
          displayMessage = update.interactionMessage;
        }
      }
  
      this.hud.draw(this.gameState.currentState, displayMessage, displayObject);
    }
  
    draw() {
      this.drawWorld();
      this.drawGameObjects();
      this.gameObjects.player.draw(this.canvas, this.ctx, this.gameState.currentFrame);
    }
  
    drawWorld() {
      this.ctx.fillStyle = "darkseagreen";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  
    drawGameObjects() {
      const { ball, dog, mri } = this.gameObjects;
      const scaleX = this.canvas.width / 640;
      const scaleY = this.canvas.height / 360;
  
      if (!ball.isPickedUp) {
        ball.draw(this.ctx, scaleX, scaleY);
      }
      dog.draw(this.ctx, scaleX, scaleY);
      mri.draw(this.ctx, scaleX, scaleY);
    }
  }
  
  // game/Player.js
  import { DIRECTION, STATES } from "../config/constants.js";
  import GameObject from "./GameObject.js";
  import Inventory from "./Inventory.js";
  
  class Player extends GameObject {
    static FRAME_SETTINGS = {
      FRAME_WIDTH: 102,
      FRAME_HEIGHT: 152.75,
      WALK_FRAMES: 4,
      ATTACK_FRAMES: 1,
      ANIMATION_SPEED: 8,
    };
  
    static DIRECTIONS = {
      [DIRECTION.DOWN]: 0,
      [DIRECTION.UP]: 1,
      [DIRECTION.LEFT]: 2,
      [DIRECTION.RIGHT]: 3,
    };
  
    constructor(image, x, y, width, height, speed, direction) {
      super({
        imgPath: image,
        imgSourceX: 0,
        imgSourceY: 0,
        imgSourceWidth: Player.FRAME_SETTINGS.FRAME_WIDTH,
        imgSourceHeight: Player.FRAME_SETTINGS.FRAME_HEIGHT,
        x,
        y,
        width,
        height,
      });
  
      this.sprite = {
        image,
        frame: 0,
        animationTimer: 0,
      };
  
      this.movement = {
        speed,
        direction,
        isMoving: false,
      };
  
      this.interaction = {
        isInteracting: false,
        message: null,
        showPickupNotification: false,
        lastPickedUpItem: null,
      };
    }
  
    move(keys) {
      const movement = this.calculateMovement(keys);
      if (!movement.isMoving) return false;
  
      // Reset all interaction states when moving
      this.interaction.isInteracting = false;
      this.interaction.message = null;
      this.interaction.showPickupNotification = false;
      this.interaction.lastPickedUpItem = null;
  
      this.updatePosition(movement);
      this.movement.direction = movement.direction;
      return true;
    }
  
    calculateMovement(keys) {
      const movement = {
        x: 0,
        y: 0,
        direction: this.movement.direction,
        isMoving: false,
      };
  
      if (keys["ArrowUp"]) {
        movement.y -= 1;
        movement.direction = DIRECTION.UP;
        movement.isMoving = true;
      }
      if (keys["ArrowDown"]) {
        movement.y += 1;
        movement.direction = DIRECTION.DOWN;
        movement.isMoving = true;
      }
      if (keys["ArrowLeft"]) {
        movement.x -= 1;
        movement.direction = DIRECTION.LEFT;
        movement.isMoving = true;
      }
      if (keys["ArrowRight"]) {
        movement.x += 1;
        movement.direction = DIRECTION.RIGHT;
        movement.isMoving = true;
      }
  
      return movement;
    }
  
    updatePosition({ x, y, isMoving }) {
      if (!isMoving) return;
  
      const speed = this.calculateSpeed(x, y);
      this.x += x * speed;
      this.y += y * speed;
    }
  
    calculateSpeed(x, y) {
      const isDiagonal = x !== 0 && y !== 0;
      return isDiagonal ? this.movement.speed / Math.SQRT2 : this.movement.speed;
    }
  
    updateAnimation(gameState, isMoving) {
      const { WALK_FRAMES, ANIMATION_SPEED } = Player.FRAME_SETTINGS;
  
      if (!isMoving) {
        this.sprite.frame = 0;
        this.sprite.animationTimer = 0;
        return;
      }
  
      this.sprite.animationTimer++;
      if (this.sprite.animationTimer >= ANIMATION_SPEED) {
        this.sprite.animationTimer = 0;
        this.sprite.frame = (this.sprite.frame + 1) % WALK_FRAMES;
      }
  
      gameState.currentFrame = this.sprite.frame;
    }
  
    checkInteractions(keys, gameObjects, currentState) {
      const { dog, mri, ball } = gameObjects;
  
      const isWithinInteractionDistance = (object) => {
        const dx = this.x - object.x;
        const dy = this.y - object.y;
        return Math.sqrt(dx * dx + dy * dy) <= Inventory.INTERACTION_DISTANCE;
      };
  
      // Handle MRI interaction
      if (this.isColliding(mri) && keys[" "]) {
        return this.createStateUpdate(currentState, STATES.MED_SCAN_GAME);
      }
  
      // Don't allow dog interaction if showing pickup notification
      if (!this.interaction.showPickupNotification && this.isColliding(dog) && keys[" "]) {
        this.interaction.isInteracting = true;
        this.interaction.message = dog.interact();
        return this.createStateUpdate(currentState, currentState, this.interaction.message);
      }
  
      // Handle ball pickup
      if (!ball.isPickedUp && keys[" "] && isWithinInteractionDistance(ball)) {
        const game = window.gameInstance;
        if (game && game.getInventory()) {
          const result = game.getInventory().addItem(ball);
          if (result.success) {
            ball.isPickedUp = true;
            this.interaction.isInteracting = false; // Not a conversation
            this.interaction.showPickupNotification = true;
            this.interaction.lastPickedUpItem = ball;
            this.interaction.message = result.message;
            return this.createStateUpdate(currentState, currentState, result.message);
          }
        }
      }
  
      return null;
    }
  
    createStateUpdate(currentState, newState, interactionMessage = null) {
      return {
        savedPlayerPosition: { x: this.x, y: this.y },
        previousState: currentState,
        currentState: newState,
        interactionMessage,
      };
    }
  
    handleInventoryKey(keys, gameState) {
      if (keys["i"] || keys["I"]) {
        return this.createStateUpdate(gameState.currentState, STATES.INVENTORY);
      }
      return null;
    }
  
    handleEnterKey(keys) {
      if (keys["Enter"]) {
        if (this.interaction.showPickupNotification) {
          this.interaction.showPickupNotification = false;
          this.interaction.lastPickedUpItem = null;
          this.interaction.message = null;
          return true;
        }
        if (this.interaction.isInteracting) {
          this.interaction.isInteracting = false;
          this.interaction.message = null;
          return true;
        }
      }
      return false;
    }
  
    handleEscapeKey(keys, currentState, previousState, savedPlayerPosition) {
      if (keys["Escape"]) {
        return this.createStateUpdate(currentState, STATES.MAIN_MENU);
      }
      return { currentState, previousState, savedPlayerPosition };
    }
  
    // Override parent's draw method
    draw(canvas, ctx) {
      const { FRAME_WIDTH, FRAME_HEIGHT } = Player.FRAME_SETTINGS;
      const spriteRow = Player.DIRECTIONS[this.movement.direction];
  
      this.imgSourceX = this.sprite.frame * FRAME_WIDTH;
      this.imgSourceY = spriteRow * FRAME_HEIGHT;
  
      const scale = {
        x: canvas.width / 640,
        y: canvas.height / 360,
      };
  
      super.draw(ctx, scale.x, scale.y);
    }
  
    update({ keys, gameState, gameObjects }) {
      const inventoryUpdate = this.handleInventoryKey(keys, gameState);
      if (inventoryUpdate) return inventoryUpdate;
  
      const isMoving = this.move(keys);
      this.updateAnimation(gameState, isMoving);
  
      // If player is moving, clear all states
      if (isMoving) {
        return {
          currentState: gameState.currentState,
          previousState: gameState.previousState,
          savedPlayerPosition: gameState.savedPlayerPosition,
          interactionMessage: null,
          showPickupNotification: false,
          lastPickedUpItem: null,
          isInteracting: false,
        };
      }
  
      const interactionResult = this.checkInteractions(keys, gameObjects, gameState.currentState);
      if (interactionResult) return interactionResult;
  
      if (this.handleEnterKey(keys)) {
        return this.createStateUpdate(gameState.currentState, gameState.currentState, null);
      }
  
      const escapeResult = this.handleEscapeKey(keys, gameState.currentState, gameState.previousState, gameState.savedPlayerPosition);
  
      return {
        ...escapeResult,
        interactionMessage: this.interaction.message,
        showPickupNotification: this.interaction.showPickupNotification,
        lastPickedUpItem: this.interaction.lastPickedUpItem,
        isInteracting: this.interaction.isInteracting,
      };
    }
  }
  
  export default Player;
  