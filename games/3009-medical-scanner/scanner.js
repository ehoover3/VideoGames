// scannerLogic.js

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

    this.initEventListeners();
  }

  initEventListeners() {
    this.dom.scanner.addEventListener("mousedown", (e) => this.onMouseDown(e));
    document.addEventListener("mousemove", (e) => this.onMouseMove(e));
    document.addEventListener("mouseup", () => this.onMouseUp());
    this.dom.resetButton.addEventListener("click", () => this.onReset());
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
    const { patientClothedView, patientOrgansView } = this.dom;
    patientClothedView.style.clipPath = `polygon(
        0 0, 100% 0, 100% ${scannerTop}px, 0 ${scannerTop}px, 
        0 ${scannerBottom}px, 100% ${scannerBottom}px, 100% 100%, 0 100%
      )`;
    patientOrgansView.style.clipPath = `inset(${scannerTop}px 0 ${this.patientHeight - scannerBottom}px 0)`;
  }

  setProgressBar(scannerBottom) {
    const progress = Math.min(100, (scannerBottom / this.patientHeight) * 100);
    if (progress > this.maxProgress) {
      this.maxProgress = progress;
      this.dom.progressBar.style.width = `${this.maxProgress}%`;
      this.dom.progressLabel.textContent = `${Math.round(this.maxProgress)}%`;
    }
    if (this.maxProgress >= 100) this.handleScanComplete();
  }

  setCompleteScan = () => {
    dom.startButton.textContent = "SCAN COMPLETE";
    dom.startButton.classList.add("disabled");
    scanner.isScanning = false;
    quiz.startQuiz();
  };

  handleScanComplete() {
    this.dom.startButton.textContent = "SCAN COMPLETE";
    this.dom.startButton.classList.add("disabled");
    this.isScanning = false;
    this.quiz.setQuizVisible();
  }

  onMouseDown(e) {
    this.isDragging = true;
    this.isScanning = true;
    if (this.dom.startButton.textContent !== "SCAN COMPLETE") {
      this.dom.startButton.textContent = "SCAN RUNNING";
    }
    if (!this.initialScanStart) {
      this.dom.patientOrgansView.style.opacity = 1;
      const { scannerTop, scannerBottom } = this.getScannerPosition(e);
      this.setPatientScanUI(scannerTop, scannerBottom);
      this.initialScanStart = true;
    }
    this.dom.scanner.style.cursor = "grabbing";
  }

  onMouseMove(e) {
    if (!this.isDragging) return;
    const { scannerTop, scannerBottom } = this.getScannerPosition(e);
    this.setPatientScanUI(scannerTop, scannerBottom);
    this.setProgressBar(scannerBottom);
  }

  onMouseUp() {
    this.isDragging = false;
    this.dom.scanner.style.cursor = "grab";
  }

  onReset() {
    this.setPatientScanUI(0, 0);
    this.dom.startButton.textContent = "START SCAN";
    this.dom.startButton.classList.remove("disabled");
    this.dom.patientOrgansView.style.opacity = 0;
    this.dom.progressBar.style.width = "0";
    this.dom.progressLabel.textContent = "0%";
    this.maxProgress = 0;
    this.isScanning = false;
    this.dom.scanner.style.top = "0";
    this.initialScanStart = false;
  }
}

export default ScannerLogic;
