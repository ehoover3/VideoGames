// game/Inventory.js
import { STATES } from "../config/constants.js";
import { drawText } from "./utils/drawText.js";

export default class Inventory {
  static BASE_RESOLUTION = { width: 640, height: 360 };
  static INVENTORY_PADDING = 20;
  static SLOT_SIZE = 40;
  static SLOTS_PER_ROW = 5;
  static TOTAL_SLOTS = 10;
  static INTERACTION_DISTANCE = 40;

  constructor(canvas, ctx, keys, gameState) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.keys = keys;
    this.gameState = gameState;
    this.items = [];
    this.selectedSlot = -1;
  }

  load() {
    this.update();
    this.draw();
    const game = window.gameInstance;
    if (game) {
      game.hud.draw(this.gameState.currentState);
    }
  }

  addItem(item) {
    if (this.items.length < Inventory.TOTAL_SLOTS) {
      this.items.push(item);
      return {
        success: true,
        message: `Picked up ${item.name || "item"}!`,
      };
    }
    return {
      success: false,
      message: "Inventory is full! Drop something first.",
    };
  }

  dropItem(slotIndex) {
    if (slotIndex >= 0 && slotIndex < this.items.length) {
      const item = this.items[slotIndex];
      const game = window.gameInstance;
      if (game && game.gameObjects.player) {
        const player = game.gameObjects.player;
        item.x = player.x + player.width;
        item.y = player.y;
        item.isPickedUp = false;
        this.items.splice(slotIndex, 1);
      }
    }
    return {};
  }

  update() {
    if (this.keys["x"] || this.keys["X"]) {
      this.gameState.previousState = this.gameState.currentState;
      this.gameState.currentState = STATES.OVERWORLD;
      this.keys["x"] = false;
      this.keys["X"] = false;
    }

    // Adventure log navigation
    if (this.keys["l"] || this.keys["L"]) {
      this.gameState.currentState = STATES.ADVENTURE_LOG;
      this.keys["l"] = false;
      this.keys["L"] = false;
    }

    for (let i = 1; i <= 9; i++) {
      if (this.keys[i.toString()]) {
        this.selectedSlot = i - 1;
        this.keys[i.toString()] = false;
      }
    }

    if ((this.keys["d"] || this.keys["D"]) && this.selectedSlot !== -1) {
      const result = this.dropItem(this.selectedSlot);
      if (result.success) {
        this.selectedSlot = -1;
      }
      this.keys["d"] = false;
      this.keys["D"] = false;
    }
  }

  draw() {
    const scaleX = this.canvas.width / Inventory.BASE_RESOLUTION.width;
    const scaleY = this.canvas.height / Inventory.BASE_RESOLUTION.height;
    const scale = Math.min(scaleX, scaleY);

    // black background
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const padding = Inventory.INVENTORY_PADDING * scale;
    const slotSize = Inventory.SLOT_SIZE * scale;
    const fontSize = Math.floor(20 * scale);
    const smallerFontSize = Math.floor(14 * scale);
    const headerHeight = fontSize + smallerFontSize + 15; // Title + instructions + spacing

    const windowWidth = slotSize * Inventory.SLOTS_PER_ROW + padding * 2;
    const numRows = Math.ceil(Inventory.TOTAL_SLOTS / Inventory.SLOTS_PER_ROW);
    const windowHeight = slotSize * numRows + padding * 2 + headerHeight;

    const startX = (this.canvas.width - windowWidth) / 2;
    const startY = (this.canvas.height - windowHeight) / 2;

    // grey background
    this.ctx.fillStyle = "rgba(211, 211, 211, 0.95)";
    this.ctx.fillRect(startX, startY, windowWidth, windowHeight);

    // inventory header text
    drawText(this.ctx, "Inventory", startX + windowWidth / 2, startY + padding, `${fontSize}px Arial`, "black", "center");
    drawText(this.ctx, "Press 1-9 to select, D to drop, L for Adventure Log", startX + windowWidth / 2, startY + padding + fontSize + 5, `${smallerFontSize}px Arial`, "gray", "center");

    // inventory slots
    for (let i = 0; i < Inventory.TOTAL_SLOTS; i++) {
      const row = Math.floor(i / Inventory.SLOTS_PER_ROW);
      const col = i % Inventory.SLOTS_PER_ROW;
      const x = startX + padding + col * slotSize;
      const y = startY + padding + headerHeight + row * slotSize;

      this.ctx.fillStyle = i === this.selectedSlot ? "rgba(255, 165, 0, 0.3)" : "white";
      this.ctx.fillRect(x, y, slotSize, slotSize);

      this.ctx.strokeStyle = i === this.selectedSlot ? "orange" : "gray";
      this.ctx.strokeRect(x, y, slotSize, slotSize);

      this.ctx.fillStyle = "gray";
      this.ctx.font = `${Math.floor(12 * scale)}px Arial`;
      this.ctx.fillText((i + 1).toString(), x + 4, y + 14);

      if (this.items[i]) {
        const item = this.items[i];
        const itemPadding = slotSize * 0.1;
        this.ctx.drawImage(item.imgPath, item.imgSourceX, item.imgSourceY, item.imgSourceWidth, item.imgSourceHeight, x + itemPadding, y + itemPadding, slotSize - itemPadding * 2, slotSize - itemPadding * 2);
      }
    }
  }
}
