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
