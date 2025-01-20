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

  static MENU_KEYS = {
    l: STATES.ADVENTURE_LOG,
    L: STATES.ADVENTURE_LOG,
    i: STATES.INVENTORY,
    I: STATES.INVENTORY,
    s: STATES.SYSTEM,
    S: STATES.SYSTEM,
    Escape: STATES.SYSTEM,
  };

  static THROW_SETTINGS = {
    COOLDOWN: 500,
    THROW_DISTANCE: 100,
    THROW_SPEED: 3, // Reduced for smoother animation
    THROW_ARC_HEIGHT: 50, // Increased for more visible arc
  };

  #sprite;
  #movement;
  #interaction;

  constructor(image, x, y, width, height, speed, direction) {
    super({
      imgPath: image,
      imgSourceX: 0,
      imgSourceY: 0,
      imgSourceWidth: Player.FRAME_SETTINGS.FRAME_WIDTH,
      imgSourceHeight: Player.FRAME_SETTINGS.FRAME_HEIGHT,
      x,
      y,
      width,
      height,
    });

    this.#sprite = {
      image,
      frame: 0,
      animationTimer: 0,
    };

    this.#movement = {
      speed,
      direction,
      isMoving: false,
    };

    this.#interaction = this.#createInitialInteractionState();

    this.throwState = {
      isThrowing: false,
      lastThrowTime: 0,
      ballPosition: null,
      throwProgress: 0,
      startPosition: null,
      targetPosition: null,
    };
  }

  #createInitialInteractionState() {
    return {
      isInteracting: false,
      message: null,
      showPickupNotification: false,
      lastPickedUpItem: null,
      droppedItem: null,
    };
  }

  update({ keys, gameState, gameObjects }) {
    const menuUpdate = this.#handleMenuKeys(keys, gameState);
    if (menuUpdate) return menuUpdate;

    // Handle throwing
    if (keys["t"] || keys["T"]) {
      const inventory = window.gameInstance?.getInventory();
      const hasBall = inventory?.items.some((item) => item.name === "Tennis Ball");

      if (hasBall && !this.throwState.isThrowing && Date.now() - this.throwState.lastThrowTime > Player.THROW_SETTINGS.COOLDOWN) {
        this.#startThrow();
      }
    }

    // Update throw animation if active
    if (this.throwState.isThrowing) {
      this.#updateThrow();
    }

    const isMoving = this.#move(keys);
    this.#updateAnimation(isMoving);

    gameState.currentFrame = this.#sprite.frame;

    if (isMoving) return this.#createGameState(gameState, this.#createInitialInteractionState());

    return this.#handleGameObjectInteractions(keys, gameState, gameObjects);
  }

  #startThrow() {
    const throwDistance = Player.THROW_SETTINGS.THROW_DISTANCE;
    const directionMultiplier = {
      [DIRECTION.UP]: { x: 0, y: -1 },
      [DIRECTION.DOWN]: { x: 0, y: 1 },
      [DIRECTION.LEFT]: { x: -1, y: 0 },
      [DIRECTION.RIGHT]: { x: 1, y: 0 },
    };

    const multiplier = directionMultiplier[this.#movement.direction];

    // Start from player's current position
    const startX = this.x + this.width / 2; // Center of the player sprite
    const startY = this.y + this.height / 2;

    // Calculate target position based on direction
    const targetX = startX + multiplier.x * throwDistance;
    const targetY = startY + multiplier.y * throwDistance;

    this.throwState = {
      isThrowing: true,
      throwProgress: 0,
      startPosition: { x: startX, y: startY },
      targetPosition: { x: targetX, y: targetY },
      ballPosition: { x: startX, y: startY },
      lastThrowTime: Date.now(),
    };

    // Remove ball from inventory
    const inventory = window.gameInstance?.getInventory();
    if (inventory) {
      const ballIndex = inventory.items.findIndex((item) => item.name === "Tennis Ball");
      if (ballIndex !== -1) {
        inventory.items.splice(ballIndex, 1);
      }
    }
  }

  #updateThrow() {
    const now = Date.now();
    const elapsed = now - this.throwState.lastThrowTime;
    this.throwState.lastThrowTime = now;

    const throwSpeed = Player.THROW_SETTINGS.THROW_SPEED * (elapsed / 9); // Adjust speed based on frame time
    this.throwState.throwProgress += throwSpeed;

    if (this.throwState.throwProgress >= 100) {
      this.throwState.isThrowing = false;
      this.throwState.ballPosition = this.throwState.targetPosition;

      // Update ball position in game objects
      const game = window.gameInstance;
      if (game?.gameObjects?.ball) {
        game.gameObjects.ball.x = this.throwState.targetPosition.x - game.gameObjects.ball.width / 2;
        game.gameObjects.ball.y = this.throwState.targetPosition.y - game.gameObjects.ball.height / 2;
        game.gameObjects.ball.isPickedUp = false;
      }
      return;
    }

    const progress = this.throwState.throwProgress / 100;

    // Interpolate between start and target positions
    this.throwState.ballPosition = {
      x: this.throwState.startPosition.x + (this.throwState.targetPosition.x - this.throwState.startPosition.x) * progress,
      y: this.throwState.startPosition.y + (this.throwState.targetPosition.y - this.throwState.startPosition.y) * progress,
    };
  }

  #move(keys) {
    const movement = this.#calculateMovement(keys);
    if (!movement.isMoving) return false;

    this.#updatePosition(movement);
    this.#resetInteractionState();
    return true;
  }

  #calculateMovement(keys) {
    const movement = {
      x: 0,
      y: 0,
      direction: this.#movement.direction,
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

  #updatePosition(movement) {
    const isDiagonal = movement.x !== 0 && movement.y !== 0;
    const speed = isDiagonal ? this.#movement.speed / Math.SQRT2 : this.#movement.speed;

    this.x += movement.x * speed;
    this.y += movement.y * speed;
    this.#movement.direction = movement.direction;
  }

  #resetInteractionState() {
    Object.assign(this.#interaction, this.#createInitialInteractionState());
  }

  #updateAnimation(isMoving) {
    const { WALK_FRAMES, ANIMATION_SPEED } = Player.FRAME_SETTINGS;

    if (!isMoving) {
      this.#sprite.frame = 0;
      this.#sprite.animationTimer = 0;
      return;
    }

    this.#sprite.animationTimer++;
    if (this.#sprite.animationTimer >= ANIMATION_SPEED) {
      this.#sprite.animationTimer = 0;
      this.#sprite.frame = (this.#sprite.frame + 1) % WALK_FRAMES;
    }
  }

  #handleGameObjectInteractions(keys, gameState, gameObjects) {
    const { ball, coin, dog, mri } = gameObjects;

    // Handle MRI interaction
    if (this.isColliding(mri) && keys[" "]) {
      return this.#changeGameState(gameState.currentState, STATES.MED_SCAN_GAME);
    }

    // Handle dog interaction
    if (!this.#interaction.showPickupNotification && this.isColliding(dog) && keys[" "]) {
      this.#interaction.isInteracting = true;
      this.#interaction.message = dog.interact();
      return this.#createGameState(gameState, this.#interaction);
    }

    // Handle item pickups
    const itemInteractions = [this.#handleItemPickup(ball, keys, gameState), this.#handleItemPickup(coin, keys, gameState)];

    const successfulInteraction = itemInteractions.find((result) => result !== null);
    if (successfulInteraction) return successfulInteraction;

    // Return current state if no interactions occurred
    return this.#createGameState(gameState, this.#interaction);
  }

  #handleItemPickup(item, keys, gameState) {
    if (!this.#canPickupItem(item, keys)) return null;

    const game = window.gameInstance;
    if (!game?.getInventory()) return null;

    const result = game.getInventory().addItem(item);
    if (!result.success) return null;

    item.isPickedUp = true;
    this.#updateInteractionStateForPickup(item, result.message);
    return this.#changeGameState(gameState.currentState, gameState.currentState, result.message);
  }

  #canPickupItem(item, keys) {
    if (item.isPickedUp || !keys[" "]) return false;
    const dx = this.x - item.x;
    const dy = this.y - item.y;
    return Math.sqrt(dx * dx + dy * dy) <= Inventory.INTERACTION_DISTANCE;
  }

  #updateInteractionStateForPickup(item, message) {
    Object.assign(this.#interaction, {
      isInteracting: false,
      showPickupNotification: true,
      lastPickedUpItem: item,
      message: message,
    });
  }

  #createGameState(gameState, interactionState) {
    return {
      currentState: gameState.currentState,
      previousState: gameState.previousState,
      savedPlayerPosition: gameState.savedPlayerPosition,
      interactionMessage: interactionState.message,
      showPickupNotification: interactionState.showPickupNotification,
      lastPickedUpItem: interactionState.lastPickedUpItem,
      isInteracting: interactionState.isInteracting,
      droppedItem: interactionState.droppedItem,
    };
  }

  #handleMenuKeys(keys, gameState) {
    for (const [key, state] of Object.entries(Player.MENU_KEYS)) {
      if (keys[key]) {
        return this.#changeGameState(gameState.currentState, state);
      }
    }
    return null;
  }

  #changeGameState(currentState, newState, interactionMessage = null) {
    return {
      savedPlayerPosition: { x: this.x, y: this.y },
      previousState: currentState,
      currentState: newState,
      interactionMessage,
    };
  }

  draw(canvas, ctx) {
    const { FRAME_WIDTH, FRAME_HEIGHT } = Player.FRAME_SETTINGS;
    const spriteRow = Player.DIRECTIONS[this.#movement.direction];

    this.imgSourceX = this.#sprite.frame * FRAME_WIDTH;
    this.imgSourceY = spriteRow * FRAME_HEIGHT;

    const scale = {
      x: canvas.width / 640,
      y: canvas.height / 360,
    };

    super.draw(ctx, scale.x, scale.y);
  }
}

export default Player;
