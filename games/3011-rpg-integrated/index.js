// index.js

import { startGame } from "./game/gameLoop/index.js";
import { setupCanvas } from "./game/gameStart/canvasSetup.js";
import { setupKeyboard } from "./game/gameStart/keyboard.js";
import { initGameObjects } from "./game/gameStart/gameObjects.js";
import { gameState } from "./game/gameStart/gameState.js";

const { canvas, ctx } = setupCanvas("gameCanvas");
const keys = setupKeyboard();
const gameObjects = initGameObjects();
let game = { canvas, ctx, keys, gameState, gameObjects };

startGame(game);
