// game/Player.js
import { ACTIONS, DIRECTION, STATES } from "../config/constants.js";

class Player {
  static FRAME_SETTINGS = {
    FRAME_WIDTH: 102,
    FRAME_HEIGHT: 152.75,
    WALK_FRAMES: 4,
    ATTACK_FRAMES: 1,
    ANIMATION_SPEED: 8,
  };

  static DIRECTIONS = {
    [DIRECTION.DOWN]: 0,
    [DIRECTION.UP]: 1,
    [DIRECTION.LEFT]: 2,
    [DIRECTION.RIGHT]: 3,
  };

  constructor(image, x, y, width, height, speed, direction) {
    // Sprite and position properties
    this.sprite = {
      image,
      frame: 0,
      animationTimer: 0,
    };

    this.position = { x, y };
    this.dimensions = { width, height };
    this.movement = {
      speed,
      direction,
      isMoving: false,
    };

    // Interaction state
    this.interaction = {
      isInteracting: false,
      message: null,
    };
  }

  move(keys) {
    const movement = this.calculateMovement(keys);
    if (!movement.isMoving) return false;

    this.updatePosition(movement);
    this.movement.direction = movement.direction;
    return true;
  }

  calculateMovement(keys) {
    const movement = {
      x: 0,
      y: 0,
      direction: this.movement.direction,
      isMoving: false,
    };

    if (keys["ArrowUp"]) {
      movement.y -= 1;
      movement.direction = DIRECTION.UP;
      movement.isMoving = true;
    }
    if (keys["ArrowDown"]) {
      movement.y += 1;
      movement.direction = DIRECTION.DOWN;
      movement.isMoving = true;
    }
    if (keys["ArrowLeft"]) {
      movement.x -= 1;
      movement.direction = DIRECTION.LEFT;
      movement.isMoving = true;
    }
    if (keys["ArrowRight"]) {
      movement.x += 1;
      movement.direction = DIRECTION.RIGHT;
      movement.isMoving = true;
    }

    return movement;
  }

  updatePosition({ x, y, isMoving }) {
    if (!isMoving) return;

    const speed = this.calculateSpeed(x, y);
    this.position.x += x * speed;
    this.position.y += y * speed;
  }

  calculateSpeed(x, y) {
    const isDiagonal = x !== 0 && y !== 0;
    return isDiagonal ? this.movement.speed / Math.SQRT2 : this.movement.speed;
  }

  updateAnimation(gameState, isMoving) {
    const { WALK_FRAMES, ANIMATION_SPEED } = Player.FRAME_SETTINGS;

    if (!isMoving) {
      this.sprite.frame = 0;
      this.sprite.animationTimer = 0;
      return;
    }

    this.sprite.animationTimer++;
    if (this.sprite.animationTimer >= ANIMATION_SPEED) {
      this.sprite.animationTimer = 0;
      this.sprite.frame = (this.sprite.frame + 1) % WALK_FRAMES;
    }

    gameState.currentFrame = this.sprite.frame;
  }

  checkInteractions(keys, gameObjects, currentState) {
    const { dog, mri } = gameObjects;

    // Check MRI interaction
    if (this.isCollidingWith(mri) && keys[" "]) {
      return this.createStateUpdate(currentState, STATES.MED_SCAN_GAME);
    }

    // Check dog interaction
    if (this.isCollidingWith(dog) && keys[" "]) {
      this.interaction.isInteracting = true;
      this.interaction.message = dog.interact();
      return this.createStateUpdate(currentState, currentState, this.interaction.message);
    }

    return null;
  }

  isCollidingWith(gameObject) {
    return this.position.x < gameObject.x + gameObject.width && this.position.x + this.dimensions.width > gameObject.x && this.position.y < gameObject.y + gameObject.height && this.position.y + this.dimensions.height > gameObject.y;
  }

  createStateUpdate(currentState, newState, interactionMessage = null) {
    return {
      savedPlayerPosition: { ...this.position },
      previousState: currentState,
      currentState: newState,
      interactionMessage,
    };
  }

  handleInventoryKey(keys, gameState) {
    if (keys["i"] || keys["I"]) {
      return this.createStateUpdate(gameState.currentState, STATES.INVENTORY);
    }
    return null;
  }

  handleEnterKey(keys) {
    if (keys["Enter"] && this.interaction.isInteracting) {
      this.interaction.isInteracting = false;
      this.interaction.message = null;
      return true;
    }
    return false;
  }

  handleEscapeKey(keys, currentState, previousState, savedPlayerPosition) {
    if (keys["Escape"]) {
      return this.createStateUpdate(currentState, STATES.MAIN_MENU);
    }
    return { currentState, previousState, savedPlayerPosition };
  }

  draw(canvas, ctx) {
    const { FRAME_WIDTH, FRAME_HEIGHT } = Player.FRAME_SETTINGS;
    const spriteRow = Player.DIRECTIONS[this.movement.direction];

    const sourceX = this.sprite.frame * FRAME_WIDTH;
    const sourceY = spriteRow * FRAME_HEIGHT;

    const scale = this.calculateScale(canvas);
    const drawPosition = this.calculateDrawPosition(scale);

    ctx.drawImage(this.sprite.image, sourceX, sourceY, FRAME_WIDTH, FRAME_HEIGHT, drawPosition.x, drawPosition.y, drawPosition.width, drawPosition.height);
  }

  calculateScale(canvas) {
    return {
      x: canvas.width / 640,
      y: canvas.height / 360,
    };
  }

  calculateDrawPosition(scale) {
    return {
      x: this.position.x * scale.x,
      y: this.position.y * scale.y,
      width: this.dimensions.width * scale.x,
      height: this.dimensions.height * scale.y,
    };
  }

  update({ keys, gameState, gameObjects }) {
    // Check for inventory toggle first
    const inventoryUpdate = this.handleInventoryKey(keys, gameState);
    if (inventoryUpdate) return inventoryUpdate;

    // Handle movement and animation
    const isMoving = this.move(keys);
    this.updateAnimation(gameState, isMoving);

    // Check for interactions with game objects
    const interactionResult = this.checkInteractions(keys, gameObjects, gameState.currentState);
    if (interactionResult) return interactionResult;

    // Handle other key inputs
    if (this.handleEnterKey(keys)) {
      return this.createStateUpdate(gameState.currentState, gameState.currentState, null);
    }

    const escapeResult = this.handleEscapeKey(keys, gameState.currentState, gameState.previousState, gameState.savedPlayerPosition);

    return {
      ...escapeResult,
      interactionMessage: this.interaction.isInteracting ? this.interaction.message : null,
    };
  }
}

export default Player;
