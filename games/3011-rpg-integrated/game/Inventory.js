import { STATES } from "../config/constants.js";
import { drawText } from "./utils/drawText.js";

export default class Inventory {
  static BASE_RESOLUTION = { width: 640, height: 360 };
  static INVENTORY_PADDING = 20;
  static SLOT_SIZE = 40;
  static SLOTS_PER_ROW = 4;
  static TOTAL_SLOTS = 16;
  static INTERACTION_DISTANCE = 40;
  static CATEGORIES = ["Weapons", "Bows and Arrows", "Shields", "Armor", "Materials", "Food", "Key Items"];

  constructor(canvas, ctx, keys, gameState) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.keys = keys;
    this.gameState = gameState;
    this.items = [];
    this.selectedSlot = 0;
    this.selectedCategory = "Weapons";

    // Add key state tracking to prevent continuous movement while holding keys
    this.keyStates = {
      ArrowLeft: false,
      ArrowRight: false,
      ArrowUp: false,
      ArrowDown: false,
    };
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

  handleArrowNavigation() {
    const rows = Math.ceil(Inventory.TOTAL_SLOTS / Inventory.SLOTS_PER_ROW);
    const currentRow = Math.floor(this.selectedSlot / Inventory.SLOTS_PER_ROW);
    const currentCol = this.selectedSlot % Inventory.SLOTS_PER_ROW;

    // Track if we're currently navigating categories
    const isInCategoryNav = this.selectedSlot === -1;

    // Find current category index
    const currentCategoryIndex = Inventory.CATEGORIES.indexOf(this.selectedCategory);

    // Only process a key if it wasn't already pressed (prevent holding)
    if (this.keys.ArrowLeft && !this.keyStates.ArrowLeft) {
      if (isInCategoryNav) {
        // Navigate categories to the left
        const newIndex = Math.max(0, currentCategoryIndex - 1);
        this.selectedCategory = Inventory.CATEGORIES[newIndex];
      } else {
        // Navigate inventory slots to the left
        this.selectedSlot = Math.max(0, this.selectedSlot - 1);
      }
      this.keyStates.ArrowLeft = true;
    }

    if (this.keys.ArrowRight && !this.keyStates.ArrowRight) {
      if (isInCategoryNav) {
        // Navigate categories to the right
        const newIndex = Math.min(Inventory.CATEGORIES.length - 1, currentCategoryIndex + 1);
        this.selectedCategory = Inventory.CATEGORIES[newIndex];
      } else {
        // Navigate inventory slots to the right
        this.selectedSlot = Math.min(Inventory.TOTAL_SLOTS - 1, this.selectedSlot + 1);
      }
      this.keyStates.ArrowRight = true;
    }

    if (this.keys.ArrowUp && !this.keyStates.ArrowUp) {
      if (currentRow === 0 && !isInCategoryNav) {
        // Move from top row to category navigation
        this.selectedSlot = -1;
      } else if (!isInCategoryNav && currentRow > 0) {
        // Navigate up within inventory
        this.selectedSlot -= Inventory.SLOTS_PER_ROW;
      }
      this.keyStates.ArrowUp = true;
    }

    if (this.keys.ArrowDown && !this.keyStates.ArrowDown) {
      if (isInCategoryNav) {
        // Move from category navigation to first row of inventory
        this.selectedSlot = 0; // Start at the first slot of the inventory
      } else if (currentRow < rows - 1 && this.selectedSlot + Inventory.SLOTS_PER_ROW < Inventory.TOTAL_SLOTS) {
        // Navigate down within inventory
        this.selectedSlot += Inventory.SLOTS_PER_ROW;
      }
      this.keyStates.ArrowDown = true;
    }

    // Reset key states when keys are released
    if (!this.keys.ArrowLeft) this.keyStates.ArrowLeft = false;
    if (!this.keys.ArrowRight) this.keyStates.ArrowRight = false;
    if (!this.keys.ArrowUp) this.keyStates.ArrowUp = false;
    if (!this.keys.ArrowDown) this.keyStates.ArrowDown = false;
  }

  update() {
    if (this.keys["x"] || this.keys["X"]) {
      this.gameState.previousState = this.gameState.currentState;
      this.gameState.currentState = STATES.OVERWORLD;
      this.keys["x"] = false;
      this.keys["X"] = false;
    }

    if (this.keys["l"] || this.keys["L"]) {
      this.gameState.currentState = STATES.ADVENTURE_LOG;
      this.keys["l"] = false;
      this.keys["L"] = false;
    }

    this.handleArrowNavigation();

    if ((this.keys["d"] || this.keys["D"]) && this.selectedSlot !== -1) {
      const result = this.dropItem(this.selectedSlot);
      if (result.success) {
        this.selectedSlot = -1;
      }
      this.keys["d"] = false;
      this.keys["D"] = false;
    }
  }

