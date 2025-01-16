// game/NPC.js
import GameObject from "./GameObject.js";

export default class NPC extends GameObject {
  constructor(config) {
    super(config);
    this.interactionText = config.interactionText;
    this.quest = null;
  }

  interact(gameState) {
    if (this.quest) {
      const response = this.quest.handleInteraction(window.gameInstance.gameObjects.player, this, gameState);
      return response || this.interactionText;
    }
    return this.interactionText;
  }
}
