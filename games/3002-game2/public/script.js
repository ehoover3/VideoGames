const numberToGuess = Math.floor(Math.random() * 100) + 1;

document.getElementById("submit-guess").addEventListener("click", () => {
  const guess = parseInt(document.getElementById("guess").value);
  const result = document.getElementById("result");

  if (guess === numberToGuess) {
    result.innerText = "🎉 Correct! You guessed the number!";
  } else if (guess > numberToGuess) {
    result.innerText = "Too high. Try again!";
  } else {
    result.innerText = "Too low. Try again!";
  }
});
