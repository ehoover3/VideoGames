const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

const player = {
  x: 100,
  y: 100,
  width: 32,
  height: 32,
  color: "green",
  speed: 5,
};

const building = {
  x: 400,
  y: 200,
  width: 100,
  height: 100,
  color: "brown",
};

const interior = {
  width: canvas.width,
  height: canvas.height,
  color: "lightgray",
};

const npc = {
  x: 300,
  y: 300,
  width: 32,
  height: 32,
  color: "blue",
};

const keys = {
  up: false,
  down: false,
  left: false,
  right: false,
  space: false,
};

let inBuilding = false;

// Event listeners for player movement
window.addEventListener("keydown", (e) => {
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

// Draw the player
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw the NPC
function drawNpc() {
  ctx.fillStyle = npc.color;
  ctx.fillRect(npc.x, npc.y, npc.width, npc.height);
}

// Draw the building
function drawBuilding() {
  ctx.fillStyle = building.color;
  ctx.fillRect(building.x, building.y, building.width, building.height);
}

// Draw the interior
function drawInterior() {
  ctx.fillStyle = interior.color;
  ctx.fillRect(0, 0, interior.width, interior.height);
}

// Check if player enters the building
function checkBuildingEntry() {
  if (player.x + player.width > building.x && player.x < building.x + building.width && player.y + player.height > building.y && player.y < building.y + building.height && keys.space) {
    inBuilding = true;
    player.x = canvas.width / 2 - player.width / 2; // Reset player position inside
    player.y = canvas.height - 50;
  }
}

// Check if player exits the building
function checkBuildingExit() {
  if (inBuilding && player.y > canvas.height - 40) {
    inBuilding = false;
    player.x = building.x + building.width / 2 - player.width / 2; // Place player outside building
    player.y = building.y + building.height + 10;
  }
}

// Game update loop
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!inBuilding) {
    // Main world logic
    if (keys.up) player.y -= player.speed;
    if (keys.down) player.y += player.speed;
    if (keys.left) player.x -= player.speed;
    if (keys.right) player.x += player.speed;

    drawBuilding();
    drawPlayer();
    drawNpc();
    checkBuildingEntry();
  } else {
    // Inside building logic
    if (keys.up) player.y -= player.speed;
    if (keys.down) player.y += player.speed;
    if (keys.left) player.x -= player.speed;
    if (keys.right) player.x += player.speed;

    drawInterior();
    drawPlayer();
    checkBuildingExit();
  }

  requestAnimationFrame(update);
}

// Start the game loop
update();
