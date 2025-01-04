// mainMenu.js
export const mainMenuOptions = ["Start New Game", "Load Game", "Settings", "Exit"];

export function drawMainMenu(ctx, canvas, drawText, isGameStarted, selectedOption) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawText("Welcome to the Game", canvas.width / 2, canvas.height / 4, "30px Arial");
  let options = [...mainMenuOptions];
  if (isGameStarted) options[0] = "Return to Game";

  options.forEach((option, index) => {
    drawText(option, canvas.width / 2, canvas.height / 2 + index * 30, "20px Arial", index === selectedOption ? "blue" : "black");
  });
}
