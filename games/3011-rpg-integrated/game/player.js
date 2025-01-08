// player.js

import { ACTIONS, DIRECTION } from "../config/constants.js";
import { STATES, FRAME_SETTINGS } from "../config/constants.js";

export function updatePlayer({ gameObjects, keys, gameState }) {
  let { currentAction, currentState, previousState, savedPlayerPosition } = gameState;
  let { player, mriMachine } = gameObjects;

  let movement = { player, keys };
  let action = { keys, currentAction };
  let animation = { gameState };
  let collision = { player, keys, mriMachine, currentState };

  handleMovement(movement);
  handleAction(action);
  handleAnimation(animation);

  const collisionResult = handleCollision(collision);

  if (collisionResult) {
    savedPlayerPosition = collisionResult.savedPlayerPosition;
    previousState = collisionResult.previousState;
    currentState = collisionResult.currentState;
  }
  const escapeKeyResult = handleEscapeKeyLogic(keys, player, currentState, previousState, savedPlayerPosition);

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

function handleMovement({ player, keys }) {
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

function handleAction({ keys, currentAction }) {
  if (keys["z"] || keys["Z"]) {
    currentAction = ACTIONS.ATTACKING;
  } else if (keys["ArrowUp"] || keys["ArrowDown"] || keys["ArrowLeft"] || keys["ArrowRight"]) {
    currentAction = ACTIONS.WALKING;
  } else {
    currentAction = ACTIONS.IDLE;
  }
}

function handleAnimation({ gameState }) {
  const WALK_FRAMES = FRAME_SETTINGS.WALK_FRAMES;
  const ATTACK_FRAMES = FRAME_SETTINGS.ATTACK_FRAMES;
  let { currentAction, animationTimer, animationSpeed, currentFrame } = gameState;

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

function handleCollision({ player, keys, mriMachine, currentState }) {
  if (checkCollisionWithGameObject(player, mriMachine) && keys[" "]) {
    return {
      savedPlayerPosition: { x: player.x, y: player.y },
      previousState: currentState,
      currentState: STATES.SCAN_GAME,
    };
  }
}

function checkCollisionWithGameObject(player, gameObject) {
  return player.x < gameObject.x + gameObject.width && player.x + player.width > gameObject.x && player.y < gameObject.y + gameObject.height && player.y + player.height > gameObject.y;
}

function handleEscapeKeyLogic(keys, player, currentState, previousState, savedPlayerPosition) {
  if (keys["Escape"]) {
    return {
      savedPlayerPosition: { x: player.x, y: player.y },
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
