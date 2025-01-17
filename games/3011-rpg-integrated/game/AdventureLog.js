import { STATES } from "../config/constants.js";
import { drawText } from "./utils/drawText.js";

export default class AdventureLog {
  static BASE_RESOLUTION = { width: 640, height: 360 };

  constructor(canvas, ctx, keys, gameState) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.keys = keys;
    this.gameState = gameState;
    this.quests = [];
  }

  load() {
    this.update();
    this.draw();
    const game = window.gameInstance;
    if (game) {
      game.hud.draw(this.gameState.currentState);
    }
  }

  update() {
    // Handle navigation keys
    if (this.keys["x"] || this.keys["X"]) {
      this.gameState.currentState = STATES.OVERWORLD;
      this.keys["x"] = false;
      this.keys["X"] = false;
    }

    if (this.keys["i"] || this.keys["I"]) {
      this.gameState.currentState = STATES.INVENTORY;
      this.keys["i"] = false;
      this.keys["I"] = false;
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
    const headerHeight = fontSize + smallerFontSize + 15;

    const windowWidth = this.canvas.width * 0.8;
    const windowHeight = this.canvas.height * 0.8;
    const startX = (this.canvas.width - windowWidth) / 2;
    const startY = (this.canvas.height - windowHeight) / 2;

    // Draw grey background
    this.ctx.fillStyle = "rgba(211, 211, 211, 0.95)";
    this.ctx.fillRect(startX, startY, windowWidth, windowHeight);

    // Draw header
    drawText(this.ctx, "Adventure Log", startX + windowWidth / 2, startY + padding, `${fontSize}px Arial`, "black", "center");

    // Draw navigation instructions
    drawText(this.ctx, "I for Inventory, X returns to game", startX + windowWidth / 2, startY + padding + fontSize + 5, `${smallerFontSize}px Arial`, "gray", "center");

    // Draw quest sections
    const questStartY = startY + headerHeight + padding;
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

  addQuest(quest) {
    this.quests.push(quest);
  }

  completeQuest(questId) {
    const quest = this.quests.find((q) => q.id === questId);
    if (quest) {
      quest.completed = true;
    }
  }
}
