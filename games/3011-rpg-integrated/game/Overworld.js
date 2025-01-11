// game/Overworld.js

// import HUD from "./HUD.js";

// export function loadOverworld({ canvas, ctx, keys, gameState, gameObjects }) {
//   const update = gameObjects.player.update({ keys, gameState, gameObjects });
//   const hud = new HUD(canvas, ctx);

//   gameState.currentState = update.currentState;
//   gameState.previousState = update.previousState;
//   gameState.savedPlayerPosition = update.savedPlayerPosition;

//   drawOverworld({ canvas, ctx, gameObjects, gameState });
//   hud.draw(gameState.currentState);
// }

// function drawOverworld({ canvas, ctx, gameObjects, gameState }) {
//   drawWorld({ canvas, ctx });
//   drawGameObjects({ canvas, ctx, gameObjects });
//   gameObjects.player.drawPlayer(canvas, ctx, gameState.currentFrame);
// }

// function drawWorld({ canvas, ctx }) {
//   ctx.fillStyle = "darkseagreen";
//   ctx.fillRect(0, 0, canvas.width, canvas.height);
// }

// function drawGameObjects({ canvas, ctx, gameObjects }) {
//   let { mriMachine } = gameObjects;
//   const scaleX = canvas.width / 640;
//   const scaleY = canvas.height / 360;
//   mriMachine.draw(ctx, scaleX, scaleY);
// }
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

    this.draw();
    this.hud.draw(this.gameState.currentState);
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
    const { mriMachine } = this.gameObjects;
    const scaleX = this.canvas.width / 640;
    const scaleY = this.canvas.height / 360;
    mriMachine.draw(this.ctx, scaleX, scaleY);
  }
}
