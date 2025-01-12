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
    this.hud.draw(this.gameState.currentState, update.interactionMessage);
  }

  draw() {
    this.drawWorld();
    this.drawGameObjects();
    this.gameObjects.player.drawPlayer(this.canvas, this.ctx, this.gameState.currentFrame);
  }

  drawWorld() {
    this.ctx.fillStyle = "darkseagreen";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawGameObjects() {
    const { dog, mriMachine } = this.gameObjects;
    const scaleX = this.canvas.width / 640;
    const scaleY = this.canvas.height / 360;
    mriMachine.draw(this.ctx, scaleX, scaleY);
    dog.draw(this.ctx, scaleX, scaleY);
  }
}
