// game/NPC.js
import GameObject from "./GameObject.js";

export default class NPC extends GameObject {
  constructor(config) {
    super(config);
    this.interactionText = config.interactionText;
  }

  interact() {
    return this.interactionText;
  }
}
