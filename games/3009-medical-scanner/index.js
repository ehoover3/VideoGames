import { patient, patientClothedView, patientOrgansView, scanner, startButton, resetButton, progressBar, progressLabel } from "./domElements.js";

const patientRectangle = patient.getBoundingClientRect();
const patientHeight = patientRectangle.height;
const scannerHeight = scanner.offsetHeight;

let isScanning = false;
let isDragging = false;
let maxProgress = 0;

// MAIN FUNCTIONS
function onMouseDown() {
  updateStartButtonText();
  showAnatomicalLayer();
  updatePatientScanUI(0, scanner.offsetHeight);
  isScanning = true;
  maxProgress = 0;
  if (!isScanning && maxProgress < 100) return;
  setCursorStyle(scanner, "grabbing");
  isDragging = true;
  document.addEventListener("mousemove", (e) => onMouseMove(e));
  document.addEventListener("mouseup", () => onMouseUp());
}

function onMouseMove(e) {
  if (!isDragging || e.clientY == null) return;
  const { scannerTop, scannerBottom } = calculateScannerPosition(e);
  updatePatientScanUI(scannerTop, scannerBottom);
  updateProgressBar(scannerTop, scannerBottom);
}

function onMouseUp() {
  setCursorStyle(scanner, "grab");
  isDragging = false;
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
}

function onReset() {
  updatePatientScanUI(0, 0);
  resetPatientImages();
  resetButtons();
  resetProgressBar();
  scanner.style.top = "0";
  maxProgress = 0;
  isScanning = false;
}

// HELPER FUNCTIONS
function showAnatomicalLayer() {
  patientOrgansView.style.opacity = 1;
}

function updateStartButtonText() {
  startButton.textContent = "SCAN RUNNING";
}

function updatePatientScanUI(scannerTop, scannerBottom) {
  const topLeft = "0 0";
  const topRight = "100% 0";
  const scannerTopRight = `100% ${scannerTop}px`;
  const scannerTopLeft = `0 ${scannerTop}px`;
  const scannerBottomLeft = `0 ${scannerBottom}px`;
  const scannerBottomRight = `100% ${scannerBottom}px`;
  const bottomRight = "100% 100%";
  const bottomLeft = "0 100%";

  patientClothedView.style.clipPath = `polygon(
    ${topLeft},
    ${topRight},
    ${scannerTopRight},
    ${scannerTopLeft},
    ${scannerBottomLeft},
    ${scannerBottomRight},
    ${bottomRight},
    ${bottomLeft}
  )`;

  const rectangleTop = `${scannerTop}px`;
  const rectangleBottom = `${patientClothedView.offsetHeight - scannerBottom}px`;
  patientOrgansView.style.clipPath = `inset(${rectangleTop} 0 ${rectangleBottom} 0)`;
}

function updateProgressBar(scannerTop, scannerBottom) {
  const progress = Math.min(100, (scannerBottom / patientHeight) * 100);
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
  isScanning = false;
}

function calculateScannerPosition(e) {
  let scannerPositionY = e.clientY - patientRectangle.top - scannerHeight / 2;
  scannerPositionY = Math.max(0, Math.min(scannerPositionY, patientHeight - scannerHeight));
  scanner.style.top = `${scannerPositionY}px`;
  return {
    scannerTop: scannerPositionY,
    scannerBottom: scannerPositionY + scannerHeight,
  };
}

function setCursorStyle(element, style) {
  const VALID_STYLES = ["grabbing", "grab"];
  if (element && VALID_STYLES.includes(style)) element.style.cursor = style;
  else console.warn(`Invalid cursor style: "${style}"`);
}

function resetPatientImages() {
  patientOrgansView.style.opacity = 0;
}

function resetButtons() {
  startButton.textContent = "START SCAN";
  startButton.classList.remove("disabled");
}

function resetProgressBar() {
  progressBar.style.width = "0";
  progressLabel.textContent = "0%";
  maxProgress = 0;
}

// EVENT LISTENERS
// startButton.addEventListener("click", onStart);
resetButton.addEventListener("click", () => onReset());
scanner.addEventListener("mousedown", () => onMouseDown());
