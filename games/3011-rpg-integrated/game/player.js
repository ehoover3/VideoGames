// game/player.js

import { ACTIONS, DIRECTION } from "../config/constants.js";
import { STATES, FRAME_SETTINGS } from "../config/constants.js";

export function updatePlayer({ keys, gameState, gameObjects }) {
  let { currentAction, currentState, previousState, savedPlayerPosition } = gameState;
  let { player, mriMachine } = gameObjects;

  let movement = { player, keys };
  let action = { keys, currentAction };
  let animation = { gameState };
  let collision = { player, keys, mriMachine, currentState };

  handleMovement(movement);
  currentAction = handleAction(action); // Ensure currentAction is updated
  handleAnimation({ gameState, currentAction });

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
  if (keys["ArrowUp"] || keys["ArrowDown"] || keys["ArrowLeft"] || keys["ArrowRight"]) {
    console.log("Walking action detected");
    return ACTIONS.WALKING; // Return walking action
  } else {
    console.log("Idle action detected");
    return ACTIONS.IDLE; // Return idle action
  }
}

function handleAnimation({ gameState, currentAction }) {
  const WALK_FRAMES = FRAME_SETTINGS.WALK_FRAMES;
  let { animationTimer, animationSpeed, currentFrame } = gameState;

  if (currentAction === ACTIONS.WALKING) {
    animationTimer++;
    if (animationTimer >= animationSpeed) {
      animationTimer = 0; // Reset timer
      currentFrame = (currentFrame + 1) % WALK_FRAMES; // Loop through frames
      console.log(`Walking Frame: ${currentFrame}`); // Debug frame updates
    }
  } else {
    animationTimer = 0;
    currentFrame = 0; // Default to idle frame when not walking
    console.log("Idle Frame");
  }

  // Update gameState
  gameState.animationTimer = animationTimer;
  gameState.currentFrame = currentFrame;
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
