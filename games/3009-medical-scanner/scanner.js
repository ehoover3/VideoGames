// scannerLogic.js
const START_SCAN = "START SCAN";
const SCAN_RUNNING = "SCAN RUNNING";
const SCAN_COMPLETE = "SCAN COMPLETE";
const SCANNER_GRAB = "grab";
const SCANNER_GRABBING = "grabbing";
const MAX_PROGRESS = 100;

class ScannerLogic {
  constructor(dom, quiz) {
    this.dom = dom;
    this.quiz = quiz;
    this.isDragging = false;
    this.isScanning = false;
    this.maxProgress = 0;
    this.initialScanStart = false;

    this.patientRectangle = this.dom.patient.getBoundingClientRect();
    this.patientHeight = this.patientRectangle.height;
    this.scannerHeight = this.dom.scanner.offsetHeight;

    this.setBackgroundImages();
    this.initEventListeners();
  }

  setBackgroundImages() {
    // Female clothed (Top row, first image)
    this.dom.patientFemaleClothed.style.background = "url('bodySystems.png') no-repeat 60px 0px";
    this.dom.patientFemaleClothed.style.backgroundSize = "947px 1283px";
    this.dom.patientFemaleClothed.style.zIndex = 1;

    // Female muscles (Top row, second image)
    this.dom.patientFemaleMuscles.style.background = "url('bodySystems.png') no-repeat -193px 0px";
    this.dom.patientFemaleMuscles.style.backgroundSize = "947px 1283px";

    // Female skeleton (Top row, third image)
    this.dom.patientFemaleSkeleton.style.background = "url('bodySystems.png') no-repeat -443px 0px";
    this.dom.patientFemaleSkeleton.style.backgroundSize = "947px 1283px";
    this.dom.patientFemaleSkeleton.style.display = "none";

    // Female cardiovascular (Top row, fourth image)
    this.dom.patientFemaleCardiovascular.style.background = "url('bodySystems.png') no-repeat -687px 0px";
    this.dom.patientFemaleCardiovascular.style.backgroundSize = "947px 1283px";
    // this.dom.patientFemaleCardiovascular.style.display = "none";

    // Male clothed (Bottom row, first image)
    this.dom.patientmaleClothed.style.background = "url('bodySystems.png') no-repeat 0px -642px";
    this.dom.patientmaleClothed.style.backgroundSize = "947px 1283px";
    this.dom.patientmaleClothed.style.display = "none";

    // Male muscles (Bottom row, second image)
    this.dom.patientmaleMuscles.style.background = "url('bodySystems.png') no-repeat -237px -642px";
    this.dom.patientmaleMuscles.style.backgroundSize = "947px 1283px";
    this.dom.patientmaleMuscles.style.display = "none";

    // Male skeleton (Bottom row, third image)
    this.dom.patientmaleSkeleton.style.background = "url('bodySystems.png') no-repeat -474px -642px";
    this.dom.patientmaleSkeleton.style.backgroundSize = "947px 1283px";
    this.dom.patientmaleSkeleton.style.display = "none";

    // Male cardiovascular (Bottom row, fourth image)
    this.dom.patientmaleCardiovascular.style.background = "url('bodySystems.png') no-repeat -711px -642px";
    this.dom.patientmaleCardiovascular.style.backgroundSize = "947px 1283px";
    this.dom.patientmaleCardiovascular.style.display = "none";
  }

  initEventListeners() {
    this.dom.scanner.addEventListener("mousedown", this.onMouseDown.bind(this));
    document.addEventListener("mousemove", this.onMouseMove.bind(this));
    document.addEventListener("mouseup", this.onMouseUp.bind(this));
    this.dom.resetButton.addEventListener("click", this.onReset.bind(this));
  }

  getScannerPosition(e) {
    let scannerY = e.clientY - this.patientRectangle.top - this.scannerHeight / 2;
    scannerY = Math.max(0, Math.min(scannerY, this.patientHeight - this.scannerHeight));
    this.dom.scanner.style.top = `${scannerY}px`;
    return {
      scannerTop: scannerY,
      scannerBottom: scannerY + this.scannerHeight,
    };
  }

  setPatientScanUI(scannerTop, scannerBottom) {
    const { patientFemaleClothed, patientFemaleMuscles } = this.dom;
    patientFemaleClothed.style.clipPath = this.getClipPath(scannerTop, scannerBottom);
    patientFemaleMuscles.style.clipPath = `inset(${scannerTop}px 0 ${this.patientHeight - scannerBottom}px 0)`;
  }

  getClipPath(scannerTop, scannerBottom) {
    return `polygon(
      0 0, 100% 0, 100% ${scannerTop}px, 0 ${scannerTop}px, 
      0 ${scannerBottom}px, 100% ${scannerBottom}px, 100% 100%, 0 100%
    )`;
  }

  setProgressBar(scannerBottom) {
    const progress = Math.min(100, (scannerBottom / this.patientHeight) * 100);
    if (progress > this.maxProgress) {
      this.maxProgress = progress;
      this.updateProgressUI();
    }
    if (this.maxProgress >= MAX_PROGRESS) this.handleScanComplete();
  }

  updateProgressUI() {
    this.dom.progressBar.style.width = `${this.maxProgress}%`;
    this.dom.progressLabel.textContent = `${Math.round(this.maxProgress)}%`;
  }

  handleScanComplete() {
    this.dom.startButton.textContent = SCAN_COMPLETE;
    this.dom.startButton.classList.add("disabled");
    this.isScanning = false;
    this.quiz.setQuizVisible();
  }

  onMouseDown(e) {
    this.isDragging = true;
    this.isScanning = true;
    if (this.dom.startButton.textContent !== SCAN_COMPLETE) {
      this.dom.startButton.textContent = SCAN_RUNNING;
    }
    if (!this.initialScanStart) {
      this.dom.patientFemaleMuscles.style.opacity = 1;
      const { scannerTop, scannerBottom } = this.getScannerPosition(e);
      this.setPatientScanUI(scannerTop, scannerBottom);
      this.initialScanStart = true;
    }
    this.dom.scanner.style.cursor = SCANNER_GRABBING;
  }

  onMouseMove(e) {
    if (!this.isDragging) return;
    const { scannerTop, scannerBottom } = this.getScannerPosition(e);
    this.setPatientScanUI(scannerTop, scannerBottom);
    this.setProgressBar(scannerBottom);
  }

  onMouseUp() {
    this.isDragging = false;
    this.dom.scanner.style.cursor = SCANNER_GRAB;
  }

  onReset() {
    this.resetScanUI();
    this.dom.startButton.textContent = START_SCAN;
    this.dom.startButton.classList.remove("disabled");
    this.dom.patientFemaleMuscles.style.opacity = 0;
    this.dom.progressBar.style.width = "0";
    this.dom.progressLabel.textContent = "0%";
    this.maxProgress = 0;
    this.isScanning = false;
    this.dom.scanner.style.top = "0";
    this.initialScanStart = false;
  }

  resetScanUI() {
    this.setPatientScanUI(0, 0);
  }
}

export default ScannerLogic;
