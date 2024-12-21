let score = 0;
document.getElementById("game-button").addEventListener("click", () => {
  score++;
  document.getElementById("score").innerText = `Score: ${score}`;
});
