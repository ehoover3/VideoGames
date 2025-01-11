// game/HUD.js

import { drawText } from "./utils/drawText.js";
import { STATES } from "../config/constants.js";

export default class HUD {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.scaleY = canvas.height / 360;
  }

  draw(currentState) {
    const hudHeight = 50 * this.scaleY;
    this.ctx.fillStyle = "lightgray";
    this.ctx.fillRect(0, this.canvas.height - hudHeight, this.canvas.width, hudHeight);

    const scaledFontSize = Math.max(16 * this.scaleY, 16) + "px Arial";
    const textHeight = parseInt(scaledFontSize);
    const scaledTextY = this.canvas.height - hudHeight / 2 + textHeight / 4;
    const hudText = currentState === STATES.OVERWORLD ? "Arrow Keys to Move | Space to Interact | ESC for Main Menu" : "Hold SPACE to Scan | X to Exit | ESC for Main Menu";

    drawText(this.ctx, hudText, this.canvas.width / 2, scaledTextY, scaledFontSize);
  }
}
