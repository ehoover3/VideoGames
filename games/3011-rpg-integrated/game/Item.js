// game/Item.js
import GameObject from "./GameObject.js";

export default class Item extends GameObject {
  constructor(config) {
    super(config);
    this.name = config.name || "Unknown Item";
    this.isPickedUp = config.isPickedUp || false;
  }
}
