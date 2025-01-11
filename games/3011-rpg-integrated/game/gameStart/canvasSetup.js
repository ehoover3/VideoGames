// game/gameStart/canvasSetup.js

export function setupCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  return { canvas, ctx };
}
