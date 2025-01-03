const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

const keys = {
  up: false,
  down: false,
  left: false,
  right: false,
  space: false,
};

let inBuilding = false;
let interactionText = "";
let textTimer = 0;

// Event listeners for player movement
window.addEventListener("keydown", (e) => {
  console.log("inBuilding: ", inBuilding);
  if (e.key === "ArrowUp") keys.up = true;
  if (e.key === "ArrowDown") keys.down = true;
  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowRight") keys.right = true;
  if (e.key === " ") keys.space = true;
});

window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp") keys.up = false;
  if (e.key === "ArrowDown") keys.down = false;
  if (e.key === "ArrowLeft") keys.left = false;
  if (e.key === "ArrowRight") keys.right = false;
  if (e.key === " ") keys.space = false;
});

class GameObject {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Player extends GameObject {
  constructor(x, y, width, height, color, speed) {
    super(x, y, width, height, color);
    this.speed = speed;
  }

  move() {
    if (keys.up) this.y -= this.speed;
    if (keys.down) this.y += this.speed;
    if (keys.left) this.x -= this.speed;
    if (keys.right) this.x += this.speed;
  }
}

class Building extends GameObject {
  checkEntry(player) {
    return player.x + player.width > this.x && player.x < this.x + this.width && player.y + player.height > this.y && player.y < this.y + this.height && keys.space;
  }
}

class NPC extends GameObject {
  constructor(x, y, width, height, color, message) {
    super(x, y, width, height, color);
    this.message = message;
  }
  interact(player) {
    if (player.x + player.width > this.x && player.x < this.x + this.width && player.y + player.height > this.y && player.y < this.y + this.height && keys.space) {
      console.log("Interaction triggered!");
      interactionText = this.message;
      textTimer = 120;
    }
  }
}

class Machine extends GameObject {
  interact(player) {
    if (player.x + player.width > this.x && player.x < this.x + this.width && player.y + player.height > this.y && player.y < this.y + this.height && keys.space) {
      interactionText = "Beep Boop.";
      textTimer = 120;
    }
  }
}

class Interior {
  constructor(width, height, color) {
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, this.width, this.height);
  }
}

// Initialize objects
const player = new Player(100, 100, 32, 32, "green", 5);
const building = new Building(400, 200, 100, 100, "brown");
const interior = new Interior(canvas.width, canvas.height, "lightgray");
const npcOutside = new NPC(300, 300, 32, 32, "blue", "Welcome to the world.");
const npcInside = new NPC(100, 100, 32, 32, "red", "Welcome to Anatomy Scans.");
const machine = new Machine(400, 300, 50, 50, "gray");

function checkInteractions() {
  if (inBuilding) {
    npcInside.interact(player);
    machine.interact(player);
  } else {
    npcOutside.interact(player);
  }
}

function checkBuildingExit() {
  if (inBuilding && player.y > canvas.height - 40) {
    inBuilding = false;
    player.x = building.x + building.width / 2 - player.width / 2; // Place player outside building
    player.y = building.y + building.height + 10;
  }
}

function drawInteractionText() {
  if (textTimer > 0) {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText(interactionText, canvas.width / 2, 50);
    textTimer--;
  }
}

// Game update loop
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!inBuilding) {
    // Main world logic
    player.move();
    building.draw();
    player.draw();
    npcOutside.draw();

    if (building.checkEntry(player)) {
      inBuilding = true;
      player.x = canvas.width / 2 - player.width / 2; // Reset player position inside
      player.y = canvas.height - 50;
    }
  } else {
    // Inside building logic
    player.move();
    interior.draw();
    player.draw();
    npcInside.draw(); // NPC inside the building
    machine.draw();
    checkInteractions();
    checkBuildingExit();
  }

  drawInteractionText();
  requestAnimationFrame(update);
}

// Start the game loop
update();
