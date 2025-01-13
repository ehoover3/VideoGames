// game/GameObject.js
export default class GameObject {
  constructor({ imgPath, imgSourceX, imgSourceY, imgSourceWidth, imgSourceHeight, x, y, width = 32, height = 32 }) {
    this.imgPath = imgPath;
    this.imgSourceX = imgSourceX;
    this.imgSourceY = imgSourceY;
    this.imgSourceWidth = imgSourceWidth;
    this.imgSourceHeight = imgSourceHeight;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(ctx, scaleX, scaleY) {
    const { imgSourceX, imgSourceY, imgSourceWidth, imgSourceHeight } = this;
    const { scaledX, scaledY, scaledWidth, scaledHeight } = this.getScaledDimensions(scaleX, scaleY);
    ctx.drawImage(this.imgPath, imgSourceX, imgSourceY, imgSourceWidth, imgSourceHeight, scaledX, scaledY, scaledWidth, scaledHeight);
  }

  getScaledDimensions(scaleX, scaleY) {
    return {
      scaledX: this.x * scaleX,
      scaledY: this.y * scaleY,
      scaledWidth: this.width * scaleX,
      scaledHeight: this.height * scaleY,
    };
  }

  // Helper method for collision detection
  getBoundingBox() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  // Method to check if this object collides with another game object
  isColliding(otherObject) {
    const box1 = this.getBoundingBox();
    const box2 = otherObject.getBoundingBox();

    return box1.x < box2.x + box2.width && box1.x + box1.width > box2.x && box1.y < box2.y + box2.height && box1.y + box1.height > box2.y;
  }
}
