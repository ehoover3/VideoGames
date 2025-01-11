// game/gameStart/GameObject.js

export class GameObject {
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

  getScaledDimensions(scaleX, scaleY) {
    return {
      scaledX: this.x * scaleX,
      scaledY: this.y * scaleY,
      scaledWidth: this.width * scaleX,
      scaledHeight: this.height * scaleY,
    };
  }

  draw(ctx, scaleX, scaleY) {
    const { imgSourceX, imgSourceY, imgSourceWidth, imgSourceHeight } = this;
    const { scaledX, scaledY, scaledWidth, scaledHeight } = this.getScaledDimensions(scaleX, scaleY);
    ctx.drawImage(this.imgPath, imgSourceX, imgSourceY, imgSourceWidth, imgSourceHeight, scaledX, scaledY, scaledWidth, scaledHeight);
  }
}
