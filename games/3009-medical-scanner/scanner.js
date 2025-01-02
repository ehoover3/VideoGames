// scannerLogic.js
const START_SCAN = "START SCAN";
const SCAN_RUNNING = "SCAN RUNNING";
const SCAN_COMPLETE = "SCAN COMPLETE";
const SCANNER_GRAB = "grab";
const SCANNER_GRABBING = "grabbing";
const MAX_PROGRESS = 100;
const imageUrl = "url('bodySystems.png')";
const backgroundSize = "947px 1283px";
const imagesConfig = {
  female: {
    clothed: { x: 3, y: 14 },
    muscles: { x: -249, y: 14 },
    skeleton: { x: -500, y: 14 },
    cardiovascular: { x: -742, y: 14 },
  },
  male: {
    clothed: { x: -21, y: -670, zIndex: 1 },
    muscles: { x: -263, y: -670 },
    skeleton: { x: -497, y: -670 },
    cardiovascular: { x: -727, y: -670 },
  },
};

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

    this.patientImages = {
      female: {
        clothed: this.dom.patientFemaleClothed,
        muscles: this.dom.patientFemaleMuscles,
        skeleton: this.dom.patientFemaleSkeleton,
        cardiovascular: this.dom.patientFemaleCardiovascular,
      },
      male: {
        clothed: this.dom.patientMaleClothed,
        muscles: this.dom.patientMaleMuscles,
        skeleton: this.dom.patientMaleSkeleton,
        cardiovascular: this.dom.patientMaleCardiovascular,
      },
    };

    this.initPatientImages();
    this.initPatientImagesVisibility();
    this.initEventListeners();
  }

  initPatientImages() {
    const configureImages = (gender, images) => {
      Object.entries(images).forEach(([type, { x, y, zIndex }]) => {
        const style = this.patientImages[gender][type].style;
        style.background = `${imageUrl} no-repeat ${x}px ${y}px`;
        style.backgroundSize = backgroundSize;
        if (zIndex) style.zIndex = zIndex;
      });
    };
    Object.entries(imagesConfig).forEach(([gender, images]) => {
      configureImages(gender, images);
    });
  }

  initPatientImagesVisibility() {
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
    this.dom.genderSelect.addEventListener("change", this.onPatientSelect.bind(this));
    this.dom.scanTypeSelect.addEventListener("change", this.onPatientSelect.bind(this));
  }

  onPatientSelect() {
    const gender = this.dom.genderSelect.value;
    const scanType = this.dom.scanTypeSelect.value;

    Object.values(this.patientImages.female).forEach((img) => (img.style.display = "none"));
    Object.values(this.patientImages.male).forEach((img) => (img.style.display = "none"));

    if (this.patientImages[gender] && this.patientImages[gender][scanType]) {
      this.patientImages[gender].clothed.style.display = "block";
      this.patientImages[gender][scanType].style.display = "block";
      this.patientImages[gender].clothed.style.zIndex = 1;
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

  setPatientScanner(scannerTop, scannerBottom) {
    const gender = document.getElementById("gender-select").value;
    const scanType = document.getElementById("scan-type-select").value;
    this.patientImages[gender].clothed.style.clipPath = `polygon(
      0 0, 100% 0, 100% ${scannerTop}px, 0 ${scannerTop}px, 
      0 ${scannerBottom}px, 100% ${scannerBottom}px, 100% 100%, 0 100%
    )`;
    this.patientImages[gender][scanType].style.clipPath = `inset(${scannerTop}px 0 ${this.patientHeight - scannerBottom}px 0)`;
  }

  setProgressBar(scannerBottom) {
    const progress = Math.min(100, (scannerBottom / this.patientHeight) * 100);
    if (progress > this.maxProgress) {
      this.maxProgress = progress;
      this.dom.progressBar.style.width = `${this.maxProgress}%`;
      this.dom.progressLabel.textContent = `${Math.round(this.maxProgress)}%`;
    }
    if (this.maxProgress >= MAX_PROGRESS) this.handleScanComplete();
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
      this.setPatientScanner(scannerTop, scannerBottom);
      this.initialScanStart = true;
    }
    this.dom.scanner.style.cursor = SCANNER_GRABBING;
  }

  onMouseMove(e) {
    if (!this.isDragging) return;
    const { scannerTop, scannerBottom } = this.getScannerPosition(e);
    this.setPatientScanner(scannerTop, scannerBottom);
    this.setProgressBar(scannerBottom);
  }

  onMouseUp() {
    this.isDragging = false;
    this.dom.scanner.style.cursor = SCANNER_GRAB;
  }

  onReset() {
    this.setPatientScanner(0, 0);
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
}

export default ScannerLogic;
