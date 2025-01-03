const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let currentState = "mainMenu"; // "mainMenu", "overworld", or "scanningGame"
let isGameStarted = false; // Tracks if the game has been started or is in progress

// Menu options and navigation
let mainMenuOptions = ["Start New Game", "Load Game", "Settings", "Exit"];
let selectedOption = 0;

// Overworld variables
const player = { x: 100, y: 100, width: 30, height: 30, speed: 5 };
const machine = { x: 300, y: 200, width: 50, height: 50 };

// Save player position to return after menu or mini-game
let savedPlayerPosition = { x: player.x, y: player.y };

// Scanning game variables
let scanProgress = 0;
const maxScanProgress = 100;
let scanning = false;

function drawHUD() {
  ctx.fillStyle = "lightgray";
  ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

  ctx.fillStyle = "black";
  ctx.font = "16px Arial";

  if (currentState === "overworld") {
    ctx.fillText("Arrow Keys to Move | Space to Interact | ESC for Main Menu", canvas.width / 2, canvas.height - 20);
  } else if (currentState === "scanningGame") {
    ctx.fillText("Hold SPACE to Scan | X to Exit to Overworld | ESC for Main Menu", canvas.width / 2, canvas.height - 20);
  }
}

function drawMainMenu() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Welcome to the Game", canvas.width / 2, canvas.height / 4);

  // Update menu options dynamically
  let options = [...mainMenuOptions];
  if (isGameStarted) {
    options[0] = "Return to Game"; // Change "Start New Game" to "Return to Game"
  }

  // Draw menu options
  ctx.font = "20px Arial";
  options.forEach((option, index) => {
    ctx.fillStyle = index === selectedOption ? "blue" : "black";
    ctx.fillText(option, canvas.width / 2, canvas.height / 2 + index * 30);
  });
}

function drawOverworld() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw machine
  ctx.fillStyle = "gray";
  ctx.fillRect(machine.x, machine.y, machine.width, machine.height);

  drawHUD();
}

function drawScanningGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw progress bar
  ctx.fillStyle = "lightgray";
  ctx.fillRect((canvas.width - 400) / 2, 250, 400, 50);

  ctx.fillStyle = "green";
  ctx.fillRect((canvas.width - 400) / 2, 250, (scanProgress / maxScanProgress) * 400, 50);

  // Instruction text
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";

  if (scanProgress >= maxScanProgress) {
    ctx.fillText("Scanning Complete! Press SPACE to return.", 250, 350);
  }

  drawHUD();
}

function updateOverworld() {
  if (keys["ArrowUp"]) player.y -= player.speed;
  if (keys["ArrowDown"]) player.y += player.speed;
  if (keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["ArrowRight"]) player.x += player.speed;

  // Collision detection with the machine
  if (player.x < machine.x + machine.width && player.x + player.width > machine.x && player.y < machine.y + machine.height && player.y + player.height > machine.y && keys[" "]) {
    // Save current player position before entering scanning game
    savedPlayerPosition = { x: player.x, y: player.y };
    currentState = "scanningGame";
  }

  // Exit to main menu
  if (keys["Escape"]) {
    savedPlayerPosition = { x: player.x, y: player.y }; // Save position
    currentState = "mainMenu";
  }
}

function updateScanningGame() {
  if (keys[" "]) {
    scanning = true;
    if (scanProgress < maxScanProgress) {
      scanProgress += 1;
    }
  } else {
    scanning = false;
  }

  // Return to overworld with X key
  if (keys["x"] || keys["X"]) {
    currentState = "overworld";
    player.x = savedPlayerPosition.x;
    player.y = savedPlayerPosition.y; // Return to saved position
    scanProgress = 0; // Reset scanning progress
  }

  // Exit to overworld after scanning complete
  if (scanProgress >= maxScanProgress && keys[" "]) {
    currentState = "overworld";
    player.x = savedPlayerPosition.x;
    player.y = savedPlayerPosition.y; // Return to saved position
    scanProgress = 0; // Reset scanning progress
  }

  // Exit to main menu
  if (keys["Escape"]) {
    currentState = "mainMenu";
  }
}

function updateMainMenu() {
  if (keys["ArrowUp"]) {
    selectedOption = (selectedOption - 1 + mainMenuOptions.length) % mainMenuOptions.length;
    keys["ArrowUp"] = false; // Prevent continuous scrolling
  }
  if (keys["ArrowDown"]) {
    selectedOption = (selectedOption + 1) % mainMenuOptions.length;
    keys["ArrowDown"] = false; // Prevent continuous scrolling
  }

  if (keys["Enter"]) {
    if (mainMenuOptions[selectedOption] === "Start New Game" || mainMenuOptions[selectedOption] === "Return to Game") {
      currentState = "overworld";
      isGameStarted = true;
    } else if (mainMenuOptions[selectedOption] === "Load Game") {
      alert("Load Game functionality is not implemented yet.");
    } else if (mainMenuOptions[selectedOption] === "Settings") {
      alert("Settings functionality is not implemented yet.");
    } else if (mainMenuOptions[selectedOption] === "Exit") {
      alert("Exiting the game...");
    }
    keys["Enter"] = false; // Prevent multiple triggers
  }
}

function gameLoop() {
  if (currentState === "mainMenu") {
    updateMainMenu();
    drawMainMenu();
  } else if (currentState === "overworld") {
    updateOverworld();
    drawOverworld();
  } else if (currentState === "scanningGame") {
    updateScanningGame();
    drawScanningGame();
  }

  requestAnimationFrame(gameLoop);
}

// Input handling
const keys = {};
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

// Start game loop
gameLoop();
