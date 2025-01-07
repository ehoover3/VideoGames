// games/loop.js
import { STATES, WALK_FRAMES, ATTACK_FRAMES, FRAME_WIDTH, FRAME_HEIGHT } from "../../config/constants.js";
import { handleOverworld } from "./handleOverworld.js";
import { handleScanGame } from "./handleScanGame.js";
import { handleMenu } from "./handleMenu.js";

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
        handleMenu(keys, gameState, ctx, canvas, drawText);
        break;
      case STATES.OVERWORLD:
        handleOverworld(gameObjects, keys, gameState, WALK_FRAMES, ATTACK_FRAMES, FRAME_WIDTH, FRAME_HEIGHT, STATES, ctx, canvas, drawText);
        break;
      case STATES.SCAN_GAME:
        handleScanGame(gameObjects, keys, gameState, STATES, drawText, ctx, canvas);
        break;
    }
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}