  isMouseInCategory(mouseX, mouseY, categoryX, categoryY, categoryWidth, categoryHeight) {
    return mouseX >= categoryX && mouseX <= categoryX + categoryWidth && mouseY >= categoryY && mouseY <= categoryY + categoryHeight;
  }

  handleCategoryClick(mouseX, mouseY, startX, startY, tabWidth, tabHeight) {
    const scale = Math.min(this.canvas.width / Inventory.BASE_RESOLUTION.width, this.canvas.height / Inventory.BASE_RESOLUTION.height);

    Inventory.CATEGORIES.forEach((category, index) => {
      const categoryX = startX + tabWidth * index;
      if (this.isMouseInCategory(mouseX, mouseY, categoryX, startY, tabWidth, tabHeight)) {
        this.selectedCategory = category;
        this.selectedSlot = 0; // Reset slot selection when changing category
      }
    });
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
    const headerHeight = fontSize + smallerFontSize + 15;
    const categoryHeight = 40 * scale;

    const windowWidth = slotSize * Inventory.SLOTS_PER_ROW + padding * 2;
    const numRows = Math.ceil(Inventory.TOTAL_SLOTS / Inventory.SLOTS_PER_ROW);
    const windowHeight = slotSize * numRows + padding * 2 + headerHeight + categoryHeight;

    const startX = (this.canvas.width - windowWidth) / 2;
    const startY = (this.canvas.height - windowHeight) / 2;

    // grey background
    this.ctx.fillStyle = "rgba(211, 211, 211, 0.95)";
    this.ctx.fillRect(startX, startY, windowWidth, windowHeight);

    // inventory header text
    drawText(this.ctx, "Inventory", startX + windowWidth / 2, startY + padding, `${fontSize}px Arial`, "black", "center");
    drawText(this.ctx, "D drop item, L Adventure Log", startX + windowWidth / 2, startY + padding + fontSize + 5, `${smallerFontSize}px Arial`, "gray", "center");

    // draw category tabs
    const tabWidth = windowWidth / Inventory.CATEGORIES.length;
    const categoryY = startY + padding + headerHeight;

    Inventory.CATEGORIES.forEach((category, index) => {
      const categoryX = startX + tabWidth * index;
      const isSelectedCategory = category === this.selectedCategory;
      const isNavigatingCategories = this.selectedSlot === -1;

      // Tab background
      this.ctx.fillStyle = isSelectedCategory
        ? isNavigatingCategories
          ? "rgba(255, 165, 0, 0.6)" // Brighter orange when actively navigating
          : "rgba(255, 165, 0, 0.3)" // Normal selected state
        : "white";
      this.ctx.fillRect(categoryX, categoryY, tabWidth, categoryHeight);

      // Tab border
      this.ctx.strokeStyle = isSelectedCategory
        ? isNavigatingCategories
          ? "rgb(255, 140, 0)" // Darker orange when actively navigating
          : "orange"
        : "gray";
      this.ctx.strokeRect(categoryX, categoryY, tabWidth, categoryHeight);

      // Category text
      this.ctx.font = `${Math.floor(12 * scale)}px Arial`;
      this.ctx.fillStyle = "black";
      this.ctx.textAlign = "center";
      let categoryEmoji = "";
      if (category === "Weapons") categoryEmoji = "⚔️";
      else if (category === "Bows and Arrows") categoryEmoji = "🏹";
      else if (category === "Shields") categoryEmoji = "🛡️";
      else if (category === "Armor") categoryEmoji = "🥋";
      else if (category === "Materials") categoryEmoji = "🪵";
      else if (category === "Food") categoryEmoji = "🍎";
      else if (category === "Key Items") categoryEmoji = "🔑";

      this.ctx.fillText(categoryEmoji, categoryX + tabWidth / 2, categoryY + categoryHeight / 2 + 5);
    });

    // inventory slots
    for (let i = 0; i < Inventory.TOTAL_SLOTS; i++) {
      const row = Math.floor(i / Inventory.SLOTS_PER_ROW);
      const col = i % Inventory.SLOTS_PER_ROW;
      const x = startX + padding + col * slotSize;
      const y = startY + padding + headerHeight + categoryHeight + row * slotSize;

      this.ctx.fillStyle = i === this.selectedSlot ? "rgba(255, 165, 0, 0.3)" : "white";
      this.ctx.fillRect(x, y, slotSize, slotSize);

      this.ctx.strokeStyle = i === this.selectedSlot ? "orange" : "gray";
      this.ctx.strokeRect(x, y, slotSize, slotSize);

      if (this.items[i]) {
        const item = this.items[i];
        const itemPadding = slotSize * 0.1;
        this.ctx.drawImage(item.imgPath, item.imgSourceX, item.imgSourceY, item.imgSourceWidth, item.imgSourceHeight, x + itemPadding, y + itemPadding, slotSize - itemPadding * 2, slotSize - itemPadding * 2);
      }
    }
  }
}
