import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("bird", "assets/bird.png");
}

let bird = null;
let totalDelta = null;

function create() {
  this.add.image(0, 0, "sky").setOrigin(0);
  bird = this.physics.add.sprite(config.width * 0.1, config.height / 2, "bird").setOrigin(0);
  bird.body.velocity.y = 200;
}

function update(time, delta) {
  if (totalDelta >= 1000) {
    return;
  }
  totalDelta += delta;
}

new Phaser.Game(config);
