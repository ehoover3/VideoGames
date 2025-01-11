// game/gameObjects.js

import { DIRECTION } from "../../config/constants.js";

const loadedImages = {
  mri: loadImage("assets/images/overworld/mri.png"),
  player: loadImage("assets/images/overworld/player.png"),
};

export function initGameObjects() {
  const player = createPlayer(100, 100, 32, 32, 4, DIRECTION.DOWN, "player");

  const mriMachine = new GameObject(
    {
      imageKey: "mri",
      imgSourceX: 0,
      imgSourceY: 0,
      imgSourceWidth: 556,
      imgSourceHeight: 449,
      imgDestinationX: 0,
      imgDestinationY: 0,
      imgDestinationWidth: 32,
      imgDestinationHeight: 32,
    },
    130,
    130,
    64,
    64
  );

  return { player, mriMachine };
}

class GameObject {
  constructor(image, x, y, width, height) {
    // image
    this.imgPath = loadedImages[image.imageKey];
    this.imgSourceY = image.imgSourceY;
    this.imgSourceWidth = image.imgSourceWidth;
    this.imgSourceX = image.imgSourceX;
    this.imgSourceHeight = image.imgSourceHeight;
    this.imgDestinationX = image.imgDestinationX;
    this.imgDestinationY = image.imgDestinationY;
    this.imgDestinationWidth = image.imgDestinationWidth;
    this.imgDestinationHeight = image.imgDestinationHeight;
    //
    this.x = x;
    this.y = y;
    this.width = width || 32;
    this.height = height || 32;
  }

  draw(ctx, scaleX, scaleY) {
    const { imgSourceX, imgSourceY, imgSourceWidth, imgSourceHeight, imgDestinationX, imgDestinationY, imgDestinationWidth, imgDestinationHeight } = this;
    const scaledX = this.x * scaleX;
    const scaledY = this.y * scaleY;
    const scaledWidth = this.width * scaleX;
    const scaledHeight = this.height * scaleY;
    ctx.drawImage(this.imgPath, imgSourceX, imgSourceY, imgSourceWidth, imgSourceHeight, scaledX, scaledY, scaledWidth, scaledHeight);
  }
}

function loadImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}

export function createPlayer(x, y, width, height, speed, direction, imageKey) {
  return {
    x,
    y,
    width,
    height,
    speed,
    direction,
    image: loadedImages[imageKey],
  };
}
