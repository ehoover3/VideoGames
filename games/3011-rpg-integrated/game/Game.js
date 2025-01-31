// game/Game.js
import { ACTIONS, STATES, DIRECTION } from "../config/constants.js";
import MedScanGame from "./MedScanGame.js";
import Menu from "./Menu.js";
import Overworld from "./Overworld.js";
import Inventory from "./Inventory.js";
import System from "./System.js";
import HUD from "./HUD.js";
import Item from "./Item.js";
import NPC from "./NPC.js";
import Player from "./Player.js";
import DogBallQuest from "./quests/DogBallQuest.js";
import AdventureLog from "./AdventureLog.js";

export default class Game {
  constructor(canvasId) {
    this.ASPECT_RATIO = 16 / 9;
    this.setupCanvas(canvasId);
    this.keys = this.setupKeyboard();
    this.startGameState();
    this.loadImages();
    this.gameObjects = this.getGameObjects();
    this.initializeQuests();
    this.adventureLog = new AdventureLog(this.canvas, this.ctx, this.keys, this.gameState);
    this.inventory = new Inventory(this.canvas, this.ctx, this.keys, this.gameState);
    this.system = new System(this.canvas, this.ctx, this.keys, this.gameState);
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
      tree: loadImage("assets/images/overworld/tree.png"),
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
      width: 16,
      height: 16,
      name: "Tennis Ball",
      isPickedUp: false,
      itemCategory: "Key Items",
      description: "A bouncy tennis ball.",
    });

    const coin = new Item({
      imgPath: this.images["coin"],
      imgSourceX: 90,
      imgSourceY: 80,
      imgSourceWidth: 100,
      imgSourceHeight: 130,
      width: 16,
      height: 16,
      name: "Coin",
      isPickedUp: false,
      itemCategory: "Key Items",
      description: "A shiny metal coin.",
    });

    const dog = new NPC({
      imgPath: this.images["dog"],
      imgSourceX: 0,
      imgSourceY: 0,
      imgSourceWidth: 489,
      imgSourceHeight: 510,
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
      width: 64,
      height: 64,
      name: "MRI Machine",
    });

    const tree = new NPC({
      imgPath: this.images["tree"],
      imgSourceX: 32,
      imgSourceY: 23,
      imgSourceWidth: 63,
      imgSourceHeight: 78,
      width: 64,
      height: 64,
    });

    return { ball, coin, dog, mri, player, tree };
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
      [STATES.ADVENTURE_LOG]: () => this.adventureLog.load(),
      [STATES.INVENTORY]: () => this.inventory.load(),
      [STATES.SYSTEM]: () => this.system.load(),
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
    // Create the dog quest instance
    const dogQuest = new DogBallQuest();

    // Assign the quest to the dog NPC
    if (this.gameObjects.dog) {
      this.gameObjects.dog.quest = dogQuest;
    } else {
      console.error("Dog NPC not found when initializing quests");
    }
  }
}
