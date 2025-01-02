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
    this.setInitialVisibility();
    this.initEventListeners();
  }

  setBackgroundImages() {
    // Female clothed (Top row, first image)
    this.dom.patientFemaleClothed.style.background = "url('bodySystems.png') no-repeat 3px 14px";
    this.dom.patientFemaleClothed.style.backgroundSize = "947px 1283px";

    // Female muscles (Top row, second image)
    this.dom.patientFemaleMuscles.style.background = "url('bodySystems.png') no-repeat -249px 14px";
    this.dom.patientFemaleMuscles.style.backgroundSize = "947px 1283px";

    // Female skeleton (Top row, third image)
    this.dom.patientFemaleSkeleton.style.background = "url('bodySystems.png') no-repeat -500px 14px";
    this.dom.patientFemaleSkeleton.style.backgroundSize = "947px 1283px";

    // Female cardiovascular (Top row, fourth image)
    this.dom.patientFemaleCardiovascular.style.background = "url('bodySystems.png') no-repeat -742px 14px";
    this.dom.patientFemaleCardiovascular.style.backgroundSize = "947px 1283px";

    // Male clothed (Bottom row, first image)
    this.dom.patientMaleClothed.style.background = "url('bodySystems.png') no-repeat -21px -670px";
    this.dom.patientMaleClothed.style.backgroundSize = "947px 1283px";
    this.dom.patientMaleClothed.style.zIndex = 1;

    // Male muscles (Bottom row, second image)
    this.dom.patientMaleMuscles.style.background = "url('bodySystems.png') no-repeat -263px -670px";
    this.dom.patientMaleMuscles.style.backgroundSize = "947px 1283px";

    // Male skeleton (Bottom row, third image)
    this.dom.patientMaleSkeleton.style.background = "url('bodySystems.png') no-repeat -497px -670px";
    this.dom.patientMaleSkeleton.style.backgroundSize = "947px 1283px";

    // Male cardiovascular (Bottom row, fourth image)
    this.dom.patientMaleCardiovascular.style.background = "url('bodySystems.png') no-repeat -727px -670px";
    this.dom.patientMaleCardiovascular.style.backgroundSize = "947px 1283px";
  }

  setInitialVisibility() {
    // Only display the female clothed by default
    this.dom.patientFemaleClothed.style.display = "block";
    this.dom.patientFemaleClothed.style.zIndex = 1;

    this.dom.patientFemaleMuscles.style.display = "block";
    this.dom.patientFemaleSkeleton.style.display = "none";
    this.dom.patientFemaleCardiovascular.style.display = "none";

    this.dom.patientMaleClothed.style.display = "none";
    this.dom.patientMaleMuscles.style.display = "none";
    this.dom.patientMaleSkeleton.style.display = "none";
    this.dom.patientMaleCardiovascular.style.display = "none";
  }

  initEventListeners() {
    this.dom.scanner.addEventListener("mousedown", this.onMouseDown.bind(this));
    document.addEventListener("mousemove", this.onMouseMove.bind(this));
    document.addEventListener("mouseup", this.onMouseUp.bind(this));
    this.dom.resetButton.addEventListener("click", this.onReset.bind(this));

    const genderSelect = document.getElementById("gender-select");
    const scanTypeSelect = document.getElementById("scan-type-select");
    genderSelect.addEventListener("change", this.onSelectionChange.bind(this));
    scanTypeSelect.addEventListener("change", this.onSelectionChange.bind(this));
  }

  onSelectionChange() {
    const gender = document.getElementById("gender-select").value;
    const scanType = document.getElementById("scan-type-select").value;

    this.updatePatientVisibility(gender, scanType);
  }

  updatePatientVisibility(gender, scanType) {
    console.log(gender);
    console.log(scanType);

    if (gender === "female" && scanType === "muscles") {
      this.dom.patientFemaleClothed.style.display = "block";
      this.dom.patientFemaleMuscles.style.display = "block";
      this.dom.patientFemaleSkeleton.style.display = "none";
      this.dom.patientFemaleCardiovascular.style.display = "none";
      this.dom.patientMaleClothed.style.display = "none";
      this.dom.patientMaleMuscles.style.display = "none";
      this.dom.patientMaleSkeleton.style.display = "none";
      this.dom.patientMaleCardiovascular.style.display = "none";
      this.dom.patientFemaleClothed.style.zIndex = 1;
    }
    if (gender === "female" && scanType === "skeleton") {
      this.dom.patientFemaleClothed.style.display = "block";
      this.dom.patientFemaleMuscles.style.display = "none";
      this.dom.patientFemaleSkeleton.style.display = "block";
      this.dom.patientFemaleCardiovascular.style.display = "none";
      this.dom.patientMaleClothed.style.display = "none";
      this.dom.patientMaleMuscles.style.display = "none";
      this.dom.patientMaleSkeleton.style.display = "none";
      this.dom.patientMaleCardiovascular.style.display = "none";
      this.dom.patientFemaleClothed.style.zIndex = 1;
    }
    if (gender === "female" && scanType === "cardiovascular") {
      this.dom.patientFemaleClothed.style.display = "block";
      this.dom.patientFemaleMuscles.style.display = "none";
      this.dom.patientFemaleSkeleton.style.display = "none";
      this.dom.patientFemaleCardiovascular.style.display = "block";
      this.dom.patientMaleClothed.style.display = "none";
      this.dom.patientMaleMuscles.style.display = "none";
      this.dom.patientMaleSkeleton.style.display = "none";
      this.dom.patientMaleCardiovascular.style.display = "none";
      this.dom.patientFemaleClothed.style.zIndex = 1;
    }
    if (gender === "male" && scanType === "muscles") {
      this.dom.patientFemaleClothed.style.display = "none";
      this.dom.patientFemaleMuscles.style.display = "none";
      this.dom.patientFemaleSkeleton.style.display = "none";
      this.dom.patientFemaleCardiovascular.style.display = "none";
      this.dom.patientMaleClothed.style.display = "block";
      this.dom.patientMaleMuscles.style.display = "block";
      this.dom.patientMaleSkeleton.style.display = "none";
      this.dom.patientMaleCardiovascular.style.display = "none";
      this.dom.patientMaleClothed.style.zIndex = 1;
    }
    if (gender === "male" && scanType === "skeleton") {
      this.dom.patientFemaleClothed.style.display = "none";
      this.dom.patientFemaleMuscles.style.display = "none";
      this.dom.patientFemaleSkeleton.style.display = "none";
      this.dom.patientFemaleCardiovascular.style.display = "none";
      this.dom.patientMaleClothed.style.display = "block";
      this.dom.patientMaleMuscles.style.display = "none";
      this.dom.patientMaleSkeleton.style.display = "block";
      this.dom.patientMaleCardiovascular.style.display = "none";
      this.dom.patientMaleClothed.style.zIndex = 1;
    }
    if (gender === "male" && scanType === "cardiovascular") {
      this.dom.patientFemaleClothed.style.display = "none";
      this.dom.patientFemaleMuscles.style.display = "none";
      this.dom.patientFemaleSkeleton.style.display = "none";
      this.dom.patientFemaleCardiovascular.style.display = "none";
      this.dom.patientMaleClothed.style.display = "block";
      this.dom.patientMaleMuscles.style.display = "none";
      this.dom.patientMaleSkeleton.style.display = "none";
      this.dom.patientMaleCardiovascular.style.display = "block";
      this.dom.patientMaleClothed.style.zIndex = 1;
    }
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
    const gender = document.getElementById("gender-select").value;
    const scanType = document.getElementById("scan-type-select").value;

    if (gender === "female") {
      if (scanType === "muscles") {
        this.dom.patientFemaleClothed.style.clipPath = this.getClipPath(scannerTop, scannerBottom);
        this.dom.patientFemaleMuscles.style.clipPath = `inset(${scannerTop}px 0 ${this.patientHeight - scannerBottom}px 0)`;
      } else if (scanType === "skeleton") {
        this.dom.patientFemaleClothed.style.clipPath = this.getClipPath(scannerTop, scannerBottom);
        this.dom.patientFemaleSkeleton.style.clipPath = `inset(${scannerTop}px 0 ${this.patientHeight - scannerBottom}px 0)`;
      } else if (scanType === "cardiovascular") {
        this.dom.patientFemaleClothed.style.clipPath = this.getClipPath(scannerTop, scannerBottom);
        this.dom.patientFemaleCardiovascular.style.clipPath = `inset(${scannerTop}px 0 ${this.patientHeight - scannerBottom}px 0)`;
      }
    } else if (gender === "male") {
      if (scanType === "muscles") {
        this.dom.patientMaleClothed.style.clipPath = this.getClipPath(scannerTop, scannerBottom);
        this.dom.patientMaleMuscles.style.clipPath = `inset(${scannerTop}px 0 ${this.patientHeight - scannerBottom}px 0)`;
      } else if (scanType === "skeleton") {
        this.dom.patientMaleClothed.style.clipPath = this.getClipPath(scannerTop, scannerBottom);
        this.dom.patientMaleSkeleton.style.clipPath = `inset(${scannerTop}px 0 ${this.patientHeight - scannerBottom}px 0)`;
      } else if (scanType === "cardiovascular") {
        this.dom.patientMaleClothed.style.clipPath = this.getClipPath(scannerTop, scannerBottom);
        this.dom.patientMaleCardiovascular.style.clipPath = `inset(${scannerTop}px 0 ${this.patientHeight - scannerBottom}px 0)`;
      }
    }
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
