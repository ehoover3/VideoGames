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

    // Calculate HUD dimensions with minimum bounds
    this.hudHeight = Math.max(50 * this.scale, HUD.MIN_HUD_HEIGHT);
    this.fontSize = Math.max(HUD.MIN_FONT_SIZE * this.scale, HUD.MIN_FONT_SIZE);
  }

  draw(currentState) {
    // Recalculate scaling in case canvas size has changed
    this.calculateScaling();

    // Draw HUD background
    this.ctx.fillStyle = "rgba(211, 211, 211, 0.9)";
    this.ctx.fillRect(0, this.canvas.height - this.hudHeight, this.canvas.width, this.hudHeight);

    // Set up text properties
    const font = `${Math.floor(this.fontSize)}px Arial`;
    const textY = this.canvas.height - this.hudHeight / 2;

    // Determine HUD text based on game state
    const hudText = currentState === STATES.OVERWORLD ? "Arrow Keys to Move | Space to Interact | ESC for Main Menu" : "Hold SPACE to Scan | X to Exit | ESC for Main Menu";

    // Draw text with proper scaling
    drawText(this.ctx, hudText, this.canvas.width / 2, textY, font, "black", "center");
  }

  // export function drawText(ctx, text, x, y, font = "16px Arial", color = "black", align = "center") {
  //   ctx.fillStyle = color;
  //   ctx.font = font;
  //   ctx.textAlign = align;
  //   ctx.fillText(text, x, y);
  // }
}
