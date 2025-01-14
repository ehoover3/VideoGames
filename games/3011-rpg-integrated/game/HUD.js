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
