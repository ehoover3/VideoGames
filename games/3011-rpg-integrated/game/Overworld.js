// game/Overworld.js
import HUD from "./HUD.js";

export default class Overworld {
  constructor(canvas, ctx, keys, gameState, gameObjects) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.keys = keys;
    this.gameState = gameState;
    this.gameObjects = gameObjects;
    this.hud = new HUD(canvas, ctx);
    this.isPlayerMoving = false;
  }

  load() {
    const update = this.gameObjects.player.update({
      keys: this.keys,
      gameState: this.gameState,
      gameObjects: this.gameObjects,
    });

    this.gameState.currentState = update.currentState;
    this.gameState.previousState = update.previousState;
    this.gameState.savedPlayerPosition = update.savedPlayerPosition;

    this.draw(update.interactionMessage);

    // Update movement state
    this.isPlayerMoving = Boolean(this.keys["ArrowUp"] || this.keys["ArrowDown"] || this.keys["ArrowLeft"] || this.keys["ArrowRight"]);

    let displayObject = null;
    let displayMessage = null;

    if (!this.isPlayerMoving) {
      if (update.showPickupNotification && update.lastPickedUpItem) {
        // Show pickup notification and item
        displayObject = update.lastPickedUpItem;
        displayMessage = update.interactionMessage;
      } else if (update.isInteracting && this.gameObjects.dog) {
        // Show dog during conversation
        displayObject = this.gameObjects.dog;
        displayMessage = update.interactionMessage;
      } else if (update.droppedItem) {
        // Show dropped item notification and item
        displayObject = update.droppedItem;
        displayMessage = update.interactionMessage;
      }
    }

    this.hud.draw(this.gameState.currentState, displayMessage, displayObject);
  }

  draw() {
    this.drawWorld();
    this.drawGameObjects();
    this.gameObjects.player.draw(this.canvas, this.ctx, this.gameState.currentFrame);
  }

  drawWorld() {
    this.ctx.fillStyle = "darkseagreen";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawGameObjects() {
    const { ball, dog, mri } = this.gameObjects;
    const scaleX = this.canvas.width / 640;
    const scaleY = this.canvas.height / 360;

    if (!ball.isPickedUp) {
      ball.draw(this.ctx, scaleX, scaleY);
    }
    dog.draw(this.ctx, scaleX, scaleY);
    mri.draw(this.ctx, scaleX, scaleY);
  }
}
