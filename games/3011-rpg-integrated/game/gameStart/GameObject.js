// game/gameStart/GameObject.js

export class GameObject {
  constructor(object) {
    this.imgPath = object.imgPath;
    this.imgSourceY = object.imgSourceY;
    this.imgSourceWidth = object.imgSourceWidth;
    this.imgSourceX = object.imgSourceX;
    this.imgSourceHeight = object.imgSourceHeight;

    this.x = object.x;
    this.y = object.y;
    this.width = object.width || 32;
    this.height = object.height || 32;
  }

  draw(ctx, scaleX, scaleY) {
    const { imgSourceX, imgSourceY, imgSourceWidth, imgSourceHeight } = this;
    const scaledX = this.x * scaleX;
    const scaledY = this.y * scaleY;
    const scaledWidth = this.width * scaleX;
    const scaledHeight = this.height * scaleY;
    ctx.drawImage(this.imgPath, imgSourceX, imgSourceY, imgSourceWidth, imgSourceHeight, scaledX, scaledY, scaledWidth, scaledHeight);
  }
}
