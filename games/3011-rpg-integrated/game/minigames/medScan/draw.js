// // game/minigames/medScan/draw.js

// import { drawText } from "../../draw/utils.js";

// export function drawMinigame({ canvas, ctx, gameState }) {
//   let { scanProgress, maxScanProgress } = gameState;

//   const mriImg = new Image();
//   mriImg.src = "assets/images/mri.png";
//   mriImg.onload = () => drawScanScreen(canvas, ctx, mriImg, scanProgress, maxScanProgress);
//   mriImg.onerror = () => console.error("Failed to load image: mri.png");
// }

// function drawScanScreen(canvas, ctx, mriImg, scanProgress, maxScanProgress) {
//   clearCanvas(canvas, ctx);
//   drawMRIImage(canvas, ctx, mriImg);
//   drawProgressBar(canvas, ctx, scanProgress, maxScanProgress);
//   if (scanProgress >= maxScanProgress) {
//     drawText(ctx, "Scanning Complete! Press SPACE to return.", canvas.width / 2, 350, "center", "20px Arial");
//   }
// }

// function clearCanvas(canvas, ctx) {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
// }

// function drawMRIImage(canvas, ctx, mriImg) {
//   const imageWidth = 458;
//   const imageHeight = 248;
//   const x = (canvas.width - imageWidth) / 2;
//   const y = 10;
//   ctx.drawImage(mriImg, 0, 0, imageWidth, imageHeight, x, y, imageWidth, imageHeight);
// }

// function drawProgressBar(canvas, ctx, scanProgress, maxScanProgress) {
//   const barWidth = 400;
//   const barHeight = 24;
//   const x = (canvas.width - barWidth) / 2;
//   const y = 270;

//   // Draw background bar
//   ctx.fillStyle = "lightgray";
//   ctx.fillRect(x, y, barWidth, barHeight);

//   // Draw progress
//   ctx.fillStyle = "#13beec"; // Turquoise blue
//   ctx.fillRect(x, y, (scanProgress / maxScanProgress) * barWidth, barHeight);
// }

import { drawText } from "../../draw/utils.js";

export function drawMinigame({ canvas, ctx, gameState }) {
  let { scanProgress, maxScanProgress } = gameState;

  const mriImg = new Image();
  mriImg.src = "assets/images/mri.png";
  mriImg.onload = () => drawScanScreen(canvas, ctx, mriImg, scanProgress, maxScanProgress);
  mriImg.onerror = () => console.error("Failed to load image: mri.png");
}

function drawScanScreen(canvas, ctx, mriImg, scanProgress, maxScanProgress) {
  clearCanvas(canvas, ctx);

  // Scale the image, progress bar, and text based on canvas size
  drawMRIImage(canvas, ctx, mriImg);
  drawProgressBar(canvas, ctx, scanProgress, maxScanProgress);

  if (scanProgress >= maxScanProgress) {
    const scaledFontSize = Math.max(20 * (canvas.height / 360), 20) + "px Arial"; // Scale font size
    drawText(ctx, "Scanning Complete! Press SPACE to return.", canvas.width / 2, 350 * (canvas.height / 360), "center", scaledFontSize);
  }
}

function clearCanvas(canvas, ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawMRIImage(canvas, ctx, mriImg) {
  const baseWidth = 458; // Base size for MRI image
  const baseHeight = 248; // Base size for MRI image
  const scaleX = canvas.width / 640; // Assuming base resolution is 640x360
  const scaleY = canvas.height / 360;

  // Scale image width and height based on canvas size
  const imageWidth = baseWidth * scaleX;
  const imageHeight = baseHeight * scaleY;
  const x = (canvas.width - imageWidth) / 2;
  const y = 10 * scaleY; // Adjust vertical position

  ctx.drawImage(mriImg, 0, 0, baseWidth, baseHeight, x, y, imageWidth, imageHeight);
}

function drawProgressBar(canvas, ctx, scanProgress, maxScanProgress) {
  const scaleX = canvas.width / 640; // Base scaling factor (adjust based on base resolution)
  const scaleY = canvas.height / 360;

  const baseBarWidth = 400; // Base width of progress bar
  const baseBarHeight = 24; // Base height of progress bar
  const barWidth = baseBarWidth * scaleX; // Scaled width
  const barHeight = baseBarHeight * scaleY; // Scaled height

  const x = (canvas.width - barWidth) / 2;
  const y = 270 * scaleY; // Adjust vertical position

  // Draw background bar
  ctx.fillStyle = "lightgray";
  ctx.fillRect(x, y, barWidth, barHeight);

  // Draw progress
  ctx.fillStyle = "#13beec"; // Turquoise blue
  ctx.fillRect(x, y, (scanProgress / maxScanProgress) * barWidth, barHeight);
}
