// game/gameStart/PlayerObject.js

import { STATES, FRAME_SETTINGS } from "../../config/constants.js";
import { ACTIONS, DIRECTION } from "../../config/constants.js";

const DIRECTIONS = {
  down: 0,
  up: 1,
  left: 2,
  right: 3,
};

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
    let isMoving = false;
    let moveX = 0,
      moveY = 0;

    if (keys["ArrowUp"]) {
      moveY -= 1;
      this.direction = DIRECTION.UP;
      isMoving = true;
    }
    if (keys["ArrowDown"]) {
      moveY += 1;
      this.direction = DIRECTION.DOWN;
      isMoving = true;
    }
    if (keys["ArrowLeft"]) {
      moveX -= 1;
      this.direction = DIRECTION.LEFT;
      isMoving = true;
    }
    if (keys["ArrowRight"]) {
      moveX += 1;
      this.direction = DIRECTION.RIGHT;
      isMoving = true;
    }

    if (moveX !== 0 && moveY !== 0) {
      const SQUARE_ROOT_OF_TWO = 1.4142;
      const diagonalSpeed = (SQUARE_ROOT_OF_TWO / 2) * this.speed;
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
    if (keys["ArrowUp"] || keys["ArrowDown"] || keys["ArrowLeft"] || keys["ArrowRight"]) {
      return ACTIONS.WALKING;
    } else {
      return ACTIONS.IDLE;
    }
  }

  handleAnimation(gameState, currentAction) {
    const WALK_FRAMES = FRAME_SETTINGS.WALK_FRAMES;
    let { animationTimer, animationSpeed } = gameState;

    if (currentAction === ACTIONS.WALKING) {
      animationTimer++;
      if (animationTimer >= animationSpeed) {
        animationTimer = 0;
        this.currentFrame = (this.currentFrame + 1) % WALK_FRAMES;
      }
    } else {
      animationTimer = 0;
      this.currentFrame = 0;
    }

    gameState.animationTimer = animationTimer;
  }

  handleCollision(keys, mriMachine, currentState) {
    if (this.checkCollisionWithGameObject(mriMachine) && keys[" "]) {
      return {
        savedPlayerPosition: { x: this.x, y: this.y },
        previousState: currentState,
        currentState: STATES.SCAN_GAME,
      };
    }
  }

  checkCollisionWithGameObject(gameObject) {
    return this.x < gameObject.x + gameObject.width && this.x + this.width > gameObject.x && this.y < gameObject.y + gameObject.height && this.y + this.height > gameObject.y;
  }

  handleEscapeKeyLogic(keys, currentState, previousState, savedPlayerPosition) {
    if (keys["Escape"]) {
      return {
        savedPlayerPosition: { x: this.x, y: this.y },
        previousState: currentState,
        currentState: STATES.MAIN_MENU,
      };
    }

    return {
      savedPlayerPosition: savedPlayerPosition,
      previousState: previousState,
      currentState: currentState,
    };
  }

  drawPlayer(canvas, ctx, currentFrame) {
    const { FRAME_WIDTH, FRAME_HEIGHT } = FRAME_SETTINGS;
    const spriteRow = DIRECTIONS[this.direction];
    const sourceX = (currentFrame % 4) * FRAME_WIDTH;
    const sourceY = spriteRow * FRAME_HEIGHT;

    const scaleX = canvas.width / 640;
    const scaleY = canvas.height / 360;

    const scaledX = this.x * scaleX;
    const scaledY = this.y * scaleY;
    const scaledWidth = this.width * scaleX;
    const scaledHeight = this.height * scaleY;

    ctx.drawImage(this.image, sourceX, sourceY, FRAME_WIDTH, FRAME_HEIGHT, scaledX, scaledY, scaledWidth, scaledHeight);
  }
}

export function updatePlayer({ keys, gameState, gameObjects }) {
  let { currentAction, currentState, previousState, savedPlayerPosition } = gameState;
  let { player, mriMachine } = gameObjects;

  let movement = { player, keys };
  let action = { keys, currentAction };
  let collision = { player, keys, mriMachine, currentState };

  player.handleMovement(keys);
  currentAction = player.handleAction(keys);
  player.handleAnimation(gameState, currentAction);

  const collisionResult = player.handleCollision(keys, mriMachine, currentState);

  if (collisionResult) {
    savedPlayerPosition = collisionResult.savedPlayerPosition;
    previousState = collisionResult.previousState;
    currentState = collisionResult.currentState;
  }
  const escapeKeyResult = player.handleEscapeKeyLogic(keys, currentState, previousState, savedPlayerPosition);

  if (escapeKeyResult) {
    savedPlayerPosition = escapeKeyResult.savedPlayerPosition;
    previousState = escapeKeyResult.previousState;
    currentState = escapeKeyResult.currentState;
  }

  return {
    currentState,
    previousState,
    savedPlayerPosition,
  };
}
