// game/Inventory.js
import { drawText } from "./utils/drawText.js";
import { STATES } from "../config/constants.js";

export default class Inventory {
  static BASE_RESOLUTION = { width: 640, height: 360 };
  static INVENTORY_PADDING = 20;
  static SLOT_SIZE = 40;
  static SLOTS_PER_ROW = 5;
  static TOTAL_SLOTS = 15;

  constructor(canvas, ctx, keys, gameState) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.keys = keys;
    this.gameState = gameState;
    this.items = [];
  }

  load() {
    this.update();
    this.draw();
  }

  update() {
    if (this.keys["x"] || this.keys["X"]) {
      this.gameState.previousState = this.gameState.currentState;
      this.gameState.currentState = STATES.OVERWORLD;
      this.keys["x"] = false;
      this.keys["X"] = false;
    }

    if (this.keys["Escape"]) {
      this.gameState.previousState = this.gameState.currentState;
      this.gameState.currentState = STATES.MAIN_MENU;
      this.keys["Escape"] = false;
    }
  }

  draw() {
    const scaleX = this.canvas.width / Inventory.BASE_RESOLUTION.width;
    const scaleY = this.canvas.height / Inventory.BASE_RESOLUTION.height;
    const scale = Math.min(scaleX, scaleY);

    // Draw semi-transparent background
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Calculate inventory window dimensions
    const padding = Inventory.INVENTORY_PADDING * scale;
    const slotSize = Inventory.SLOT_SIZE * scale;
    const windowWidth = slotSize * Inventory.SLOTS_PER_ROW + padding * 2;
    const windowHeight = slotSize * Math.ceil(Inventory.TOTAL_SLOTS / Inventory.SLOTS_PER_ROW) + padding * 2;
    const startX = (this.canvas.width - windowWidth) / 2;
    const startY = (this.canvas.height - windowHeight) / 2;

    // Draw inventory window background
    this.ctx.fillStyle = "rgba(211, 211, 211, 0.95)";
    this.ctx.fillRect(startX, startY, windowWidth, windowHeight);

    // Draw title
    const fontSize = Math.floor(20 * scale);
    drawText(this.ctx, "Inventory", startX + windowWidth / 2, startY + padding, `${fontSize}px Arial`, "black", "center");

    // Draw inventory slots
    for (let i = 0; i < Inventory.TOTAL_SLOTS; i++) {
      const row = Math.floor(i / Inventory.SLOTS_PER_ROW);
      const col = i % Inventory.SLOTS_PER_ROW;
      const x = startX + padding + col * slotSize;
      const y = startY + padding * 2 + row * slotSize;

      // Draw slot background
      this.ctx.fillStyle = "white";
      this.ctx.fillRect(x, y, slotSize, slotSize);

      // Draw slot border
      this.ctx.strokeStyle = "gray";
      this.ctx.strokeRect(x, y, slotSize, slotSize);

      // If there's an item in this slot, draw it (placeholder)
      if (this.items[i]) {
        this.ctx.fillStyle = "blue";
        this.ctx.fillRect(x + 5, y + 5, slotSize - 10, slotSize - 10);
      }
    }
  }
}
