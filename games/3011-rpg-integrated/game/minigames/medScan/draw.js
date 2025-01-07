// game/minigames/medScan/draw.js

import { drawText } from "../../draw.js";

function renderScanScreen(ctx, canvas, mriImg, scanProgress, maxScanProgress) {
  clearCanvas(ctx, canvas);
  drawMRIImage(ctx, canvas, mriImg);
  drawProgressBar(ctx, canvas, scanProgress, maxScanProgress);
  if (scanProgress >= maxScanProgress) {
    drawText(ctx, "Scanning Complete! Press SPACE to return.", canvas.width / 2, 350, "center", "20px Arial");
  }
}

function clearCanvas(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export function drawMedScan(ctx, canvas, scanProgress, maxScanProgress) {
  const mriImg = new Image();
  mriImg.src = "assets/images/mri.png";
  mriImg.onload = () => renderScanScreen(ctx, canvas, mriImg, scanProgress, maxScanProgress);
  mriImg.onerror = () => console.error("Failed to load image: mri.png");
}

function drawMRIImage(ctx, canvas, mriImg) {
  const imageWidth = 458;
  const imageHeight = 248;
  const x = (canvas.width - imageWidth) / 2;
  const y = 10;
  ctx.drawImage(mriImg, 0, 0, imageWidth, imageHeight, x, y, imageWidth, imageHeight);
}

function drawProgressBar(ctx, canvas, scanProgress, maxScanProgress) {
  const barWidth = 400;
  const barHeight = 24;
  const x = (canvas.width - barWidth) / 2;
  const y = 270;

  // Draw background bar
  ctx.fillStyle = "lightgray";
  ctx.fillRect(x, y, barWidth, barHeight);

  // Draw progress
  ctx.fillStyle = "#13beec"; // Turquoise blue
  ctx.fillRect(x, y, (scanProgress / maxScanProgress) * barWidth, barHeight);
}
