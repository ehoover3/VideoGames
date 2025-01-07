// games/loop.js
import { STATES, WALK_FRAMES, ATTACK_FRAMES, FRAME_WIDTH, FRAME_HEIGHT } from "../../config/constants.js";
import { loadOverworld } from "./overworld.js";
import { loadScanGame } from "./scanGame.js";
import { loadMenu } from "./menu.js";

export function startGame({ ctx, canvas, keys, gameState, gameObjects }) {
  function drawText(text, x, y, font = "16px Arial", color = "black", align = "center") {
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
  }

  function gameLoop() {
    switch (gameState.currentState) {
      case STATES.MAIN_MENU:
        loadMenu(keys, gameState, ctx, canvas, drawText);
        break;
      case STATES.OVERWORLD:
        loadOverworld(gameObjects, keys, gameState, WALK_FRAMES, ATTACK_FRAMES, FRAME_WIDTH, FRAME_HEIGHT, STATES, ctx, canvas, drawText);
        break;
      case STATES.SCAN_GAME:
        loadScanGame(gameObjects, keys, gameState, STATES, ctx, canvas);
        break;
    }
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}
