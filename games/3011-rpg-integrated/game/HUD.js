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

  draw(currentState, interactionMessage) {
    this.calculateScaling();

    this.ctx.fillStyle = "rgba(211, 211, 211, 0.9)";
    this.ctx.fillRect(0, this.canvas.height - this.hudHeight, this.canvas.width, this.hudHeight);

    const font = `${Math.floor(this.fontSize)}px Arial`;
    const textY = this.canvas.height - this.hudHeight / 2 + this.fontSize / 3;

    let hudText;
    if (interactionMessage) {
      hudText = interactionMessage; // Display the interaction message
    } else {
      switch (currentState) {
        case STATES.OVERWORLD:
          hudText = "Arrow Keys to Move | Space to Interact | I for Inventory | ESC for Main Menu";
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
    }

    drawText(this.ctx, hudText, this.canvas.width / 2, textY, font, "black", "center");
  }
}
