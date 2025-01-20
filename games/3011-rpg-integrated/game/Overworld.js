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

    this.draw();

    // Update movement state
    this.isPlayerMoving = Boolean(this.keys["ArrowUp"] || this.keys["ArrowDown"] || this.keys["ArrowLeft"] || this.keys["ArrowRight"]);

    let displayObject = null;
    let displayMessage = null;

    if (!this.isPlayerMoving) {
      if (update.isInteracting && this.gameObjects.dog) {
        displayObject = this.gameObjects.dog;
        displayMessage = update.interactionMessage;
      }
    }

    this.hud.draw(this.gameState.currentState, displayMessage, displayObject);
  }

  draw() {
    // Clear the canvas first
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw the world background
    this.drawWorld();

    // Draw all game objects
    this.drawGameObjects();

    // Draw the player
    this.gameObjects.player.draw(this.canvas, this.ctx);
  }

  drawWorld() {
    this.ctx.fillStyle = "darkseagreen";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawGameObjects() {
    const { ball, coin, dog, mri } = this.gameObjects;
    const scaleX = this.canvas.width / 640;
    const scaleY = this.canvas.height / 360;

    // Draw thrown ball if throwing animation is active
    if (this.gameObjects.player.throwState.isThrowing) {
      const { ballPosition } = this.gameObjects.player.throwState;

      this.ctx.save();
      this.ctx.translate(ballPosition.x * scaleX, ballPosition.y * scaleY);
      this.ctx.scale(scaleX, scaleY);
      ball.draw(this.ctx, 1, 1, true);
      this.ctx.restore();
    } else if (!ball.isPickedUp) {
      ball.draw(this.ctx, scaleX, scaleY);
    }

    if (!coin.isPickedUp) {
      coin.draw(this.ctx, scaleX, scaleY);
    }

    dog.draw(this.ctx, scaleX, scaleY);
    mri.draw(this.ctx, scaleX, scaleY);
  }
}
