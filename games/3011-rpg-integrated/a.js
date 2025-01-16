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
      coin: loadImage("assets/images/overworld/coin.png"),
      dog: loadImage("assets/images/overworld/dog.png"),
      mri: loadImage("assets/images/overworld/mri.png"),
      player: loadImage("assets/images/overworld/player.png"),
    };
  }

  getGameObjects() {
    const player = new Player(this.images["player"], 100, 100, 32, 32, 4, DIRECTION.DOWN);

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

    const coin = new Item({
      imgPath: this.images["coin"],
      imgSourceX: 90,
      imgSourceY: 80,
      imgSourceWidth: 100,
      imgSourceHeight: 130,
      x: 130,
      y: 70,
      width: 16,
      height: 16,
      name: "Coin",
      isPickedUp: false,
    });

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

    return { ball, coin, dog, mri, player };
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

  initializeQuests() {
    const dogQuest = new DogBallQuest();
    if (this.gameObjects.dog) {
      this.gameObjects.dog.quest = dogQuest;
    }
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

  // game/GameState.js
  import { STATES, ACTIONS, DIRECTION } from "../config/constants.js";
  
  export default class GameState {
    constructor() {
      this.state = {
        currentState: STATES.MAIN_MENU,
        previousState: STATES.MAIN_MENU,
        player: {
          position: { x: 0, y: 0 },
          direction: DIRECTION.DOWN,
          currentAction: ACTIONS.IDLE,
        },
        game: {
          isStarted: false,
          isPaused: false,
          selectedMenuOption: 0,
        },
        animation: {
          currentFrame: 0,
          timer: 0,
          speed: 10,
        },
        scan: {
          progress: 0,
          maxProgress: 100,
          isScanning: false,
        },
      };
  
      this.listeners = new Set();
    }
  
    get currentState() {
      return this.state.currentState;
    }
  
    get previousState() {
      return this.state.previousState;
    }
  
    get playerPosition() {
      return this.state.player.position;
    }
  
    get isGameStarted() {
      return this.state.game.isStarted;
    }
  
    // State mutation methods
    setState(newState) {
      this.state.previousState = this.state.currentState;
      this.state.currentState = newState;
      this.notifyListeners();
    }
  
    setPlayerPosition(x, y) {
      this.state.player.position = { x, y };
      this.notifyListeners();
    }
  
    setPlayerDirection(direction) {
      this.state.player.direction = direction;
      this.notifyListeners();
    }
  
    setPlayerAction(action) {
      this.state.player.currentAction = action;
      this.notifyListeners();
    }
  
    setScanProgress(progress) {
      this.state.scan.progress = Math.min(progress, this.state.scan.maxProgress);
      this.notifyListeners();
    }
  
    setMenuOption(option) {
      this.state.game.selectedMenuOption = option;
      this.notifyListeners();
    }
  
    startGame() {
      this.state.game.isStarted = true;
      this.notifyListeners();
    }
  
    pauseGame() {
      this.state.game.isPaused = true;
      this.notifyListeners();
    }
  
    resumeGame() {
      this.state.game.isPaused = false;
      this.notifyListeners();
    }
  
    updateAnimation(deltaTime) {
      this.state.animation.timer += deltaTime;
      if (this.state.animation.timer >= this.state.animation.speed) {
        this.state.animation.currentFrame = (this.state.animation.currentFrame + 1) % 4; // Assuming 4 frames per animation
        this.state.animation.timer = 0;
        this.notifyListeners();
      }
    }
  
    addListener(listener) {
      this.listeners.add(listener);
    }
  
    removeListener(listener) {
      this.listeners.delete(listener);
    }
  
    notifyListeners() {
      this.listeners.forEach((listener) => listener(this.state));
    }
  
    serialize() {
      return JSON.stringify({
        player: this.state.player,
        game: this.state.game,
        scan: this.state.scan,
      });
    }
  
    deserialize(savedState) {
      const parsed = JSON.parse(savedState);
      this.state = {
        ...this.state,
        player: parsed.player,
        game: parsed.game,
        scan: parsed.scan,
      };
      this.notifyListeners();
    }
  }

  // game/HUD.js
  import { drawText } from "./utils/drawText.js";
  import { STATES, GAME_CONFIG, UI_CONFIG } from "../config/constants.js";
  
  export default class HUD {
    constructor(canvas, ctx) {
      this.canvas = canvas;
      this.ctx = ctx;
      this.calculateScaling();
    }
  
    calculateScaling() {
      this.scaleX = this.canvas.width / GAME_CONFIG.BASE_RESOLUTION.width;
      this.scaleY = this.canvas.height / GAME_CONFIG.BASE_RESOLUTION.height;
      this.scale = Math.min(this.scaleX, this.scaleY);
      this.hudHeight = Math.max(50 * this.scale, UI_CONFIG.HUD.MIN_HEIGHT);
      this.fontSize = Math.max(UI_CONFIG.HUD.MIN_FONT_SIZE * this.scale, UI_CONFIG.HUD.MIN_FONT_SIZE);
      this.portraitSize = this.hudHeight - UI_CONFIG.HUD.PADDING * 2;
    }
  
    draw(currentState, interactionMessage, displayObject) {
      // Calculate scaling and draw background
      this.calculateScaling();
      this.ctx.fillStyle = UI_CONFIG.HUD.BACKGROUND;
      this.ctx.fillRect(0, this.canvas.height - this.hudHeight, this.canvas.width, this.hudHeight);
  
      // Set up text properties
      const font = `${Math.floor(this.fontSize)}px Arial`;
      const textY = this.canvas.height - this.hudHeight / 2 + this.fontSize / 3;
      let textX = this.canvas.width / 2;
      let textAlign = "center";
  
      // Draw object if present
      if (displayObject && displayObject.imgPath) {
        const portraitX = UI_CONFIG.HUD.PADDING;
        const portraitY = this.canvas.height - this.hudHeight + UI_CONFIG.HUD.PADDING;
  
        // Draw white background for portrait
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(portraitX, portraitY, this.portraitSize, this.portraitSize);
  
        // Draw the object image
        this.ctx.drawImage(displayObject.imgPath, displayObject.imgSourceX, displayObject.imgSourceY, displayObject.imgSourceWidth, displayObject.imgSourceHeight, portraitX, portraitY, this.portraitSize, this.portraitSize);
  
        // Adjust text position when object is displayed
        textX = this.portraitSize + UI_CONFIG.HUD.PADDING * 3;
        textAlign = "left";
      }
  
      // Determine HUD text based on state or interaction message
      let hudText = interactionMessage;
      if (!hudText) {
        switch (currentState) {
          case STATES.OVERWORLD:
            hudText = "(Space) Interact | (I) Inventory | (ESC) Main Menu";
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
  
      // Draw the text
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
    static TOTAL_SLOTS = 10;
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
          this.items.splice(slotIndex, 1);
        }
      }
      return {};
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
        this.keys["d"] = false;
        this.keys["D"] = false;
      }
    }
  
    draw() {
      const scaleX = this.canvas.width / Inventory.BASE_RESOLUTION.width;
      const scaleY = this.canvas.height / Inventory.BASE_RESOLUTION.height;
      const scale = Math.min(scaleX, scaleY);
  
      // black background
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  
      const padding = Inventory.INVENTORY_PADDING * scale;
      const slotSize = Inventory.SLOT_SIZE * scale;
      const fontSize = Math.floor(20 * scale);
      const smallerFontSize = Math.floor(14 * scale);
      const headerHeight = fontSize + smallerFontSize + 15; // Title + instructions + spacing
  
      const windowWidth = slotSize * Inventory.SLOTS_PER_ROW + padding * 2;
      const numRows = Math.ceil(Inventory.TOTAL_SLOTS / Inventory.SLOTS_PER_ROW);
      const windowHeight = slotSize * numRows + padding * 2 + headerHeight;
  
      const startX = (this.canvas.width - windowWidth) / 2;
      const startY = (this.canvas.height - windowHeight) / 2;
  
      // grey background
      this.ctx.fillStyle = "rgba(211, 211, 211, 0.95)";
      this.ctx.fillRect(startX, startY, windowWidth, windowHeight);
  
      // inventory header text
      drawText(this.ctx, "Inventory", startX + windowWidth / 2, startY + padding, `${fontSize}px Arial`, "black", "center");
      drawText(this.ctx, "Press 1-9 to select, then D to drop", startX + windowWidth / 2, startY + padding + fontSize + 5, `${smallerFontSize}px Arial`, "gray", "center");
  
      // inventory slots
      for (let i = 0; i < Inventory.TOTAL_SLOTS; i++) {
        const row = Math.floor(i / Inventory.SLOTS_PER_ROW);
        const col = i % Inventory.SLOTS_PER_ROW;
        const x = startX + padding + col * slotSize;
        const y = startY + padding + headerHeight + row * slotSize;
  
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
  
// game/Menu.js
import { drawText } from "./utils/drawText.js";
import { STATES, UI_CONFIG } from "../config/constants.js";

const SHADOW_BLUR = 0;
const SHADOW_OFFSET_X = 2;
const SHADOW_OFFSET_Y = 2;
const SHADOW_COLOR = "rgba(0, 0, 0, 0.2)";

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
      [STATES.MED_SCAN_GAME]: STATES.MED_SCAN_GAME,
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

    const titleFontSize = Math.round(canvas.height * UI_CONFIG.MENU.TITLE_HEIGHT_RATIO);
    drawText(ctx, "Science Game", canvas.width / 2, canvas.height / 4, `${titleFontSize}px Arial`, "black");

    const menu = isGameStarted ? [MENU_OPTIONS.RETURN_TO_GAME, ...BASE_MENU.slice(1)] : BASE_MENU;

    const menuStartY = canvas.height * UI_CONFIG.MENU.MENU_START_Y_RATIO;
    const menuSpacing = canvas.height * UI_CONFIG.MENU.SPACING_RATIO;
    const menuFontSize = Math.round(canvas.height * UI_CONFIG.MENU.FONT_SIZE_RATIO);
    const buttonPadding = canvas.height * UI_CONFIG.MENU.BUTTON.PADDING_RATIO;

    menu.forEach((option, index) => {
      const isSelected = index === selectedOption;

      const buttonWidth = canvas.width * UI_CONFIG.MENU.BUTTON.WIDTH_RATIO;
      const buttonHeight = menuFontSize + buttonPadding;
      const buttonX = (canvas.width - buttonWidth) * UI_CONFIG.MENU.BUTTON.RADIUS_RATIO;
      const buttonY = menuStartY + index * menuSpacing - buttonHeight;

      const buttonColor = isSelected ? UI_CONFIG.MENU.COLORS.SELECTED : UI_CONFIG.MENU.COLORS.TEXT_SELECTED;
      const textColor = isSelected ? UI_CONFIG.MENU.COLORS.DEFAULT : UI_CONFIG.MENU.COLORS.TEXT_DEFAULT;

      ctx.beginPath();
      ctx.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, buttonHeight / 2);
      ctx.fillStyle = buttonColor;
      ctx.fill();
      ctx.shadowColor = SHADOW_COLOR;
      ctx.shadowBlur = SHADOW_BLUR;
      ctx.shadowOffsetX = SHADOW_OFFSET_X;
      ctx.shadowOffsetY = SHADOW_OFFSET_Y;
      ctx.strokeStyle = UI_CONFIG.MENU.COLORS.STROKE;
      ctx.stroke();
      ctx.shadowBlur = SHADOW_BLUR;

      drawText(ctx, option, canvas.width / 2, buttonY + buttonHeight / 2 + menuFontSize / 3, `${menuFontSize}px Arial`, textColor);
    });
  }
}

// game/NPC.js
export default class NPC extends GameObject {
    constructor(config) {
      super(config);
      this.interactionText = config.interactionText;
      this.quest = null; // Add this line
    }
  
    interact(gameState) {
      if (this.quest) {
        return this.quest.handleInteraction(window.gameInstance.gameObjects.player, this, gameState);
      }
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
      if (update.isInteracting && this.gameObjects.dog) {
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
    const { ball, coin, dog, mri } = this.gameObjects;
    const scaleX = this.canvas.width / 640;
    const scaleY = this.canvas.height / 360;

    if (!ball.isPickedUp) {
      ball.draw(this.ctx, scaleX, scaleY);
    }

    if (!coin.isPickedUp) {
      coin.draw(this.ctx, scaleX, scaleY);
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
      droppedItem: null,
    };
  }

  move(keys) {
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

    if (!movement.isMoving) return false;

    // Reset all interaction states when moving
    this.interaction.isInteracting = false;
    this.interaction.message = null;
    this.interaction.showPickupNotification = false;
    this.interaction.lastPickedUpItem = null;

    // Update position
    const isDiagonal = movement.x !== 0 && movement.y !== 0;
    const speed = isDiagonal ? this.movement.speed / Math.SQRT2 : this.movement.speed;

    this.x += movement.x * speed;
    this.y += movement.y * speed;

    this.movement.direction = movement.direction;
    return true;
  }

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
    const { WALK_FRAMES, ANIMATION_SPEED } = Player.FRAME_SETTINGS;
    const { ball, coin, dog, mri } = gameObjects;

    // Handle inventory first
    const inventoryUpdate = this.handleInventoryKey(keys, gameState);
    if (inventoryUpdate) return inventoryUpdate;

    // Handle movement and animation
    const isMoving = this.move(keys);

    // Update animation state
    if (!isMoving) {
      this.sprite.frame = 0;
      this.sprite.animationTimer = 0;
    } else {
      this.sprite.animationTimer++;
      if (this.sprite.animationTimer >= ANIMATION_SPEED) {
        this.sprite.animationTimer = 0;
        this.sprite.frame = (this.sprite.frame + 1) % WALK_FRAMES;
      }
    }

    gameState.currentFrame = this.sprite.frame;

    // If moving, reset interaction state
    if (isMoving) {
      return {
        currentState: gameState.currentState,
        previousState: gameState.previousState,
        savedPlayerPosition: gameState.savedPlayerPosition,
        interactionMessage: null,
        showPickupNotification: false,
        lastPickedUpItem: null,
        isInteracting: false,
        droppedItem: null,
      };
    }

    // Handle interactions
    const isWithinInteractionDistance = (object) => {
      const dx = this.x - object.x;
      const dy = this.y - object.y;
      return Math.sqrt(dx * dx + dy * dy) <= Inventory.INTERACTION_DISTANCE;
    };

    // Check for MRI interaction
    if (this.isColliding(mri) && keys[" "]) {
      return this.changeGameState(gameState.currentState, STATES.MED_SCAN_GAME);
    }

    // Check for dog interaction if not showing pickup notification
    if (!this.interaction.showPickupNotification && this.isColliding(dog) && keys[" "]) {
      this.interaction.isInteracting = true;
      this.interaction.message = dog.interact();
      return this.changeGameState(gameState.currentState, gameState.currentState, this.interaction.message);
    }

    // Handle ball pickup
    if (!ball.isPickedUp && keys[" "] && isWithinInteractionDistance(ball)) {
      const game = window.gameInstance;
      if (game?.getInventory()) {
        const result = game.getInventory().addItem(ball);
        if (result.success) {
          ball.isPickedUp = true;
          this.interaction.isInteracting = false;
          this.interaction.showPickupNotification = true;
          this.interaction.lastPickedUpItem = ball;
          this.interaction.message = result.message;
          return this.changeGameState(gameState.currentState, gameState.currentState, result.message);
        }
      }
    }

    // Handle coin pickup
    if (!coin.isPickedUp && keys[" "] && isWithinInteractionDistance(coin)) {
      const game = window.gameInstance;
      if (game?.getInventory()) {
        const result = game.getInventory().addItem(coin);
        if (result.success) {
          coin.isPickedUp = true;
          this.interaction.isInteracting = false;
          this.interaction.showPickupNotification = true;
          this.interaction.lastPickedUpItem = coin;
          this.interaction.message = result.message;
          return this.changeGameState(gameState.currentState, gameState.currentState, result.message);
        }
      }
    }

    // Handle enter key
    if (this.handleEnterKey(keys)) {
      return this.changeGameState(gameState.currentState, gameState.currentState, null);
    }

    // Handle escape key
    const escapeResult = this.handleEscapeKey(keys, gameState.currentState, gameState.previousState, gameState.savedPlayerPosition);

    // Return final state with current interaction status
    return {
      ...escapeResult,
      interactionMessage: this.interaction.message,
      showPickupNotification: this.interaction.showPickupNotification,
      lastPickedUpItem: this.interaction.lastPickedUpItem,
      isInteracting: this.interaction.isInteracting,
      droppedItem: this.interaction.droppedItem,
    };
  }

  changeGameState(currentState, newState, interactionMessage = null) {
    return {
      savedPlayerPosition: { x: this.x, y: this.y },
      previousState: currentState,
      currentState: newState,
      interactionMessage,
    };
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

  handleInventoryKey(keys, gameState) {
    if (keys["i"] || keys["I"]) {
      return this.changeGameState(gameState.currentState, STATES.INVENTORY);
    }
    return null;
  }

  handleEscapeKey(keys, currentState, previousState, savedPlayerPosition) {
    if (keys["Escape"]) {
      return this.changeGameState(currentState, STATES.MAIN_MENU);
    }
    return { currentState, previousState, savedPlayerPosition };
  }
}

export default Player;

// game/Quest.js
export default class Quest {
    constructor(config) {
      this.id = config.id;
      this.title = config.title;
      this.description = config.description;
      this.objectives = config.objectives.map((obj) => ({
        ...obj,
        completed: false,
      }));
      this.reward = config.reward;
      this.isCompleted = false;
    }
  
    updateObjective(objectiveId, progress) {
      const objective = this.objectives.find((obj) => obj.id === objectiveId);
      if (objective) {
        objective.progress = progress;
        objective.completed = progress >= objective.required;
        this.checkCompletion();
      }
    }
  
    checkCompletion() {
      this.isCompleted = this.objectives.every((obj) => obj.completed);
    }
  }
  
  // Example usage:
  const sampleQuest = {
    id: "dog_training",
    title: "Dog Training",
    description: "Help train the hospital's therapy dog",
    objectives: [
      {
        id: "fetch",
        description: "Play fetch with the dog 3 times",
        required: 3,
        progress: 0,
      },
      {
        id: "treats",
        description: "Give treats to the dog",
        required: 1,
        progress: 0,
      },
    ],
    reward: {
      items: ["dog_treat_bag"],
      experience: 100,
    },
  };
  

  // game/quests/DogBallQuest.js
  import Quest from "../Quest.js";
  import { STATES } from "../../config/constants.js";
  
  export default class DogBallQuest extends Quest {
    constructor() {
      super({
        id: "give_dog_ball",
        title: "A Dog's Best Friend",
        description: "Find a tennis ball and give it to the therapy dog.",
        objectives: [
          {
            id: "find_ball",
            description: "Find and pick up the tennis ball",
            required: 1,
            progress: 0,
          },
          {
            id: "give_ball",
            description: "Give the ball to the dog",
            required: 1,
            progress: 0,
          },
        ],
        reward: {
          items: ["dog_treat"],
          experience: 50,
        },
      });
  
      this.questStates = {
        NOT_STARTED: "NOT_STARTED",
        BALL_FOUND: "BALL_FOUND",
        COMPLETED: "COMPLETED",
      };
  
      this.currentState = this.questStates.NOT_STARTED;
      this.dialogueOptions = this.setupDialogue();
    }
  
    setupDialogue() {
      return {
        [this.questStates.NOT_STARTED]: "Woof! *The dog looks longingly at the tennis ball in the distance*",
        [this.questStates.BALL_FOUND]: "Woof woof! *The dog's tail wags excitedly at the sight of the ball*",
        [this.questStates.COMPLETED]: "Woof! *The dog happily plays with the ball*",
      };
    }
  
    handleInteraction(player, dog, gameState) {
      const inventory = window.gameInstance?.getInventory();
      if (!inventory) return null;
  
      const hasBall = inventory.items.some((item) => item.name === "Tennis Ball");
  
      switch (this.currentState) {
        case this.questStates.NOT_STARTED:
          if (!hasBall) {
            this.updateObjective("find_ball", 0);
            return this.dialogueOptions[this.questStates.NOT_STARTED];
          } else {
            this.currentState = this.questStates.BALL_FOUND;
            this.updateObjective("find_ball", 1);
            return this.dialogueOptions[this.questStates.BALL_FOUND];
          }
  
        case this.questStates.BALL_FOUND:
          if (hasBall) {
            // Find and remove the ball from inventory
            const ballIndex = inventory.items.findIndex((item) => item.name === "Tennis Ball");
            if (ballIndex !== -1) {
              inventory.items.splice(ballIndex, 1);
  
              // Complete the quest
              this.currentState = this.questStates.COMPLETED;
              this.updateObjective("give_ball", 1);
              this.completeQuest(player);
  
              return "You gave the ball to the dog. The dog seems overjoyed!";
            }
          }
          return this.dialogueOptions[this.questStates.BALL_FOUND];
  
        case this.questStates.COMPLETED:
          return this.dialogueOptions[this.questStates.COMPLETED];
  
        default:
          return "Woof?";
      }
    }
  
    getProgress() {
      return {
        title: this.title,
        description: this.description,
        objectives: this.objectives.map((obj) => ({
          description: obj.description,
          progress: obj.progress,
          required: obj.required,
          completed: obj.completed,
        })),
        completed: this.isCompleted,
      };
    }
  
    completeQuest(player) {
      this.isCompleted = true;
  
      // Add reward to inventory
      const inventory = window.gameInstance?.getInventory();
      if (inventory) {
        // You could create a new dog treat item here
        // inventory.addItem(new Item({ ...dogTreatConfig }));
      }
    }
  }
  