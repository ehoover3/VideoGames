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
    this.initializeGameState();
    this.loadGameAssets();
    this.inventory = new Inventory(this.canvas, this.ctx, this.keys, this.gameState);
    this.gameObjects = this.initGameObjects();
    this.initializeGameComponents();
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

  initializeGameState() {
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

  loadGameAssets() {
    this.loadedImages = {
      ball: this.loadImage("assets/images/overworld/tennisBall.png"),
      dog: this.loadImage("assets/images/overworld/dog.png"),
      mri: this.loadImage("assets/images/overworld/mri.png"),
      player: this.loadImage("assets/images/overworld/player.png"),
    };
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

    const mri = new Item({
      imgPath: this.loadedImages["mri"],
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
      imgPath: this.loadedImages["ball"],
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

  initializeGameComponents() {
    this.menu = new Menu(this.canvas, this.ctx, this.keys, this.gameState);
    this.overworld = new Overworld(this.canvas, this.ctx, this.keys, this.gameState, this.gameObjects, this.inventory);
    this.scanGame = new MedScanGame(this.canvas, this.ctx, this.keys, this.gameState, this.gameObjects);
    this.hud = new HUD(this.canvas, this.ctx);

    this.handleGameState = {
      [STATES.MAIN_MENU]: () => this.menu.load(),
      [STATES.OVERWORLD]: () => this.overworld.load(),
      [STATES.MED_SCAN_GAME]: () => this.scanGame.load(),
      [STATES.INVENTORY]: () => {
        this.inventory.update();
        this.inventory.draw();
        this.hud.draw(this.gameState.currentState);
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
  

  