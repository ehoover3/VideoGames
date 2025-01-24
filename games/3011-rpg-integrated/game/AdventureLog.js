// game/AdventureLog.js

import { STATES } from "../config/constants.js";
import { drawText } from "./utils/drawText.js";

export default class AdventureLog {
  static BASE_RESOLUTION = { width: 640, height: 360 };
  static TOP_MENU_ITEMS = ["", "Adventure Log", "Inventory"];
  static TOP_MENU_LABELS = ["", null, "E"];

  constructor(canvas, ctx, keys, gameState) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.keys = keys;
    this.gameState = gameState;
    this.quests = [];
    this.isInTopMenu = false;
    this.selectedTopMenuItem = 1; // Start with Adventure Log selected

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
    // Handle navigation keys
    if (this.keys["x"] || this.keys["X"]) {
      this.gameState.currentState = STATES.OVERWORLD;
      this.keys["x"] = false;
      this.keys["X"] = false;
    }

    // Handle E key shortcut for Inventory
    if (this.keys["e"] || this.keys["E"]) {
      this.handleMenuSelection("Inventory");
      this.keys["e"] = false;
      this.keys["E"] = false;
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
    // Handle top menu navigation
    if (this.isInTopMenu) {
      if (this.keys.ArrowLeft && !this.keyStates.ArrowLeft) {
        this.selectedTopMenuItem = Math.max(0, this.selectedTopMenuItem - 1);
        this.keyStates.ArrowLeft = true;
      }
      if (this.keys.ArrowRight && !this.keyStates.ArrowRight) {
        this.selectedTopMenuItem = Math.min(AdventureLog.TOP_MENU_ITEMS.length - 1, this.selectedTopMenuItem + 1);
        this.keyStates.ArrowRight = true;
      }
      if (this.keys.ArrowDown && !this.keyStates.ArrowDown) {
        this.isInTopMenu = false;
        this.keyStates.ArrowDown = true;
      }
      // Handle Enter key for menu selection
      if (this.keys.Enter && !this.keyStates.Enter) {
        this.handleMenuSelection(AdventureLog.TOP_MENU_ITEMS[this.selectedTopMenuItem]);
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

  addQuest(quest) {
    this.quests.push(quest);
  }

  completeQuest(questId) {
    const quest = this.quests.find((q) => q.id === questId);
    if (quest) {
      quest.completed = true;
    }
  }

  draw() {
    const scaleX = this.canvas.width / AdventureLog.BASE_RESOLUTION.width;
    const scaleY = this.canvas.height / AdventureLog.BASE_RESOLUTION.height;
    const scale = Math.min(scaleX, scaleY);

    // Draw semi-transparent black background
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const padding = 20 * scale;
    const fontSize = Math.floor(20 * scale);
    const smallerFontSize = Math.floor(14 * scale);

    // Draw top menu items
    const menuWidth = this.canvas.width / AdventureLog.TOP_MENU_ITEMS.length;
    AdventureLog.TOP_MENU_ITEMS.forEach((item, index) => {
      const x = menuWidth * index + menuWidth / 2;
      const y = padding + fontSize;
      const isAdventureLog = item === "Adventure Log";

      // Highlight selected menu item
      if (this.isInTopMenu && index === this.selectedTopMenuItem) {
        this.ctx.fillStyle = "rgba(255, 165, 0, 0.3)";
        this.ctx.fillRect(menuWidth * index, padding, menuWidth, fontSize * 1.5);
      }

      // Draw shortcut key label if it exists
      if (AdventureLog.TOP_MENU_LABELS[index]) {
        drawText(this.ctx, AdventureLog.TOP_MENU_LABELS[index], x, padding + fontSize * 0.5, `${smallerFontSize}px Arial`, "white", "center");
      }

      // Draw menu item text with different sizes for Adventure Log vs other items
      if (item) {
        const itemFontSize = isAdventureLog ? fontSize : smallerFontSize;
        drawText(this.ctx, item, x, y + (isAdventureLog ? 0 : fontSize * 0.2), `${itemFontSize}px Arial`, "white", "center");
      }
    });

    // Draw main content
    const headerHeight = fontSize + smallerFontSize + 15;
    const windowWidth = this.canvas.width * 0.8;
    const windowHeight = this.canvas.height * 0.8;
    const startX = (this.canvas.width - windowWidth) / 2;
    const startY = padding + fontSize * 2;

    // Draw grey background
    this.ctx.fillStyle = "rgba(211, 211, 211, 0.95)";
    this.ctx.fillRect(startX, startY, windowWidth, this.canvas.height - startY - padding);

    // Draw quest sections
    const questStartY = startY + headerHeight;
    let currentY = questStartY;

    // Active Quests Section
    drawText(this.ctx, "Active Quests:", startX + padding, currentY, `${fontSize}px Arial`, "black", "left");

    currentY += fontSize + 10;

    const activeQuests = this.quests.filter((quest) => !quest.completed);
    if (activeQuests.length === 0) {
      drawText(this.ctx, "No active quests", startX + padding * 2, currentY, `${smallerFontSize}px Arial`, "gray", "left");
    } else {
      activeQuests.forEach((quest) => {
        drawText(this.ctx, `• ${quest.title}`, startX + padding * 2, currentY, `${smallerFontSize}px Arial`, "black", "left");
        currentY += smallerFontSize + 5;
        drawText(this.ctx, quest.description, startX + padding * 3, currentY, `${smallerFontSize - 2}px Arial`, "gray", "left");
        currentY += smallerFontSize + 15;
      });
    }

    // Completed Quests Section
    currentY += fontSize;
    drawText(this.ctx, "Completed Quests:", startX + padding, currentY, `${fontSize}px Arial`, "black", "left");

    currentY += fontSize + 10;

    const completedQuests = this.quests.filter((quest) => quest.completed);
    if (completedQuests.length === 0) {
      drawText(this.ctx, "No completed quests", startX + padding * 2, currentY, `${smallerFontSize}px Arial`, "gray", "left");
    } else {
      completedQuests.forEach((quest) => {
        drawText(this.ctx, `✓ ${quest.title}`, startX + padding * 2, currentY, `${smallerFontSize}px Arial`, "darkgreen", "left");
        currentY += smallerFontSize + 15;
      });
    }
  }
}
