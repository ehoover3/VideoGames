export function updateMedicalScanGame(keys, scanning, scanProgress, maxScanProgress, currentState, player, previousState, STATES, savedPlayerPosition) {
  if (keys[" "]) {
    scanning = true;
    if (scanProgress < maxScanProgress) {
      scanProgress++;
    }
  } else {
    scanning = false;
  }

  if (keys["x"] || keys["X"] || (scanProgress >= maxScanProgress && keys[" "])) {
    currentState = STATES.OVERWORLD;
    player.x = savedPlayerPosition.x;
    player.y = savedPlayerPosition.y;
    scanProgress = 0;
  }

  if (keys["Escape"]) {
    previousState = currentState;
    currentState = STATES.MAIN_MENU;
  }
}

export function drawMedicalScansGame(ctx, canvas, scanProgress, maxScanProgress) {
  const mriImg = new Image();
  mriImg.src = "assets/images/mri.png";

  mriImg.onload = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const mriImgConfig = {
      image: mriImg,
      sourceImgX: 0,
      sourceImgY: 0,
      sourceImgWidth: 458,
      sourceImgHeight: 248,
      destinationX: (canvas.width - 458) / 2,
      destinationY: 10,
      destinationWidth: 458,
      destinationHeight: 248,
    };

    ctx.drawImage(
      mriImgConfig.image, //
      mriImgConfig.sourceImgX,
      mriImgConfig.sourceImgY,
      mriImgConfig.sourceImgWidth,
      mriImgConfig.sourceImgHeight,
      mriImgConfig.destinationX,
      mriImgConfig.destinationY,
      mriImgConfig.destinationWidth,
      mriImgConfig.destinationHeight
    );

    // Draw progress bar
    ctx.fillStyle = "lightgray";
    ctx.fillRect((canvas.width - 400) / 2, 270, 400, 24);

    const turquoiseBlue = "#13beec";
    ctx.fillStyle = turquoiseBlue;
    ctx.fillRect((canvas.width - 400) / 2, 270, (scanProgress / maxScanProgress) * 400, 24);

    if (scanProgress >= maxScanProgress) {
      drawText("Scanning Complete! Press SPACE to return.", 250, 350, "20px Arial");
    }
  };

  // Handle case when image fails to load
  mriImg.onerror = function () {
    console.error("Failed to load image: mri.png");
  };
}
