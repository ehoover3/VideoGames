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

    // Setup sections
    const leftSectionWidth = this.canvas.width * 0.5;
    const leftStartX = padding;
    const leftStartY = padding + fontSize * 2;
    const leftSectionHeight = this.canvas.height - (padding * 2 + fontSize * 2);

    const rightSectionWidth = this.canvas.width * 0.5;
    const rightStartX = leftSectionWidth + padding;
    const rightStartY = padding + fontSize * 2;
    const rightSectionHeight = this.canvas.height - (padding * 2 + fontSize * 2);

    const filteredItems = this.items.filter((item) => item.itemCategory === this.selectedCategory);

    this.drawTopSection();
    this.drawLeftSection(leftStartX, leftStartY, leftSectionWidth, leftSectionHeight, scale, filteredItems, padding, headerHeight, slotSize, categoryHeight);
    this.drawRightSection(rightStartX, rightStartY, rightSectionWidth, rightSectionHeight, scale, filteredItems, padding, slotSize);
  }

  drawTopSection() {
    const scaleX = this.canvas.width / Inventory.BASE_RESOLUTION.width;
    const scaleY = this.canvas.height / Inventory.BASE_RESOLUTION.height;
    const scale = Math.min(scaleX, scaleY);

    const padding = Inventory.INVENTORY_PADDING * scale;
    const fontSize = Math.floor(20 * scale);
    const smallerFontSize = Math.floor(14 * scale);

    const menuWidth = this.canvas.width / Inventory.TOP_MENU_ITEMS.length;

    Inventory.TOP_MENU_ITEMS.forEach((item, index) => {
      const x = menuWidth * index + menuWidth / 2;
      const y = padding + fontSize;
      const isInventory = item === "Inventory";

      if (this.isInTopMenu && index === this.selectedTopMenuItem) {
        this.ctx.fillStyle = "rgba(255, 165, 0, 0.3)";
        this.ctx.fillRect(menuWidth * index, padding, menuWidth, fontSize * 1.5);
      }

      if (Inventory.TOP_MENU_LABELS[index]) {
        drawText(this.ctx, Inventory.TOP_MENU_LABELS[index], x, padding + fontSize * 0.5, `${smallerFontSize}px Arial`, "white", "center");
      }

      const itemFontSize = isInventory ? fontSize : smallerFontSize;
      drawText(this.ctx, item, x, y + (isInventory ? 0 : fontSize * 0.2), `${itemFontSize}px Arial`, "white", "center");
    });
  }

  drawLeftSection(startX, startY, sectionWidth, sectionHeight, scale, filteredItems, padding, headerHeight, slotSize, categoryHeight) {
    // Draw main background
    this.ctx.fillStyle = "rgba(211, 211, 211, 0.95)";
    this.ctx.fillRect(startX, startY, sectionWidth, sectionHeight);

    // Draw category tabs
    const tabWidth = sectionWidth / Inventory.CATEGORIES.length;
    const categoryY = startY + padding + headerHeight;

    Inventory.CATEGORIES.forEach((category, index) => {
      const categoryX = startX + tabWidth * index;
      const isSelectedCategory = category === this.selectedCategory;
      const isNavigatingCategories = this.selectedSlot === -1;

      this.ctx.fillStyle = isSelectedCategory ? (isNavigatingCategories ? "rgba(255, 165, 0, 0.6)" : "rgba(255, 165, 0, 0.3)") : "white";
      this.ctx.fillRect(categoryX, categoryY, tabWidth, categoryHeight);

      this.ctx.strokeStyle = isSelectedCategory ? (isNavigatingCategories ? "rgb(255, 140, 0)" : "orange") : "gray";
      this.ctx.strokeRect(categoryX, categoryY, tabWidth, categoryHeight);

      this.ctx.font = `${Math.floor(12 * scale)}px Arial`;
      this.ctx.fillStyle = "black";
      this.ctx.textAlign = "center";

      const categoryEmojis = {
        Weapons: "⚔️",
        "Bows and Arrows": "🏹",
        Shields: "🛡️",
        Armor: "🥋",
        Materials: "🪵",
        Food: "🍎",
        "Key Items": "🔑",
      };

      this.ctx.fillText(categoryEmojis[category], categoryX + tabWidth / 2, categoryY + categoryHeight / 2 + 5);
    });

    // Draw inventory slots
    const slotsStartY = categoryY + categoryHeight + padding;
    const totalGridWidth = Inventory.SLOTS_PER_ROW * slotSize;
    const slotsStartX = startX + (sectionWidth - totalGridWidth) / 2;

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
  }

  drawRightSection(rightStartX, rightStartY, rightSectionWidth, rightSectionHeight, scale, filteredItems, padding, slotSize) {
    // Draw main background
    this.ctx.fillStyle = "rgba(211, 211, 211, 0.95)";
    this.ctx.fillRect(rightStartX, rightStartY, rightSectionWidth, rightSectionHeight);

    // Get selected item if any
    const selectedItem = this.selectedSlot >= 0 && this.selectedSlot < filteredItems.length ? filteredItems[this.selectedSlot] : null;

    if (selectedItem) {
      const fontSize = Math.floor(20 * scale);
      const smallerFontSize = Math.floor(14 * scale);

      // Calculate positions for item display
      const imageSize = slotSize * 2;
      const imageX = rightStartX + (rightSectionWidth - imageSize) / 2;
      const imageY = rightStartY + padding * 2;

      // Draw large item image
      this.ctx.fillStyle = "white";
      this.ctx.fillRect(imageX, imageY, imageSize, imageSize);
      this.ctx.strokeStyle = "gray";
      this.ctx.strokeRect(imageX, imageY, imageSize, imageSize);

      // Draw item sprite scaled up
      const itemPadding = imageSize * 0.1;
      this.ctx.drawImage(selectedItem.imgPath, selectedItem.imgSourceX, selectedItem.imgSourceY, selectedItem.imgSourceWidth, selectedItem.imgSourceHeight, imageX + itemPadding, imageY + itemPadding, imageSize - itemPadding * 2, imageSize - itemPadding * 2);

      // Draw item name
      const nameY = imageY + imageSize + padding * 2;
      drawText(this.ctx, selectedItem.name, rightStartX + rightSectionWidth / 2, nameY, `${fontSize}px Arial`, "black", "center");

      // Draw item description
      const descriptionY = nameY + fontSize + padding;
      const descriptionWidth = rightSectionWidth - padding * 2;
      const description = selectedItem.description || "No description available.";

      this.ctx.font = `${smallerFontSize}px Arial`;
      const words = description.split(" ");
      let line = "";
      let y = descriptionY;

      // Word wrap the description
      words.forEach((word) => {
        const testLine = line + word + " ";
        const metrics = this.ctx.measureText(testLine);
        if (metrics.width > descriptionWidth) {
          drawText(this.ctx, line, rightStartX + padding, y, `${smallerFontSize}px Arial`, "black", "left");
          line = word + " ";
          y += smallerFontSize * 1.2;
        } else {
          line = testLine;
        }
      });
      drawText(this.ctx, line, rightStartX + padding, y, `${smallerFontSize}px Arial`, "black", "left");

      // Draw controls hint at the bottom
      const controlsY = rightStartY + rightSectionHeight - padding * 2;
      drawText(this.ctx, "Press 'D' to drop item", rightStartX + rightSectionWidth / 2, controlsY, `${smallerFontSize}px Arial`, "black", "center");
    } else {
      // Draw "No item selected" message when no item is selected
      const fontSize = Math.floor(16 * scale);
      drawText(this.ctx, "No item selected", rightStartX + rightSectionWidth / 2, rightStartY + rightSectionHeight / 2, `${fontSize}px Arial`, "gray", "center");
    }
  }
}
