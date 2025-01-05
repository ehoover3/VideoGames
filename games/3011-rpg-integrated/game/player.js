export function createPlayer(x, y, width, height, color, speed, direction) {
  return { x, y, width, height, color, speed, direction };
}

// player.js

import { ACTIONS, DIRECTION } from "../config/constants.js";
import { checkCollisionWithGameObject } from "../game/game.js";
import globalState from "../game/state.js";
import { handleEscapeKey } from "../events/eventsManager.js";

export function updatePlayer(player, keys, currentAction, animationTimer, animationSpeed, WALK_FRAMES, ATTACK_FRAMES, currentFrame, mriMachine, STATES) {
  handleMovement(player, keys);
  handleAction(keys, currentAction);
  handleAnimation(currentAction, animationTimer, animationSpeed, WALK_FRAMES, ATTACK_FRAMES, currentFrame);
  handleCollision(player, keys, mriMachine, STATES);
  handleEscapeKeyLogic(keys, player, STATES);
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

export function handleCollision(player, keys, mriMachine, STATES) {
  if (checkCollisionWithGameObject(player, mriMachine) && keys[" "]) {
    globalState.setSavedPlayerPosition({ x: player.x, y: player.y });
    globalState.setPreviousState(globalState.getCurrentState());
    globalState.setCurrentState(STATES.MEDICAL_SCANS_GAME);
  }
}

export function handleEscapeKeyLogic(keys, player, STATES) {
  const updatedValues = handleEscapeKey(keys, globalState.getCurrentState(), globalState.getPreviousState(), player, globalState.getSavedPlayerPosition(), STATES);
  globalState.setCurrentState(updatedValues.currentState);
  globalState.setPreviousState(updatedValues.previousState);
  globalState.setSavedPlayerPosition(updatedValues.savedPlayerPosition);
}
