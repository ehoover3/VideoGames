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

  drawBackground() {
    this.ctx.fillStyle = UI_CONFIG.HUD.BACKGROUND;
    this.ctx.fillRect(0, this.canvas.height - this.hudHeight, this.canvas.width, this.hudHeight);
  }

  drawObject(gameObject) {
    if (!gameObject || !gameObject.imgPath) return;

    const portraitX = UI_CONFIG.HUD.PADDING;
    const portraitY = this.canvas.height - this.hudHeight + UI_CONFIG.HUD.PADDING;

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

    if (displayObject) {
      this.drawObject(displayObject);
      textX = this.portraitSize + UI_CONFIG.HUD.PADDING * 3;
      textAlign = "left";
    }

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

    drawText(this.ctx, hudText, textX, textY, font, "black", textAlign);
  }
}
