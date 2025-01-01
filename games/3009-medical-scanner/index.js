// DOM Elements
const dom = {
  patient: document.querySelector(".patient"),
  patientClothedView: document.querySelector(".body-clothed-view"),
  patientOrgansView: document.querySelector(".body-organs-view"),
  scanner: document.querySelector(".scanner"),
  startButton: document.querySelector(".start-button"),
  resetButton: document.querySelector(".reset-button"),
  progressBar: document.querySelector(".progress-bar"),
  progressLabel: document.querySelector(".progress-label"),
  quizContainer: document.querySelector(".quiz-container"),
  quizQuestion: document.getElementById("quiz-question"),
  quizOptions: document.getElementById("quiz-options"),
  nextQuestionButton: document.getElementById("next-question-btn"),
};

// Constants
const VALID_CURSOR_STYLES = ["grabbing", "grab"];
const TEXT = {
  START_SCAN: "START SCAN",
  SCAN_RUNNING: "SCAN RUNNING",
  SCAN_COMPLETE: "SCAN COMPLETE",
};

// State Variables
let currentQuestionIndex = 0;
let userAnswers = [];
let isScanning = false;
let isDragging = false;
let maxProgress = 0;

// Utility Functions
const setElementText = (element, text) => (element.textContent = text);
const setElementStyle = (element, styleObj) => Object.assign(element.style, styleObj);

// ???
const patientRectangle = dom.patient.getBoundingClientRect();
const patientHeight = patientRectangle.height;
const scannerHeight = dom.scanner.offsetHeight;
function setCursorStyle(element, style) {
  if (element && VALID_CURSOR_STYLES.includes(style)) element.style.cursor = style;
  else console.warn(`Invalid cursor style: "${style}"`);
}

function resetPatientImages() {
  dom.patientOrgansView.style.opacity = 0;
}

const scannerLogic = {
  onMouseDown() {
    setElementText(dom.startButton, TEXT.SCAN_RUNNING);
    scannerLogic.showAnatomicalLayer();
    scannerLogic.updatePatientScanUI(0, dom.scanner.offsetHeight);
    isScanning = true;
    isDragging = true;
    setCursorStyle(dom.scanner, "grabbing");
    document.addEventListener("mousemove", (e) => scannerLogic.onMouseMove(e));
    document.addEventListener("mouseup", () => scannerLogic.onMouseUp());
  },
  onMouseMove(e) {
    if (!isDragging || e.clientY == null) return;
    const { scannerTop, scannerBottom } = scannerLogic.calculateScannerPosition(e);
    scannerLogic.updatePatientScanUI(scannerTop, scannerBottom);
    scannerLogic.updateProgressBar(scannerTop, scannerBottom);
  },
  onMouseUp() {
    setCursorStyle(dom.scanner, "grab");
    isDragging = false;
    document.removeEventListener("mousemove", scannerLogic.onMouseMove);
    document.removeEventListener("mouseup", scannerLogic.onMouseUp);
  },
  onReset() {
    scannerLogic.updatePatientScanUI(0, 0);
    setElementText(dom.startButton, TEXT.START_SCAN);
    dom.startButton.classList.remove("disabled");

    resetPatientImages();

    scannerLogic.resetProgressBar();
    dom.scanner.style.top = "0";
    maxProgress = 0;
    isScanning = false;
  },
  showAnatomicalLayer() {
    dom.patientOrgansView.style.opacity = 1;
  },
  updatePatientScanUI(scannerTop, scannerBottom) {
    const topLeft = "0 0";
    const topRight = "100% 0";
    const scannerTopRight = `100% ${scannerTop}px`;
    const scannerTopLeft = `0 ${scannerTop}px`;
    const scannerBottomLeft = `0 ${scannerBottom}px`;
    const scannerBottomRight = `100% ${scannerBottom}px`;
    const bottomRight = "100% 100%";
    const bottomLeft = "0 100%";
    dom.patientClothedView.style.clipPath = `polygon(
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
    const rectangleBottom = `${dom.patientClothedView.offsetHeight - scannerBottom}px`;
    dom.patientOrgansView.style.clipPath = `inset(${rectangleTop} 0 ${rectangleBottom} 0)`;
  },
  updateProgressBar(scannerTop, scannerBottom) {
    const progress = Math.min(100, (scannerBottom / patientHeight) * 100);
    if (progress > maxProgress) {
      maxProgress = progress;
      dom.progressBar.style.width = `${maxProgress}%`;
      dom.progressLabel.textContent = `${Math.round(maxProgress)}%`;
    }
    if (maxProgress >= 100) {
      scannerLogic.handleScanComplete();
    }
  },
  handleScanComplete() {
    setElementText(dom.startButton, TEXT.SCAN_COMPLETE);
    dom.startButton.classList.add("disabled");
    isScanning = false;
    quizLogic.showQuiz();
  },
  calculateScannerPosition(e) {
    let scannerPositionY = e.clientY - patientRectangle.top - scannerHeight / 2;
    scannerPositionY = Math.max(0, Math.min(scannerPositionY, patientHeight - scannerHeight));
    dom.scanner.style.top = `${scannerPositionY}px`;
    return {
      scannerTop: scannerPositionY,
      scannerBottom: scannerPositionY + scannerHeight,
    };
  },
  resetProgressBar() {
    dom.progressBar.style.width = "0";
    dom.progressLabel.textContent = "0%";
    maxProgress = 0;
  },
};

const quizLogic = {
  questions: [
    {
      question: "What is the largest organ in the human body?",
      options: ["Heart", "Lungs", "Skin", "Brain"],
      correctAnswer: "Skin",
    },
    {
      question: "How many bones are in the adult human body?",
      options: ["206", "210", "200", "220"],
      correctAnswer: "206",
    },
  ],
  showQuiz() {
    dom.quizContainer.style.display = "block";
    quizLogic.showQuestion();
  },
  showQuestion() {
    const currentQuestion = quizLogic.questions[currentQuestionIndex];
    dom.quizQuestion.textContent = currentQuestion.question;
    dom.quizOptions.innerHTML = "";
    currentQuestion.options.forEach((option) => {
      const optionButton = document.createElement("button");
      optionButton.textContent = option;
      optionButton.onclick = () => quizLogic.handleAnswer(option);
      dom.quizOptions.appendChild(optionButton);
    });
  },
  handleAnswer(selectedAnswer) {
    const currentQuestion = quizLogic.questions[currentQuestionIndex];
    userAnswers.push(selectedAnswer === currentQuestion.correctAnswer);
    const optionButtons = dom.quizOptions.querySelectorAll("button");
    optionButtons.forEach((button) => (button.disabled = true));
  },
  nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizLogic.questions.length) {
      quizLogic.showQuestion();
    } else {
      quizLogic.endQuiz();
    }
  },
  endQuiz() {
    dom.quizContainer.innerHTML = `<h2>Your score: ${userAnswers.filter((answer) => answer).length} / ${quizLogic.questions.length}</h2>`;
    dom.nextQuestionButton.style.display = "none";
  },
};

// EVENT LISTENERS
dom.resetButton.addEventListener("click", () => scannerLogic.onReset());
dom.scanner.addEventListener("mousedown", () => scannerLogic.onMouseDown());
dom.nextQuestionButton.addEventListener("click", quizLogic.nextQuestion);
