// game/Player.js
import { DIRECTION, STATES } from "../config/constants.js";
import GameObject from "./GameObject.js";
import Inventory from "./Inventory.js";

class Player extends GameObject {
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
    // Call parent constructor with required properties
    super({
      imgPath: image,
      imgSourceX: 0, // Will be updated in draw method
      imgSourceY: 0, // Will be updated in draw method
      imgSourceWidth: Player.FRAME_SETTINGS.FRAME_WIDTH,
      imgSourceHeight: Player.FRAME_SETTINGS.FRAME_HEIGHT,
      x,
      y,
      width,
      height,
    });

    this.sprite = {
      image,
      frame: 0,
      animationTimer: 0,
    };

    this.movement = {
      speed,
      direction,
      isMoving: false,
    };

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
    this.x += x * speed; // Using inherited x property
    this.y += y * speed; // Using inherited y property
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
    const { dog, mri, ball } = gameObjects;

    const isWithinInteractionDistance = (object) => {
      const dx = this.x - object.x;
      const dy = this.y - object.y;
      return Math.sqrt(dx * dx + dy * dy) <= Inventory.INTERACTION_DISTANCE;
    };

    if (this.isColliding(mri) && keys[" "]) {
      return this.createStateUpdate(currentState, STATES.MED_SCAN_GAME);
    }

    if (this.isColliding(dog) && keys[" "]) {
      this.interaction.isInteracting = true;
      this.interaction.message = dog.interact();
      return this.createStateUpdate(currentState, currentState, this.interaction.message);
    }

    if (!ball.isPickedUp && keys[" "] && isWithinInteractionDistance(ball)) {
      const game = window.gameInstance;
      if (game && game.getInventory()) {
        const result = game.getInventory().addItem(ball);
        if (result.success) {
          ball.isPickedUp = true;
          this.interaction.isInteracting = true;
          this.interaction.message = result.message;
          return this.createStateUpdate(currentState, currentState, this.interaction.message);
        }
      }
    }

    return null;
  }

  createStateUpdate(currentState, newState, interactionMessage = null) {
    return {
      savedPlayerPosition: { x: this.x, y: this.y }, // Using inherited x,y properties
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

  // Override parent's draw method
  draw(canvas, ctx) {
    const { FRAME_WIDTH, FRAME_HEIGHT } = Player.FRAME_SETTINGS;
    const spriteRow = Player.DIRECTIONS[this.movement.direction];

    // Update source coordinates
    this.imgSourceX = this.sprite.frame * FRAME_WIDTH;
    this.imgSourceY = spriteRow * FRAME_HEIGHT;

    const scale = {
      x: canvas.width / 640,
      y: canvas.height / 360,
    };

    // Call parent's draw method with calculated scale
    super.draw(ctx, scale.x, scale.y);
  }

  update({ keys, gameState, gameObjects }) {
    const inventoryUpdate = this.handleInventoryKey(keys, gameState);
    if (inventoryUpdate) return inventoryUpdate;

    const isMoving = this.move(keys);
    this.updateAnimation(gameState, isMoving);

    const interactionResult = this.checkInteractions(keys, gameObjects, gameState.currentState);
    if (interactionResult) return interactionResult;

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
