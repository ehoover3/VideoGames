// Get the canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game states
const STATES = {
  MAIN_MENU: "mainMenu",
  OVERWORLD: "overworld",
  SCANNING_GAME: "scanningGame",
};

let currentState = STATES.MAIN_MENU;
let isGameStarted = false;

// Animation configuration
const FRAME_WIDTH = 32,
  FRAME_HEIGHT = 32,
  WALK_FRAMES = 4,
  ATTACK_FRAMES = 4;
let currentFrame = 0,
  animationTimer = 0,
  animationSpeed = 10;
let currentAction = "idle"; // "idle", "walking", "attacking"

// Menu options
const mainMenuOptions = ["Start New Game", "Load Game", "Settings", "Exit"];
let selectedOption = 0;

// Overworld variables
const player = { x: 100, y: 100, width: FRAME_WIDTH, height: FRAME_HEIGHT, speed: 5 };
const machine = { x: 300, y: 200, width: 32, height: 32 };

// Scanning game variables
let scanProgress = 0,
  maxScanProgress = 100,
  scanning = false;
let savedPlayerPosition = { x: player.x, y: player.y };

// Input handling
const keys = {};
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

// Utility function to draw text
function drawText(text, x, y, font = "16px Arial", color = "black", align = "center") {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}

// Draw HUD (Heads Up Display)
function drawHUD() {
  ctx.fillStyle = "lightgray";
  ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

  const hudText = currentState === STATES.OVERWORLD ? "Arrow Keys to Move | Space to Interact | ESC for Main Menu" : "Hold SPACE to Scan | X to Exit to Overworld | ESC for Main Menu";

  drawText(hudText, canvas.width / 2, canvas.height - 20);
}

// Draw Main Menu
function drawMainMenu() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawText("Welcome to the Game", canvas.width / 2, canvas.height / 4, "30px Arial");

  let options = [...mainMenuOptions];
  if (isGameStarted) options[0] = "Return to Game";

  options.forEach((option, index) => {
    drawText(option, canvas.width / 2, canvas.height / 2 + index * 30, "20px Arial", index === selectedOption ? "blue" : "black");
  });
}

// Draw Overworld
function drawOverworld() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.fillStyle = "gray";
  ctx.fillRect(machine.x, machine.y, machine.width, machine.height);

  drawHUD();
}

// Draw Scanning Game
function drawScanningGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw progress bar
  ctx.fillStyle = "lightgray";
  ctx.fillRect((canvas.width - 400) / 2, 250, 400, 50);

  ctx.fillStyle = "green";
  ctx.fillRect((canvas.width - 400) / 2, 250, (scanProgress / maxScanProgress) * 400, 50);

  if (scanProgress >= maxScanProgress) {
    drawText("Scanning Complete! Press SPACE to return.", 250, 350, "20px Arial");
  }

  drawHUD();
}

// Update Overworld state
function updateOverworld() {
  let isMoving = false;

  if (keys["ArrowUp"]) {
    player.y -= player.speed;
    isMoving = true;
  }
  if (keys["ArrowDown"]) {
    player.y += player.speed;
    isMoving = true;
  }
  if (keys["ArrowLeft"]) {
    player.x -= player.speed;
    isMoving = true;
  }
  if (keys["ArrowRight"]) {
    player.x += player.speed;
    isMoving = true;
  }

  // Handle actions
  if (keys["z"] || keys["Z"]) {
    currentAction = "attacking";
  } else if (isMoving) {
    currentAction = "walking";
  } else {
    currentAction = "idle";
  }

  // Animation frame logic
  if (isMoving || currentAction === "attacking") {
    animationTimer++;
    if (animationTimer >= animationSpeed) {
      animationTimer = 0;
      currentFrame++;
      if ((currentAction === "walking" && currentFrame >= WALK_FRAMES) || (currentAction === "attacking" && currentFrame >= ATTACK_FRAMES)) {
        currentFrame = 0;
      }
    }
  } else {
    currentFrame = 0;
  }

  // Handle collision with machine and state transition
  if (isCollidingWithMachine() && keys[" "]) {
    savedPlayerPosition = { x: player.x, y: player.y };
    currentState = STATES.SCANNING_GAME;
  }

  // Exit to main menu
  if (keys["Escape"]) {
    savedPlayerPosition = { x: player.x, y: player.y };
    currentState = STATES.MAIN_MENU;
  }
}

// Check collision with machine
function isCollidingWithMachine() {
  return player.x < machine.x + machine.width && player.x + player.width > machine.x && player.y < machine.y + machine.height && player.y + player.height > machine.y;
}

// Update Scanning Game state
function updateScanningGame() {
  if (keys[" "]) {
    scanning = true;
    if (scanProgress < maxScanProgress) {
      scanProgress++;
    }
  } else {
    scanning = false;
  }

  // Handle returning to overworld or exiting
  if (keys["x"] || keys["X"] || (scanProgress >= maxScanProgress && keys[" "])) {
    currentState = STATES.OVERWORLD;
    player.x = savedPlayerPosition.x;
    player.y = savedPlayerPosition.y;
    scanProgress = 0;
  }

  // Exit to main menu
  if (keys["Escape"]) {
    currentState = STATES.MAIN_MENU;
  }
}

// Update Main Menu state
function updateMainMenu() {
  if (keys["ArrowUp"]) {
    selectedOption = (selectedOption - 1 + mainMenuOptions.length) % mainMenuOptions.length;
    keys["ArrowUp"] = false;
  }
  if (keys["ArrowDown"]) {
    selectedOption = (selectedOption + 1) % mainMenuOptions.length;
    keys["ArrowDown"] = false;
  }

  if (keys["Enter"]) {
    handleMenuSelection();
    keys["Enter"] = false; // Prevent multiple triggers
  }
}

// Handle menu option selection
function handleMenuSelection() {
  const selected = mainMenuOptions[selectedOption];
  switch (selected) {
    case "Start New Game":
    case "Return to Game":
      currentState = STATES.OVERWORLD;
      isGameStarted = true;
      break;
    case "Load Game":
      alert("Load Game functionality is not implemented yet.");
      break;
    case "Settings":
      alert("Settings functionality is not implemented yet.");
      break;
    case "Exit":
      alert("Exiting the game...");
      break;
  }
}

// Game loop
function gameLoop() {
  switch (currentState) {
    case STATES.MAIN_MENU:
      updateMainMenu();
      drawMainMenu();
      break;
    case STATES.OVERWORLD:
      updateOverworld();
      drawOverworld();
      break;
    case STATES.SCANNING_GAME:
      updateScanningGame();
      drawScanningGame();
      break;
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
