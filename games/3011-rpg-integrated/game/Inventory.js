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
  static ITEM_CATEGORIES = ["Weapons", "Bows and Arrows", "Shields", "Armor", "Materials", "Food", "Key Items"];
  static NAVBAR_ITEMS = ["Adventure Log", "Inventory", "System"];
  static NAVBAR_LABELS = ["L", null, "R"];

  constructor(canvas, ctx, keys, gameState) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.keys = keys;
    this.gameState = gameState;
    this.items = [];
    this.selectedSlot = 0;
    this.selectedItemCategory = "Weapons";
    this.selectedNavbarItem = 1; // Start with Inventory selected

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
      this.handleNavbar("Adventure Log");
      this.keys["l"] = false;
      this.keys["L"] = false;
    }
    if (this.keys["r"] || this.keys["R"]) {
      this.handleNavbar("System");
      this.keys["r"] = false;
      this.keys["R"] = false;
    }
    this.handleInventorySelection();

    // handle drop item
    if ((this.keys["d"] || this.keys["D"]) && this.selectedSlot !== -1) {
      this.dropItem(this.selectedSlot);
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

  handleNavbar(selectedNavbarItem) {
    switch (selectedNavbarItem) {
      case "Adventure Log":
        this.gameState.currentState = STATES.ADVENTURE_LOG;
        break;
      case "System":
        this.gameState.currentState = STATES.SYSTEM;
        break;
    }
  }

  handleInventorySelection() {
    const rows = Math.ceil(Inventory.TOTAL_SLOTS / Inventory.SLOTS_PER_ROW);
    const currentRow = Math.floor(this.selectedSlot / Inventory.SLOTS_PER_ROW);
    const currentCol = this.selectedSlot % Inventory.SLOTS_PER_ROW;
    const isInItemCategoryNav = this.selectedSlot === -1;
    const currentItemCategoryIndex = Inventory.ITEM_CATEGORIES.indexOf(this.selectedItemCategory);
    if (this.keys.ArrowLeft && !this.keyStates.ArrowLeft) {
      if (isInItemCategoryNav) {
        const newIndex = Math.max(0, currentItemCategoryIndex - 1);
        this.selectedItemCategory = Inventory.ITEM_CATEGORIES[newIndex];
      } else {
        this.selectedSlot = Math.max(0, this.selectedSlot - 1);
      }
      this.keyStates.ArrowLeft = true;
    }
    if (this.keys.ArrowRight && !this.keyStates.ArrowRight) {
      if (isInItemCategoryNav) {
        const newIndex = Math.min(Inventory.ITEM_CATEGORIES.length - 1, currentItemCategoryIndex + 1);
        this.selectedItemCategory = Inventory.ITEM_CATEGORIES[newIndex];
      } else {
        this.selectedSlot = Math.min(Inventory.TOTAL_SLOTS - 1, this.selectedSlot + 1);
      }
      this.keyStates.ArrowRight = true;
    }
    if (this.keys.ArrowUp && !this.keyStates.ArrowUp) {
      if (!isInItemCategoryNav && currentRow === 0) {
        // Move from top row to itemCategory
        this.selectedSlot = -1;
      } else if (!isInItemCategoryNav) {
        // Navigate up within inventory
        this.selectedSlot -= Inventory.SLOTS_PER_ROW;
      }
      this.keyStates.ArrowUp = true;
    }
    if (this.keys.ArrowDown && !this.keyStates.ArrowDown) {
      if (isInItemCategoryNav) {
        // Move from itemCategory to first row of inventory
        this.selectedSlot = 0;
      } else if (currentRow < rows - 1 && this.selectedSlot + Inventory.SLOTS_PER_ROW < Inventory.TOTAL_SLOTS) {
        // Navigate down within inventory
        this.selectedSlot += Inventory.SLOTS_PER_ROW;
      }
      this.keyStates.ArrowDown = true;
    }
    // Reset key states
    if (!this.keys.ArrowLeft) this.keyStates.ArrowLeft = false;
    if (!this.keys.ArrowRight) this.keyStates.ArrowRight = false;
    if (!this.keys.ArrowUp) this.keyStates.ArrowUp = false;
    if (!this.keys.ArrowDown) this.keyStates.ArrowDown = false;
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
    if (slotIndex === -1) {
      return { success: false, message: "No slot selected." };
    }
    const filteredItems = this.items.filter((item) => item.itemCategory === this.selectedItemCategory);
    if (slotIndex >= 0 && slotIndex < filteredItems.length) {
      const item = filteredItems[slotIndex];
      const game = window.gameInstance;
      if (game && game.gameObjects.player) {
        const player = game.gameObjects.player;
        item.x = player.x + player.width;
        item.y = player.y;
        item.isPickedUp = false;
        this.items = this.items.filter((i) => i !== item); // Remove the item from the main inventory
        this.selectedSlot = -1; // Reset selected slot upon successful drop
      }
      return { success: true };
    }
    return { success: false, message: "No valid item to drop in the selected slot." };
  }

  draw() {
    const { scale, padding, fontSize, smallerFontSize } = this.calculateDrawScale();
    const sectionDimensions = this.calculateDrawSectionDimensions(padding, fontSize);

    const slotSize = Inventory.SLOT_SIZE * scale;
    const headerHeight = fontSize + smallerFontSize + 15;
    const itemCategoryHeight = 40 * scale;
    const filteredItems = this.items.filter((item) => item.itemCategory === this.selectedItemCategory);

    this.drawBackground();
    this.drawTopSection(scale);
    this.drawLeftSection(sectionDimensions.left, scale, filteredItems, padding, headerHeight, slotSize, itemCategoryHeight);
    this.drawRightSection(sectionDimensions.right, scale, filteredItems, padding, slotSize);
  }

  calculateDrawScale() {
    const scaleX = this.canvas.width / Inventory.BASE_RESOLUTION.width;
    const scaleY = this.canvas.height / Inventory.BASE_RESOLUTION.height;
    const scale = Math.min(scaleX, scaleY);
    return {
      scale,
      padding: Inventory.INVENTORY_PADDING * scale,
      fontSize: Math.floor(20 * scale),
      smallerFontSize: Math.floor(14 * scale),
    };
  }

  calculateDrawSectionDimensions(padding, fontSize) {
    // Calculate navbar dimensions
    const navbarPadding = padding;
    const navbarFontSize = fontSize;
    const navbarHeight = navbarPadding + navbarFontSize * 1.5; // Account for padding + text height

    const leftSection = {
      x: 0,
      y: navbarHeight, // Start right after navbar
      width: this.canvas.width * 0.5,
      height: this.canvas.height - navbarHeight, // Subtract navbar height from total height
    };

    const rightSection = {
      x: leftSection.width,
      y: navbarHeight, // Start right after navbar
      width: this.canvas.width * 0.5,
      height: this.canvas.height - navbarHeight, // Subtract navbar height from total height
    };

    return { left: leftSection, right: rightSection };
  }

  drawBackground() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawTopSection(scale) {
    const fontSize = Math.floor(20 * scale);
    const smallerFontSize = Math.floor(14 * scale);
    const padding = Inventory.INVENTORY_PADDING * scale;
    const menuWidth = this.canvas.width / Inventory.NAVBAR_ITEMS.length;

    Inventory.NAVBAR_ITEMS.forEach((item, index) => {
      const x = menuWidth * index + menuWidth / 2;
      const y = padding + fontSize;
      const isInventory = item === "Inventory";

      // Highlight selected menu item if in navbar
      if (this.isInNavbar && index === this.selectedNavbarItem) {
        this.ctx.fillStyle = "rgba(255, 165, 0, 0.3)";
        this.ctx.fillRect(menuWidth * index, padding, menuWidth, fontSize * 1.5);
      }

      // Draw the label (L or R) if it exists
      if (Inventory.NAVBAR_LABELS[index]) {
        drawText(this.ctx, Inventory.NAVBAR_LABELS[index], x, padding + fontSize * 0.5, `${smallerFontSize}px Arial`, "white", "center");
      }

      // Draw the menu item text with different sizes for Inventory vs other items
      const itemFontSize = isInventory ? fontSize : smallerFontSize;
      drawText(this.ctx, item, x, y + (isInventory ? 0 : fontSize * 0.2), `${itemFontSize}px Arial`, "white", "center");
    });
  }

  drawLeftSection(sectionDimension, scale, filteredItems, padding, headerHeight, slotSize, itemCategoryHeight) {
    let { x, y, width, height } = sectionDimension;

    // Draw main background
    this.ctx.fillStyle = "rgba(211, 211, 211, 0.95)";
    this.ctx.fillRect(x, y, width, height);

    // Draw itemCategory tabs
    const tabWidth = width / Inventory.ITEM_CATEGORIES.length;
    const itemCategoryY = y + padding;

    // Draw category background
    this.ctx.fillStyle = "rgba(255,252,228,255)";
    this.ctx.fillRect(x, itemCategoryY, width, itemCategoryHeight);

    Inventory.ITEM_CATEGORIES.forEach((itemCategory, index) => {
      const itemCategoryX = x + tabWidth * index;
      const isSelected = itemCategory === this.selectedItemCategory;

      this.ctx.font = `${Math.floor(12 * scale)}px Arial`;
      this.ctx.textAlign = "center";

      const itemCategoryEmojis = {
        Weapons: "⚔️",
        "Bows and Arrows": "🏹",
        Shields: "🛡️",
        Armor: "🥋",
        Materials: "🪵",
        Food: "🍎",
        "Key Items": "🔑",
      };

      // Apply darkening filter for non-selected categories
      if (!isSelected) {
        this.ctx.filter = "brightness(0.5) saturate(0)";
      }

      this.ctx.fillText(itemCategoryEmojis[itemCategory], itemCategoryX + tabWidth / 2, itemCategoryY + itemCategoryHeight / 2 + 5);

      // Reset filter
      this.ctx.filter = "none";
    });

    // Draw inventory slots
    const slotsStartY = itemCategoryY + itemCategoryHeight + padding;
    const totalGridWidth = Inventory.SLOTS_PER_ROW * slotSize;
    const slotsStartX = x + (width - totalGridWidth) / 2;

    for (let i = 0; i < Inventory.TOTAL_SLOTS; i++) {
      const row = Math.floor(i / Inventory.SLOTS_PER_ROW);
      const col = i % Inventory.SLOTS_PER_ROW;
      const slotX = slotsStartX + col * slotSize;
      const slotY = slotsStartY + row * slotSize;

      // Draw slot background
      this.ctx.fillStyle = i === this.selectedSlot ? "rgba(0,190,239,255)" : "rgba(0,5,3,255)";
      this.ctx.fillRect(slotX, slotY, slotSize, slotSize);

      // Draw slot border
      this.ctx.strokeStyle = i === this.selectedSlot ? "rgba(250,203,86,255)" : "rgba(41,50,47,255)";
      this.ctx.lineWidth = i === this.selectedSlot ? 3 : 1;
      this.ctx.strokeRect(slotX, slotY, slotSize, slotSize);

      const item = filteredItems[i];
      if (item) {
        const itemPadding = slotSize * 0.1;
        this.ctx.drawImage(item.imgPath, item.imgSourceX, item.imgSourceY, item.imgSourceWidth, item.imgSourceHeight, slotX + itemPadding, slotY + itemPadding, slotSize - itemPadding * 2, slotSize - itemPadding * 2);
      }
    }
  }

  drawRightSection(sectionDimension, scale, filteredItems, padding, slotSize) {
    const { x, y, width, height } = sectionDimension;

    this.ctx.fillStyle = "rgba(211, 211, 211, 0.95)";
    this.ctx.fillRect(x, y, width, height);

    this.drawRightSection_Player(x, y, width, padding, slotSize);

    const selectedItem = this.selectedSlot >= 0 && this.selectedSlot < filteredItems.length ? filteredItems[this.selectedSlot] : null;

    if (selectedItem) {
      this.drawRightSection_ItemName(x, y, width, scale, padding, slotSize, selectedItem);
      this.drawRightSection_ItemDescription(x, y, width, scale, padding, slotSize, selectedItem);
    }
  }

  drawRightSection_Player(x, y, width, padding, slotSize) {
    const game = window.gameInstance;
    if (game?.gameObjects?.player) {
      const player = game.gameObjects.player;
      const playerSize = slotSize * 3;
      const playerX = x + (width - playerSize) / 2;
      const playerY = y + padding;

      this.ctx.drawImage(
        player.imgPath,
        0, // Source X (first frame for idle)
        0, // Source Y (facing down)
        player.constructor.FRAME_SETTINGS.FRAME_WIDTH,
        player.constructor.FRAME_SETTINGS.FRAME_HEIGHT,
        playerX,
        playerY,
        playerSize,
        playerSize
      );
    }
  }

  drawRightSection_ItemName(x, y, width, scale, padding, slotSize, selectedItem) {
    const fontSize = Math.floor(20 * scale);
    const playerSpace = slotSize * 3 + padding * 2;
    const nameY = y + playerSpace + padding;
    this.ctx.textAlign = "left";
    drawText(this.ctx, selectedItem.name, x + padding, nameY, `${fontSize}px Arial`, "black", "left");
  }

  drawRightSection_ItemDescription(x, y, width, scale, padding, slotSize, selectedItem) {
    const fontSize = Math.floor(14 * scale);
    const playerSpace = slotSize * 3 + padding * 2;
    const descY = y + playerSpace + 2 * padding;
    this.ctx.textAlign = "left";
    drawText(this.ctx, selectedItem.description, x + padding, descY, `${fontSize}px Arial`, "black", "left");
  }
}
