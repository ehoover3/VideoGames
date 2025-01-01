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

// ???
const patientRectangle = dom.patient.getBoundingClientRect();
const patientHeight = patientRectangle.height;
const scannerHeight = dom.scanner.offsetHeight;

// MAIN FUNCTIONS
function onMouseDown() {
  updateElementText(dom.startButton, TEXT.SCAN_RUNNING);
  showAnatomicalLayer();
  updatePatientScanUI(0, dom.scanner.offsetHeight);
  isScanning = true;
  isDragging = true;
  setCursorStyle(dom.scanner, "grabbing");
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
  setCursorStyle(dom.scanner, "grab");
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
  dom.patientOrgansView.style.opacity = 1;
}

function updateElementText(element, text) {
  element.textContent = text;
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
}

function updateProgressBar(scannerTop, scannerBottom) {
  const progress = Math.min(100, (scannerBottom / patientHeight) * 100);
  if (progress > maxProgress) {
    maxProgress = progress;
    dom.progressBar.style.width = `${maxProgress}%`;
    dom.progressLabel.textContent = `${Math.round(maxProgress)}%`;
  }
  if (maxProgress >= 100) {
    handleScanComplete();
  }
}

function handleScanComplete() {
  updateElementText(dom.startButton, TEXT.SCAN_COMPLETE);
  dom.startButton.classList.add("disabled");
  isScanning = false;
  showQuiz();
}

function calculateScannerPosition(e) {
  let scannerPositionY = e.clientY - patientRectangle.top - scannerHeight / 2;
  scannerPositionY = Math.max(0, Math.min(scannerPositionY, patientHeight - scannerHeight));
  dom.scanner.style.top = `${scannerPositionY}px`;
  return {
    scannerTop: scannerPositionY,
    scannerBottom: scannerPositionY + scannerHeight,
  };
}

function setCursorStyle(element, style) {
  if (element && VALID_CURSOR_STYLES.includes(style)) element.style.cursor = style;
  else console.warn(`Invalid cursor style: "${style}"`);
}

function resetPatientImages() {
  patientOrgansView.style.opacity = 0;
}

function resetButtons() {
  updateElementText(startButton, TEXT.START_SCAN_TEXT);
  startButton.classList.remove("disabled");
}

function resetProgressBar() {
  progressBar.style.width = "0";
  progressLabel.textContent = "0%";
  maxProgress = 0;
}

// helper quiz functions
// quiz.js
const quizQuestions = [
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
];

function showQuiz() {
  dom.quizContainer.style.display = "block";
  showQuestion();
}

function showQuestion() {
  const currentQuestion = quizQuestions[currentQuestionIndex];
  dom.quizQuestion.textContent = currentQuestion.question;
  dom.quizOptions.innerHTML = "";
  currentQuestion.options.forEach((option) => {
    const optionButton = document.createElement("button");
    optionButton.textContent = option;
    optionButton.onclick = () => handleAnswer(option);
    dom.quizOptions.appendChild(optionButton);
  });
}

function handleAnswer(selectedAnswer) {
  const currentQuestion = quizQuestions[currentQuestionIndex];
  userAnswers.push(selectedAnswer === currentQuestion.correctAnswer);
  const optionButtons = dom.quizOptions.querySelectorAll("button");
  optionButtons.forEach((button) => (button.disabled = true));
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizQuestions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  dom.quizContainer.innerHTML = `<h2>Your score: ${userAnswers.filter((answer) => answer).length} / ${quizQuestions.length}</h2>`;
  dom.nextQuestionButton.style.display = "none";
}

// EVENT LISTENERS
dom.resetButton.addEventListener("click", () => onReset());
dom.scanner.addEventListener("mousedown", () => onMouseDown());
dom.nextQuestionButton.addEventListener("click", nextQuestion);
