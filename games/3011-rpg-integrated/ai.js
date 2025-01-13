// index.js
import Game from "./game/Game.js";

const gameEngine = new Game("gameCanvas");
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
