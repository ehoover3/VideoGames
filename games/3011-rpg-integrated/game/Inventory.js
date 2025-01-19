// game/Inventory.js

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
  static TOP_MENU_ITEMS = ["Adventure Log", "Inventory", "System"];
  static TOP_MENU_LABELS = ["L", null, "R"];

  constructor(canvas, ctx, keys, gameState) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.keys = keys;
    this.gameState = gameState;
    this.items = [];
    this.selectedSlot = 0;
    this.selectedCategory = "Weapons";
    this.isInTopMenu = false;
    this.selectedTopMenuItem = 1; // Start with Inventory selected

    // Add key state tracking to prevent continuous movement while holding keys
    this.keyStates = {
      ArrowLeft: false,
      ArrowRight: false,
      ArrowUp: false,
      ArrowDown: false,
      Enter: false,
    };
  }

  load() {
    this.update();
    this.draw();
    const game = window.gameInstance;
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
    const filteredItems = this.items.filter((item) => item.itemCategory === this.selectedCategory);
    if (slotIndex >= 0 && slotIndex < filteredItems.length) {
      const item = filteredItems[slotIndex];
      const game = window.gameInstance;
      if (game && game.gameObjects.player) {
        const player = game.gameObjects.player;
        item.x = player.x + player.width;
        item.y = player.y;
        item.isPickedUp = false;
        this.items = this.items.filter((i) => i !== item); // Remove the item from the main inventory
      }
      return { success: true };
    }
    return { success: false, message: "No valid item to drop in the selected slot." };
  }

  handleArrowNavigation() {
    // Handle top menu navigation
    if (this.isInTopMenu) {
      if (this.keys.ArrowLeft && !this.keyStates.ArrowLeft) {
        this.selectedTopMenuItem = Math.max(0, this.selectedTopMenuItem - 1);
        this.keyStates.ArrowLeft = true;
      }
      if (this.keys.ArrowRight && !this.keyStates.ArrowRight) {
        this.selectedTopMenuItem = Math.min(Inventory.TOP_MENU_ITEMS.length - 1, this.selectedTopMenuItem + 1);
        this.keyStates.ArrowRight = true;
      }
      if (this.keys.ArrowDown && !this.keyStates.ArrowDown) {
        this.isInTopMenu = false;
        this.selectedSlot = -1; // Move to category selection
        this.keyStates.ArrowDown = true;
      }
      // Handle Enter key for menu selection
      if (this.keys.Enter && !this.keyStates.Enter) {
        this.handleMenuSelection(Inventory.TOP_MENU_ITEMS[this.selectedTopMenuItem]);
        this.keyStates.Enter = true;
      }
      return;
    }

    // Existing inventory navigation logic
    const rows = Math.ceil(Inventory.TOTAL_SLOTS / Inventory.SLOTS_PER_ROW);
    const currentRow = Math.floor(this.selectedSlot / Inventory.SLOTS_PER_ROW);
    const currentCol = this.selectedSlot % Inventory.SLOTS_PER_ROW;
    const isInCategoryNav = this.selectedSlot === -1;
    const currentCategoryIndex = Inventory.CATEGORIES.indexOf(this.selectedCategory);

    if (this.keys.ArrowLeft && !this.keyStates.ArrowLeft) {
      if (isInCategoryNav) {
        const newIndex = Math.max(0, currentCategoryIndex - 1);
        this.selectedCategory = Inventory.CATEGORIES[newIndex];
      } else {
        this.selectedSlot = Math.max(0, this.selectedSlot - 1);
      }
      this.keyStates.ArrowLeft = true;
    }

    if (this.keys.ArrowRight && !this.keyStates.ArrowRight) {
      if (isInCategoryNav) {
        const newIndex = Math.min(Inventory.CATEGORIES.length - 1, currentCategoryIndex + 1);
        this.selectedCategory = Inventory.CATEGORIES[newIndex];
      } else {
        this.selectedSlot = Math.min(Inventory.TOTAL_SLOTS - 1, this.selectedSlot + 1);
      }
      this.keyStates.ArrowRight = true;
    }

    if (this.keys.ArrowUp && !this.keyStates.ArrowUp) {
      if (isInCategoryNav) {
        // Move from category nav to top menu
        this.isInTopMenu = true;
        this.selectedSlot = 0;
      } else if (currentRow === 0) {
        // Move from top row to category navigation
        this.selectedSlot = -1;
      } else {
        // Navigate up within inventory
        this.selectedSlot -= Inventory.SLOTS_PER_ROW;
      }
      this.keyStates.ArrowUp = true;
    }

    if (this.keys.ArrowDown && !this.keyStates.ArrowDown) {
      if (isInCategoryNav) {
        // Move from category navigation to first row of inventory
        this.selectedSlot = 0;
      } else if (currentRow < rows - 1 && this.selectedSlot + Inventory.SLOTS_PER_ROW < Inventory.TOTAL_SLOTS) {
        // Navigate down within inventory
        this.selectedSlot += Inventory.SLOTS_PER_ROW;
      }
      this.keyStates.ArrowDown = true;
    }
  }

  handleMenuSelection(selectedMenu) {
    switch (selectedMenu) {
      case "Adventure Log":
        this.gameState.currentState = STATES.ADVENTURE_LOG;
        break;
      case "System":
        this.gameState.currentState = STATES.SYSTEM;
        break;
    }
  }

  update() {
    if (this.keys["x"] || this.keys["X"]) {
      this.gameState.previousState = this.gameState.currentState;
      this.gameState.currentState = STATES.OVERWORLD;
      this.keys["x"] = false;
      this.keys["X"] = false;
    }

    // Handle L and R key shortcuts
    if (this.keys["l"] || this.keys["L"]) {
      this.handleMenuSelection("Adventure Log");
      this.keys["l"] = false;
      this.keys["L"] = false;
    }
    if (this.keys["r"] || this.keys["R"]) {
      this.handleMenuSelection("System");
      this.keys["r"] = false;
      this.keys["R"] = false;
    }

    this.handleArrowNavigation();

    if ((this.keys["d"] || this.keys["D"]) && this.selectedSlot !== -1) {
      const filteredItems = this.items.filter((item) => item.itemCategory === this.selectedCategory);
      if (this.selectedSlot < filteredItems.length) {
        const result = this.dropItem(this.selectedSlot);
        if (result.success) {
          this.selectedSlot = -1;
        }
      }
      this.keys["d"] = false;
      this.keys["D"] = false;
    }

    // Reset key states
    if (!this.keys.ArrowLeft) this.keyStates.ArrowLeft = false;
    if (!this.keys.ArrowRight) this.keyStates.ArrowRight = false;
    if (!this.keys.ArrowUp) this.keyStates.ArrowUp = false;
    if (!this.keys.ArrowDown) this.keyStates.ArrowDown = false;
    if (!this.keys.Enter) this.keyStates.Enter = false;
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

    // Background
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const padding = Inventory.INVENTORY_PADDING * scale;
    const slotSize = Inventory.SLOT_SIZE * scale;
    const fontSize = Math.floor(20 * scale);
    const smallerFontSize = Math.floor(14 * scale);
    const headerHeight = fontSize + smallerFontSize + 15;
    const categoryHeight = 40 * scale;

    // Draw top menu items
    const menuWidth = this.canvas.width / Inventory.TOP_MENU_ITEMS.length;
    Inventory.TOP_MENU_ITEMS.forEach((item, index) => {
      const x = menuWidth * index + menuWidth / 2;
      const y = padding + fontSize;
      const isInventory = item === "Inventory";

      // Highlight selected menu item
      if (this.isInTopMenu && index === this.selectedTopMenuItem) {
        this.ctx.fillStyle = "rgba(255, 165, 0, 0.3)";
        this.ctx.fillRect(menuWidth * index, padding, menuWidth, fontSize * 1.5);
      }

      // Draw shortcut key label if it exists
      if (Inventory.TOP_MENU_LABELS[index]) {
        drawText(this.ctx, Inventory.TOP_MENU_LABELS[index], x, padding + fontSize * 0.5, `${smallerFontSize}px Arial`, "white", "center");
      }

      // Draw menu item text with different sizes for Inventory vs other items
      const itemFontSize = isInventory ? fontSize : smallerFontSize;
      drawText(this.ctx, item, x, y + (isInventory ? 0 : fontSize * 0.2), `${itemFontSize}px Arial`, "white", "center");
    });

    // Rest of the draw method remains unchanged
    const leftSectionWidth = this.canvas.width * 0.5;
    const leftStartX = padding;
    const leftStartY = padding + fontSize * 2;
    const leftSectionHeight = this.canvas.height - (padding * 2 + fontSize * 2);

    const rightSectionWidth = this.canvas.width * 0.5;
    const rightStartX = leftSectionWidth + padding;
    const rightStartY = padding + fontSize * 2;
    const rightSectionHeight = this.canvas.height - (padding * 2 + fontSize * 2);

    const filteredItems = this.items.filter((item) => item.itemCategory === this.selectedCategory);
    const selectedItem = filteredItems[this.selectedSlot];

    // DRAW LEFT SECTION
    this.ctx.fillStyle = "rgba(211, 211, 211, 0.95)";
    this.ctx.fillRect(leftStartX, leftStartY, leftSectionWidth, leftSectionHeight);

    // Category tabs
    const tabWidth = leftSectionWidth / Inventory.CATEGORIES.length;
    const categoryY = leftStartY + padding + headerHeight;

    Inventory.CATEGORIES.forEach((category, index) => {
      const categoryX = leftStartX + tabWidth * index;
      const isSelectedCategory = category === this.selectedCategory;
      const isNavigatingCategories = this.selectedSlot === -1;

      this.ctx.fillStyle = isSelectedCategory ? (isNavigatingCategories ? "rgba(255, 165, 0, 0.6)" : "rgba(255, 165, 0, 0.3)") : "white";
      this.ctx.fillRect(categoryX, categoryY, tabWidth, categoryHeight);

      this.ctx.strokeStyle = isSelectedCategory ? (isNavigatingCategories ? "rgb(255, 140, 0)" : "orange") : "gray";
      this.ctx.strokeRect(categoryX, categoryY, tabWidth, categoryHeight);

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

    // Inventory slots
    const slotsStartY = categoryY + categoryHeight + padding;
    const totalGridWidth = Inventory.SLOTS_PER_ROW * slotSize;
    const slotsStartX = leftStartX + (leftSectionWidth - totalGridWidth) / 2; // Centering the grid

    for (let i = 0; i < Inventory.TOTAL_SLOTS; i++) {
      const row = Math.floor(i / Inventory.SLOTS_PER_ROW);
      const col = i % Inventory.SLOTS_PER_ROW;
      const x = slotsStartX + col * slotSize;
      const y = slotsStartY + row * slotSize;

      this.ctx.fillStyle = i === this.selectedSlot ? "rgba(255, 165, 0, 0.3)" : "white";
      this.ctx.fillRect(x, y, slotSize, slotSize);

      this.ctx.strokeStyle = i === this.selectedSlot ? "orange" : "gray";
      this.ctx.strokeRect(x, y, slotSize, slotSize);

      const item = filteredItems[i];
      if (item) {
        const itemPadding = slotSize * 0.1;
        this.ctx.drawImage(item.imgPath, item.imgSourceX, item.imgSourceY, item.imgSourceWidth, item.imgSourceHeight, x + itemPadding, y + itemPadding, slotSize - itemPadding * 2, slotSize - itemPadding * 2);
      }
    }

    // DRAW RIGHT SECTION
    // Right Section Background
    this.ctx.fillStyle = "rgba(211, 211, 211, 0.95)";
    this.ctx.fillRect(rightStartX, rightStartY, rightSectionWidth, rightSectionHeight);

    if (selectedItem) {
      // Determine the maximum Y position above the inventory grid
      const descriptionAreaHeight = fontSize + smallerFontSize + 10; // Space needed for name and description
      const gridTopY = slotsStartY; // Top Y position of the inventory grid
      const textStartY = gridTopY - descriptionAreaHeight - padding; // Place text above grid

      // Draw item name
      drawText(
        this.ctx,
        selectedItem.name,
        rightStartX + rightSectionWidth / 2,
        textStartY, // Position for item name
        `${fontSize}px Arial`,
        "black",
        "center"
      );

      // Draw item description
      drawText(this.ctx, selectedItem.description || "No description available.", rightStartX + padding, textStartY + fontSize + 5, `${smallerFontSize}px Arial`, "black", "left");
    }
  }
}
