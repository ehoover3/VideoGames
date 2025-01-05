// Zelda-like 2D game with an anatomically correct heart map
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

// Game state
const gameState = {
  player: { x: 400, y: 300, width: 32, height: 32, speed: 4 },
  npcs: [
    // { x: 300, y: 150, width: 32, height: 32, text: "This is the left atrium." },
    // { x: 500, y: 150, width: 32, height: 32, text: "This is the right atrium." },
    // { x: 300, y: 400, width: 32, height: 32, text: "This is the left ventricle." },
    // { x: 500, y: 400, width: 32, height: 32, text: "This is the right ventricle." },
    // { x: 400, y: 100, width: 32, height: 32, text: "This is the aorta." },
    // { x: 400, y: 500, width: 32, height: 32, text: "These are the pulmonary arteries." },
  ],
  dialog: "",
  keys: {},
};

// Handle keyboard input
document.addEventListener("keydown", (e) => {
  gameState.keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
  gameState.keys[e.key] = false;
});

// Helper function to check collision
function isColliding(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

// Draw anatomically correct heart map
function drawHeartMap() {
  // Left atrium
  ctx.fillStyle = "#f5c6cb";
  ctx.beginPath();
  ctx.ellipse(300, 150, 50, 60, Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();

  // Right atrium
  ctx.beginPath();
  ctx.ellipse(500, 150, 50, 60, -Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();

  // Left ventricle
  ctx.beginPath();
  ctx.ellipse(300, 400, 70, 100, Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();

  // Right ventricle
  ctx.beginPath();
  ctx.ellipse(500, 400, 70, 100, -Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();

  // Aorta
  ctx.strokeStyle = "#d9534f";
  ctx.lineWidth = 15;
  ctx.beginPath();
  ctx.moveTo(400, 100);
  ctx.bezierCurveTo(350, 80, 450, 80, 400, 150);
  ctx.stroke();

  // Pulmonary arteries
  ctx.beginPath();
  ctx.moveTo(400, 150);
  ctx.bezierCurveTo(370, 250, 430, 250, 400, 500);
  ctx.stroke();

  // Connecting atria to ventricles
  ctx.lineWidth = 10;
  // Left atrium to left ventricle
  ctx.beginPath();
  ctx.moveTo(300, 210);
  ctx.lineTo(300, 350);
  ctx.stroke();
  // Right atrium to right ventricle
  ctx.beginPath();
  ctx.moveTo(500, 210);
  ctx.lineTo(500, 350);
  ctx.stroke();

  // Labels
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText("Left Atrium", 240, 150);
  ctx.fillText("Right Atrium", 540, 150);
  ctx.fillText("Left Ventricle", 230, 400);
  ctx.fillText("Right Ventricle", 510, 400);
  ctx.fillText("Aorta", 380, 80);
  ctx.fillText("Pulmonary Arteries", 340, 520);
}

// Update game state
function update() {
  const player = gameState.player;
  if (gameState.keys["ArrowUp"]) player.y -= player.speed;
  if (gameState.keys["ArrowDown"]) player.y += player.speed;
  if (gameState.keys["ArrowLeft"]) player.x -= player.speed;
  if (gameState.keys["ArrowRight"]) player.x += player.speed;

  // Interact with NPCs
  if (gameState.keys[" "] || gameState.keys["Enter"]) {
    for (const npc of gameState.npcs) {
      if (isColliding(player, npc)) {
        gameState.dialog = npc.text;
        break;
      }
    }
  } else {
    gameState.dialog = ""; // Clear dialog when not interacting
  }
}

// Render the game
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw heart map
  drawHeartMap();

  // Draw player
  ctx.fillStyle = "blue";
  ctx.fillRect(gameState.player.x, gameState.player.y, gameState.player.width, gameState.player.height);

  // Draw NPCs
  ctx.fillStyle = "green";
  for (const npc of gameState.npcs) {
    ctx.fillRect(npc.x, npc.y, npc.width, npc.height);
  }

  // Draw dialog box
  if (gameState.dialog) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(50, canvas.height - 100, canvas.width - 100, 50);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(gameState.dialog, 70, canvas.height - 70);
  }
}

// Main game loop
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

gameLoop();
