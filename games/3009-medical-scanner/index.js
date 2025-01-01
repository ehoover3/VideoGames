// index.js
import { patient, patientClothedView, patientOrgansView, scanner, startButton, resetButton, progressBar, progressLabel, quizContainer, quizQuestion, quizOptions, nextQuestionButton } from "./domElements.js";

const quizData = [
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

let currentQuestionIndex = 0;
let userAnswers = [];

// Function to show the quiz after the scan completes
function showQuiz() {
  quizContainer.style.display = "block";
  showQuestion();
}

// Function to display the current question and its options
function showQuestion() {
  const currentQuestion = quizData[currentQuestionIndex];
  quizQuestion.textContent = currentQuestion.question;
  quizOptions.innerHTML = ""; // Clear previous options

  // Create buttons for each answer option
  currentQuestion.options.forEach((option) => {
    const optionButton = document.createElement("button");
    optionButton.textContent = option;
    optionButton.onclick = () => handleAnswer(option);
    quizOptions.appendChild(optionButton);
  });
}

// Function to handle the user's answer
function handleAnswer(selectedAnswer) {
  const currentQuestion = quizData[currentQuestionIndex];
  userAnswers.push(selectedAnswer === currentQuestion.correctAnswer);

  // Disable options after an answer is selected
  const optionButtons = quizOptions.querySelectorAll("button");
  optionButtons.forEach((button) => (button.disabled = true));
}

// Function to show the next question or end the quiz
function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizData.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

// Function to end the quiz and show the result
function endQuiz() {
  quizContainer.innerHTML = `<h2>Your score: ${userAnswers.filter((answer) => answer).length} / ${quizData.length}</h2>`;
  nextQuestionButton.style.display = "none"; // Hide the "Next" button after quiz ends
}

// Event listener for the "Next Question" button
nextQuestionButton.addEventListener("click", nextQuestion);

// Modify the `handleScanComplete` function to show the quiz when the scan is complete

//

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
  isDragging = true;
  setCursorStyle(scanner, "grabbing");
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
  showQuiz();
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
