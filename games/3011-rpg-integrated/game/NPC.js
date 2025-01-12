// game/NPC.js
export default class NPC {
  constructor({ image, x, y, width, height, interactionText }) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.interactionText = interactionText;
  }

  draw(ctx, scaleX, scaleY) {
    const scaledX = this.x * scaleX;
    const scaledY = this.y * scaleY;
    const scaledWidth = this.width * scaleX;
    const scaledHeight = this.height * scaleY;

    ctx.drawImage(this.image, 0, 0, this.width, this.height, scaledX, scaledY, scaledWidth, scaledHeight);
  }

  interact() {
    return this.interactionText;
  }
}
