// game/System.js

import { STATES } from "../config/constants.js";
import { drawText } from "./utils/drawText.js";

export default class System {
  static BASE_RESOLUTION = { width: 640, height: 360 };
  static TOP_MENU_ITEMS = ["Inventory", "System", ""];
  static TOP_MENU_LABELS = ["L", null, ""];
  static MENU_OPTIONS = ["Save", "Load", "Options", "Special Controls", "To Title Screen"];

  constructor(canvas, ctx, keys, gameState) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.keys = keys;
    this.gameState = gameState;
    this.selectedMenuItem = 1; // Start with System selected
    this.selectedOption = 0;
    this.isInTopMenu = false;

    // Add key state tracking to prevent continuous movement
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
      this.gameState.currentState = STATES.OVERWORLD;
      this.keys["x"] = false;
      this.keys["X"] = false;
    }

    // Handle L key shortcut for Inventory
    if (this.keys["l"] || this.keys["L"]) {
      this.handleMenuSelection("Inventory");
      this.keys["l"] = false;
      this.keys["L"] = false;
    }

    this.handleArrowNavigation();
  }

  handleMenuSelection(selectedMenu) {
    switch (selectedMenu) {
      case "Inventory":
        this.gameState.currentState = STATES.INVENTORY;
        break;
    }
  }

  handleArrowNavigation() {
    if (this.isInTopMenu) {
      if (this.keys.ArrowLeft && !this.keyStates.ArrowLeft) {
        this.selectedMenuItem = Math.max(0, this.selectedMenuItem - 1);
        this.keyStates.ArrowLeft = true;
      }
      if (this.keys.ArrowRight && !this.keyStates.ArrowRight) {
        this.selectedMenuItem = Math.min(System.TOP_MENU_ITEMS.length - 1, this.selectedMenuItem + 1);
        this.keyStates.ArrowRight = true;
      }
      if (this.keys.ArrowDown && !this.keyStates.ArrowDown) {
        this.isInTopMenu = false;
        this.keyStates.ArrowDown = true;
      }
      if (this.keys.Enter && !this.keyStates.Enter) {
        this.handleMenuSelection(System.TOP_MENU_ITEMS[this.selectedMenuItem]);
        this.keyStates.Enter = true;
      }
    } else {
      if (this.keys.ArrowUp && !this.keyStates.ArrowUp) {
        if (this.selectedOption === 0) {
          this.isInTopMenu = true;
        } else {
          this.selectedOption = Math.max(0, this.selectedOption - 1);
        }
        this.keyStates.ArrowUp = true;
      }
      if (this.keys.ArrowDown && !this.keyStates.ArrowDown) {
        this.selectedOption = Math.min(System.MENU_OPTIONS.length - 1, this.selectedOption + 1);
        this.keyStates.ArrowDown = true;
      }
      if (this.keys.Enter && !this.keyStates.Enter) {
        this.handleMenuOptionSelection();
        this.keyStates.Enter = true;
      }
    }

    // Reset key states
    if (!this.keys.ArrowLeft) this.keyStates.ArrowLeft = false;
    if (!this.keys.ArrowRight) this.keyStates.ArrowRight = false;
    if (!this.keys.ArrowUp) this.keyStates.ArrowUp = false;
    if (!this.keys.ArrowDown) this.keyStates.ArrowDown = false;
    if (!this.keys.Enter) this.keyStates.Enter = false;
  }

  handleMenuOptionSelection() {
    switch (System.MENU_OPTIONS[this.selectedOption]) {
      case "Save":
        console.log("Save game");
        break;
      case "Load":
        console.log("Load game");
        break;
      case "Options":
        console.log("Open options");
        break;
      case "Special Controls":
        console.log("Show controls");
        break;
      case "To Title Screen":
        this.gameState.currentState = STATES.MAIN_MENU;
        break;
    }
  }

  draw() {
    const scaleX = this.canvas.width / System.BASE_RESOLUTION.width;
    const scaleY = this.canvas.height / System.BASE_RESOLUTION.height;
    const scale = Math.min(scaleX, scaleY);

    // Draw semi-transparent black background
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const padding = 20 * scale;
    const fontSize = Math.floor(20 * scale);
    const smallerFontSize = Math.floor(14 * scale);

    // Draw top menu items
    const menuWidth = this.canvas.width / System.TOP_MENU_ITEMS.length;
    System.TOP_MENU_ITEMS.forEach((item, index) => {
      if (!item) return; // Skip empty items

      const x = menuWidth * index + menuWidth / 2;
      const y = padding + fontSize;
      const isSystem = item === "System";

      // Highlight selected menu item
      if (this.isInTopMenu && index === this.selectedMenuItem) {
        this.ctx.fillStyle = "rgba(255, 165, 0, 0.3)";
        this.ctx.fillRect(menuWidth * index, padding, menuWidth, fontSize * 1.5);
      }

      // Draw shortcut key label if it exists
      if (System.TOP_MENU_LABELS[index]) {
        drawText(this.ctx, System.TOP_MENU_LABELS[index], x, padding + fontSize * 0.5, `${smallerFontSize}px Arial`, "white", "center");
      }

      // Draw menu item text with different sizes for System vs other items
      const itemFontSize = isSystem ? fontSize : smallerFontSize;
      drawText(this.ctx, item, x, y + (isSystem ? 0 : fontSize * 0.2), `${itemFontSize}px Arial`, "white", "center");
    });

    // Draw main content
    const headerHeight = fontSize + smallerFontSize + 15;
    const windowWidth = this.canvas.width * 0.4; // Make the menu narrower
    const startX = (this.canvas.width - windowWidth) / 2;
    const startY = padding + fontSize * 2;

    // Draw grey background
    this.ctx.fillStyle = "rgba(211, 211, 211, 0.95)";
    this.ctx.fillRect(startX, startY, windowWidth, this.canvas.height - startY - padding);

    // Draw menu options
    const optionStartY = startY + headerHeight;
    const optionPadding = 20 * scale;

    System.MENU_OPTIONS.forEach((option, index) => {
      const y = optionStartY + index * (fontSize + optionPadding);

      // Highlight selected option
      if (!this.isInTopMenu && index === this.selectedOption) {
        this.ctx.fillStyle = "rgba(255, 165, 0, 0.3)";
        this.ctx.fillRect(startX, y - fontSize / 2, windowWidth, fontSize + 10);
      }

      drawText(this.ctx, option, startX + windowWidth / 2, y, `${fontSize}px Arial`, "black", "center");
    });
  }
}
