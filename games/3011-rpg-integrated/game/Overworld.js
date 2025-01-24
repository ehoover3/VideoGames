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
    const { ball, coin, dog, mri, tree } = this.gameObjects;
    const scaleX = this.canvas.width / 640;
    const scaleY = this.canvas.height / 360;

    Object.assign(ball, { x: 76, y: 130 });
    Object.assign(coin, { x: 130, y: 70 });
    Object.assign(dog, { x: 150, y: 150 });
    Object.assign(mri, { x: 170, y: 50 });
    Object.assign(tree, { x: 50, y: 10 });

    if (!ball.isPickedUp) ball.draw(this.ctx, scaleX, scaleY);
    if (!coin.isPickedUp) coin.draw(this.ctx, scaleX, scaleY);

    dog.draw(this.ctx, scaleX, scaleY);
    mri.draw(this.ctx, scaleX, scaleY);
    tree.draw(this.ctx, scaleX, scaleY);

    // Draw a border around the tree
    // const treeWidth = tree.width * scaleX;
    // const treeHeight = tree.height * scaleY;
    // const treeX = tree.x * scaleX;
    // const treeY = tree.y * scaleY;
    // this.ctx.strokeStyle = "red"; // Set the color of the border
    // this.ctx.lineWidth = 3; // Set the thickness of the border
    // this.ctx.strokeRect(treeX, treeY, treeWidth, treeHeight); // Draw the border
  }
}
