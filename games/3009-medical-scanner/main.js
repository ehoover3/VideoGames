const scanner = document.querySelector(".scanner");
const bodySkin = document.querySelector(".body-skin");
const bodyBones = document.querySelector(".body-bones");
const startButton = document.querySelector(".start-button");
const resetButton = document.querySelector(".reset-button");
const progressBar = document.querySelector(".progress-bar");
const progressLabel = document.querySelector(".progress-label");

let isDragging = false;
let isScanning = false;
let maxProgress = 0;

// HELPER FUNCTIONS
function startScan() {
  if (isScanning) return;
  isScanning = true;
  bodyBones.style.opacity = 1;
  startButton.textContent = "SCAN RUNNING";
  startButton.classList.add("disabled");
  resetButton.disabled = true;
  progressBar.style.width = "0";
  progressLabel.textContent = "0%";
  maxProgress = 0;
  moveMachineScanWindow(0, scanner.offsetHeight);
}

function moveMachineScanWindow(scannerTop, scannerBottom) {
  bodySkin.style.clipPath = `polygon(0 0, 100% 0, 100% ${scannerTop}px, 0 ${scannerTop}px, 0 ${scannerBottom}px, 100% ${scannerBottom}px, 100% 100%, 0 100%)`;
  bodyBones.style.clipPath = `inset(${scannerTop}px 0 ${bodySkin.offsetHeight - scannerBottom}px 0)`;
}

function updateProgressBar(scannerTop, scannerBottom) {
  const container = document.querySelector(".container");
  const progress = Math.min(100, (scannerBottom / container.clientHeight) * 100);
  if (progress > maxProgress) {
    maxProgress = progress;
    progressBar.style.width = `${maxProgress}%`;
    progressLabel.textContent = `${Math.round(maxProgress)}%`;
  }
  if (maxProgress >= 100) {
    handleScanComplete();
  }
}

function handleScanComplete() {
  startButton.textContent = "SCAN COMPLETE";
  startButton.classList.add("disabled");
  resetButton.disabled = false;
  isScanning = false;
}

function resetScan() {
  bodyBones.style.opacity = 0;
  startButton.textContent = "START SCAN";
  startButton.classList.remove("disabled");
  resetButton.disabled = true;
  progressBar.style.width = "0";
  progressLabel.textContent = "0%";
  maxProgress = 0;
  isScanning = false;
}

function calculateScannerPosition(e) {
  const container = document.querySelector(".container");
  const rect = container.getBoundingClientRect();
  const containerHeight = rect.height;
  const scannerHeight = scanner.offsetHeight;
  let scannerPositionY = e.clientY - rect.top - scannerHeight / 2;
  scannerPositionY = Math.max(0, Math.min(scannerPositionY, containerHeight - scannerHeight));
  scanner.style.top = `${scannerPositionY}px`;
  return {
    scannerTop: scannerPositionY,
    scannerBottom: scannerPositionY + scannerHeight,
  };
}

function setCursorStyle(element, style) {
  const validStyles = ["grabbing", "grab"];
  if (element && validStyles.includes(style)) {
    element.style.cursor = style;
  } else {
    console.warn(`Invalid cursor style: "${style}". Use "grabbing" or "grab" only.`);
  }
}

// EVENT LISTENERS
scanner.addEventListener("mousedown", () => {
  if (!isScanning && maxProgress < 100) return;
  isDragging = true;
  setCursorStyle(scanner, "grabbing");
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  const { scannerTop, scannerBottom } = calculateScannerPosition(e);
  moveMachineScanWindow(scannerTop, scannerBottom);
  updateProgressBar(scannerTop, scannerBottom);
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  setCursorStyle(scanner, "grab");
});

startButton.addEventListener("click", startScan);
resetButton.addEventListener("click", resetScan);
