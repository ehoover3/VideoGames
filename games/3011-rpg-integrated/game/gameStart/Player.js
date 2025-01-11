// game/gameStart/Player.js

import { STATES, FRAME_SETTINGS, ACTIONS, DIRECTION } from "../../config/constants.js";

const DIRECTIONS = { down: 0, up: 1, left: 2, right: 3 };

export class Player {
  constructor(image, x, y, width, height, speed, direction) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.direction = direction;
    this.animationTimer = 0;
    this.currentFrame = 0;
  }

  handleMovement(keys) {
    let moveX = 0,
      moveY = 0;

    if (keys["ArrowUp"]) {
      moveY -= 1;
      this.direction = DIRECTION.UP;
    }
    if (keys["ArrowDown"]) {
      moveY += 1;
      this.direction = DIRECTION.DOWN;
    }
    if (keys["ArrowLeft"]) {
      moveX -= 1;
      this.direction = DIRECTION.LEFT;
    }
    if (keys["ArrowRight"]) {
      moveX += 1;
      this.direction = DIRECTION.RIGHT;
    }

    if (moveX && moveY) {
      // diagonal movement
      const diagonalSpeed = (1.4142 / 2) * this.speed;
      moveX *= diagonalSpeed;
      moveY *= diagonalSpeed;
    } else {
      moveX *= this.speed;
      moveY *= this.speed;
    }

    this.x += moveX;
    this.y += moveY;
  }

  handleAction(keys) {
    return keys["ArrowUp"] || keys["ArrowDown"] || keys["ArrowLeft"] || keys["ArrowRight"] ? ACTIONS.WALKING : ACTIONS.IDLE;
  }

  handleAnimation(gameState, currentAction) {
    const { WALK_FRAMES } = FRAME_SETTINGS;
    if (currentAction === ACTIONS.WALKING) {
      gameState.animationTimer++;
      if (gameState.animationTimer >= gameState.animationSpeed) {
        gameState.animationTimer = 0;
        this.currentFrame = (this.currentFrame + 1) % WALK_FRAMES;
      }
    } else {
      gameState.animationTimer = 0;
      this.currentFrame = 0;
    }
  }

  handleCollision(keys, mriMachine, currentState) {
    if (this.checkCollisionWithGameObject(mriMachine) && keys[" "]) {
      return { savedPlayerPosition: { x: this.x, y: this.y }, previousState: currentState, currentState: STATES.SCAN_GAME };
    }
  }

  checkCollisionWithGameObject(gameObject) {
    return this.x < gameObject.x + gameObject.width && this.x + this.width > gameObject.x && this.y < gameObject.y + gameObject.height && this.y + this.height > gameObject.y;
  }

  handleEscapeKeyLogic(keys, currentState, previousState, savedPlayerPosition) {
    if (keys["Escape"]) {
      return { savedPlayerPosition: { x: this.x, y: this.y }, previousState: currentState, currentState: STATES.MAIN_MENU };
    }
    return { savedPlayerPosition, previousState, currentState };
  }

  drawPlayer(canvas, ctx, currentFrame) {
    const { FRAME_WIDTH, FRAME_HEIGHT } = FRAME_SETTINGS;
    const spriteRow = DIRECTIONS[this.direction];
    const sourceX = (currentFrame % 4) * FRAME_WIDTH;
    const sourceY = spriteRow * FRAME_HEIGHT;

    const { scaledX, scaledY, scaledWidth, scaledHeight } = this.getScaledDimensions(canvas.width, canvas.height);
    ctx.drawImage(this.image, sourceX, sourceY, FRAME_WIDTH, FRAME_HEIGHT, scaledX, scaledY, scaledWidth, scaledHeight);
  }

  updatePlayer(keys, gameState, gameObjects) {
    let { currentAction, currentState, previousState, savedPlayerPosition } = gameState;
    let { mriMachine } = gameObjects;

    this.handleMovement(keys);
    currentAction = this.handleAction(keys);
    this.handleAnimation(gameState, currentAction);

    const collisionResult = this.handleCollision(keys, mriMachine, currentState);
    if (collisionResult) {
      savedPlayerPosition = collisionResult.savedPlayerPosition;
      previousState = collisionResult.previousState;
      currentState = collisionResult.currentState;
    }

    const escapeKeyResult = this.handleEscapeKeyLogic(keys, currentState, previousState, savedPlayerPosition);
    savedPlayerPosition = escapeKeyResult.savedPlayerPosition;
    previousState = escapeKeyResult.previousState;
    currentState = escapeKeyResult.currentState;

    return { currentState, previousState, savedPlayerPosition };
  }
}
