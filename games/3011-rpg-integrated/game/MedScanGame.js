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
