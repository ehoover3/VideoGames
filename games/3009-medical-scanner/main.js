const scanner = document.querySelector(".scanner");
const patientClothedView = document.querySelector(".body-clothed-view");
const patientOrgansView = document.querySelector(".body-organs-view");

const startButton = document.querySelector(".start-button");
const resetButton = document.querySelector(".reset-button");
const progressBar = document.querySelector(".progress-bar");
const progressLabel = document.querySelector(".progress-label");

let isScanning = false;
let isDragging = false;
let maxProgress = 0;

// MAIN FUNCTIONS
function onStart() {
  startScan();
}

function onReset() {
  resetPatientImages();
  resetButtons();
  resetProgressBar();
  maxProgress = 0;
  isScanning = false;
}

function onMouseDown() {
  startScan();
  if (!isScanning && maxProgress < 100) return;
  setCursorStyle(scanner, "grabbing");
  isDragging = true;
}

function onMouseMove(e) {
  if (!isDragging) return;
  const { scannerTop, scannerBottom } = calculateScannerPosition(e);
  moveMachineScanWindow(scannerTop, scannerBottom);
  updateProgressBar(scannerTop, scannerBottom);
}

function onMouseUp() {
  setCursorStyle(scanner, "grab");
  isDragging = false;
}

// HELPER FUNCTIONS
function startScan() {
  if (isScanning) return;
  isScanning = true;
  patientOrgansView.style.opacity = 1;
  startButton.textContent = "SCAN RUNNING";
  startButton.classList.add("disabled");
  resetButton.disabled = true;
  progressBar.style.width = "0";
  progressLabel.textContent = "0%";
  maxProgress = 0;
  moveMachineScanWindow(0, scanner.offsetHeight);
}

function moveMachineScanWindow(scannerTop, scannerBottom) {
  patientClothedView.style.clipPath = `polygon(0 0, 100% 0, 100% ${scannerTop}px, 0 ${scannerTop}px, 0 ${scannerBottom}px, 100% ${scannerBottom}px, 100% 100%, 0 100%)`;
  patientOrgansView.style.clipPath = `inset(${scannerTop}px 0 ${patientClothedView.offsetHeight - scannerBottom}px 0)`;
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

function resetPatientImages() {
  patientOrgansView.style.opacity = 0;
}

function resetButtons() {
  startButton.textContent = "START SCAN";
  startButton.classList.remove("disabled");
  resetButton.disabled = true;
}

function resetProgressBar() {
  progressBar.style.width = "0";
  progressLabel.textContent = "0%";
}

// EVENT LISTENERS
startButton.addEventListener("click", onStart);
resetButton.addEventListener("click", onReset);
scanner.addEventListener("mousedown", () => onMouseDown());
document.addEventListener("mousemove", (e) => onMouseMove(e));
document.addEventListener("mouseup", () => onMouseUp());
