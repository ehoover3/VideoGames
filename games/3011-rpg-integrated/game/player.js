// player.js

import { ACTIONS, DIRECTION } from "../config/constants.js";
import { checkCollisionWithGameObject } from "../game/game.js";

export function updatePlayer(player, mriMachine, STATES, keys, WALK_FRAMES, ATTACK_FRAMES, gameState) {
  let currentAction = gameState.currentAction;
  let animationTimer = gameState.animationTimer;
  let animationSpeed = gameState.animationSpeed;
  let currentFrame = gameState.currentFrame;
  let currentState = gameState.currentState;
  let previousState = gameState.previousState;
  let savedPlayerPosition = gameState.savedPlayerPosition;

  handleMovement(player, keys);
  handleAction(keys, currentAction);
  handleAnimation(currentAction, animationTimer, animationSpeed, WALK_FRAMES, ATTACK_FRAMES, currentFrame);
  const collisionResult = handleCollision(player, keys, mriMachine, STATES, currentState, previousState, savedPlayerPosition);
  if (collisionResult) {
    savedPlayerPosition = collisionResult.savedPlayerPosition;
    previousState = collisionResult.previousState;
    currentState = collisionResult.currentState;
  }
  const escapeKeyResult = handleEscapeKeyLogic(keys, player, STATES, currentState, previousState, savedPlayerPosition);

  if (escapeKeyResult) {
    savedPlayerPosition = escapeKeyResult.savedPlayerPosition;
    previousState = escapeKeyResult.previousState;
    currentState = escapeKeyResult.currentState;
  }

  return {
    currentState: currentState,
    previousState: previousState,
    savedPlayerPosition: savedPlayerPosition,
  };
}

export function handleMovement(player, keys) {
  let isMoving = false;
  let moveX = 0,
    moveY = 0;

  if (keys["ArrowUp"]) {
    moveY -= 1;
    player.direction = DIRECTION.UP;
    isMoving = true;
  }
  if (keys["ArrowDown"]) {
    moveY += 1;
    player.direction = DIRECTION.DOWN;
    isMoving = true;
  }
  if (keys["ArrowLeft"]) {
    moveX -= 1;
    player.direction = DIRECTION.LEFT;
    isMoving = true;
  }
  if (keys["ArrowRight"]) {
    moveX += 1;
    player.direction = DIRECTION.RIGHT;
    isMoving = true;
  }

  if (moveX !== 0 && moveY !== 0) {
    const SQUARE_ROOT_OF_TWO = 1.4142;
    const diagonalSpeed = (SQUARE_ROOT_OF_TWO / 2) * player.speed;
    moveX *= diagonalSpeed;
    moveY *= diagonalSpeed;
  } else {
    moveX *= player.speed;
    moveY *= player.speed;
  }

  player.x += moveX;
  player.y += moveY;
}

export function handleAction(keys, currentAction) {
  if (keys["z"] || keys["Z"]) {
    currentAction = ACTIONS.ATTACKING;
  } else if (keys["ArrowUp"] || keys["ArrowDown"] || keys["ArrowLeft"] || keys["ArrowRight"]) {
    currentAction = ACTIONS.WALKING;
  } else {
    currentAction = ACTIONS.IDLE;
  }
}

export function handleAnimation(currentAction, animationTimer, animationSpeed, WALK_FRAMES, ATTACK_FRAMES, currentFrame) {
  if (currentAction === ACTIONS.WALKING || currentAction === ACTIONS.ATTACKING) {
    animationTimer++;
    if (animationTimer >= animationSpeed) {
      animationTimer = 0;
      currentFrame++;
      if ((currentAction === ACTIONS.WALKING && currentFrame >= WALK_FRAMES) || (currentAction === ACTIONS.ATTACKING && currentFrame >= ATTACK_FRAMES)) {
        currentFrame = 0;
      }
    }
  } else {
    currentFrame = 0;
  }
}

export function handleCollision(player, keys, mriMachine, STATES, currentState, previousState, savedPlayerPosition) {
  if (checkCollisionWithGameObject(player, mriMachine) && keys[" "]) {
    return {
      savedPlayerPosition: { x: player.x, y: player.y },
      previousState: currentState,
      currentState: STATES.SCAN_GAME,
    };
  }
}

export function handleEscapeKeyLogic(keys, player, STATES, currentState, previousState, savedPlayerPosition) {
  if (keys["Escape"]) {
    return {
      savedPlayerPosition: { x: player.x, y: player.y }, // Save the current player position
      previousState: currentState,
      currentState: STATES.MAIN_MENU, // Switch to the MAIN_MENU state
    };
  }

  // If Escape is not pressed, return the current states unchanged
  return {
    savedPlayerPosition: savedPlayerPosition,
    previousState: previousState,
    currentState: currentState,
  };
}
