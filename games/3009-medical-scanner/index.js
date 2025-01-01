// DOM Wrapper Class
class DOMElements {
  constructor() {
    this.patient = document.querySelector(".patient");
    this.patientClothedView = document.querySelector(".body-clothed-view");
    this.patientOrgansView = document.querySelector(".body-organs-view");
    this.scanner = document.querySelector(".scanner");
    this.startButton = document.querySelector(".start-button");
    this.resetButton = document.querySelector(".reset-button");
    this.progressBar = document.querySelector(".progress-bar");
    this.progressLabel = document.querySelector(".progress-label");
    this.quizContainer = document.querySelector(".quiz-container");
    this.quizQuestion = document.getElementById("quiz-question");
    this.quizOptions = document.getElementById("quiz-options");
    this.nextQuestionButton = document.getElementById("next-question-btn");
  }
}

// Scanner Logic Class
class ScannerLogic {
  constructor(dom) {
    this.dom = dom;
    this.isDragging = false;
    this.isScanning = false;
    this.maxProgress = 0;

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

  calculateScannerPosition(e) {
    let scannerY = e.clientY - this.patientRectangle.top - this.scannerHeight / 2;
    scannerY = Math.max(0, Math.min(scannerY, this.patientHeight - this.scannerHeight));
    this.dom.scanner.style.top = `${scannerY}px`;
    return {
      scannerTop: scannerY,
      scannerBottom: scannerY + this.scannerHeight,
    };
  }

  updateProgressBar(scannerBottom) {
    const progress = Math.min(100, (scannerBottom / this.patientHeight) * 100);
    if (progress > this.maxProgress) {
      this.maxProgress = progress;
      this.dom.progressBar.style.width = `${this.maxProgress}%`;
      this.dom.progressLabel.textContent = `${Math.round(this.maxProgress)}%`;
    }
    if (this.maxProgress >= 100) this.handleScanComplete();
  }

  updatePatientScanUI(scannerTop, scannerBottom) {
    const { patientClothedView, patientOrgansView } = this.dom;
    patientClothedView.style.clipPath = `polygon(
      0 0, 100% 0, 100% ${scannerTop}px, 0 ${scannerTop}px, 
      0 ${scannerBottom}px, 100% ${scannerBottom}px, 100% 100%, 0 100%
    )`;
    patientOrgansView.style.clipPath = `inset(${scannerTop}px 0 ${this.patientHeight - scannerBottom}px 0)`;
  }

  handleScanComplete() {
    this.dom.startButton.textContent = "SCAN COMPLETE";
    this.dom.startButton.classList.add("disabled");
    this.isScanning = false;
    quiz.showQuiz();
  }

  onMouseDown() {
    this.isDragging = true;
    this.isScanning = true;
    this.dom.startButton.textContent = "SCAN RUNNING";
    this.dom.patientOrgansView.style.opacity = 1;
    this.dom.scanner.style.cursor = "grabbing";
  }

  onMouseMove(e) {
    if (!this.isDragging) return;
    const { scannerTop, scannerBottom } = this.calculateScannerPosition(e);
    this.updatePatientScanUI(scannerTop, scannerBottom);
    this.updateProgressBar(scannerBottom);
  }

  onMouseUp() {
    this.isDragging = false;
    this.dom.scanner.style.cursor = "grab";
  }

  onReset() {
    this.updatePatientScanUI(0, 0);
    this.dom.startButton.textContent = "START SCAN";
    this.dom.startButton.classList.remove("disabled");
    this.dom.patientOrgansView.style.opacity = 0;
    this.dom.progressBar.style.width = "0";
    this.dom.progressLabel.textContent = "0%";
    this.maxProgress = 0;
    this.isScanning = false;
    this.dom.scanner.style.top = "0";
  }
}

// Quiz Logic Class
class QuizLogic {
  constructor(dom) {
    this.dom = dom;
    this.questions = [
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
    this.currentQuestionIndex = 0;
    this.userAnswers = [];
    this.initEventListeners();
  }

  initEventListeners() {
    this.dom.nextQuestionButton.addEventListener("click", () => this.nextQuestion());
  }

  showQuiz() {
    this.dom.quizContainer.style.display = "block";
    this.showQuestion();
  }

  showQuestion() {
    const currentQuestion = this.questions[this.currentQuestionIndex];
    this.dom.quizQuestion.textContent = currentQuestion.question;
    this.dom.quizOptions.innerHTML = "";

    currentQuestion.options.forEach((option) => {
      const button = document.createElement("button");
      button.textContent = option;
      button.addEventListener("click", () => this.handleAnswer(option));
      this.dom.quizOptions.appendChild(button);
    });
  }

  handleAnswer(selectedAnswer) {
    const currentQuestion = this.questions[this.currentQuestionIndex];
    this.userAnswers.push(selectedAnswer === currentQuestion.correctAnswer);
    Array.from(this.dom.quizOptions.children).forEach((button) => (button.disabled = true));
  }

  nextQuestion() {
    this.currentQuestionIndex++;
    if (this.currentQuestionIndex < this.questions.length) {
      this.showQuestion();
    } else {
      this.endQuiz();
    }
  }

  endQuiz() {
    this.dom.quizContainer.innerHTML = `Your score: ${this.userAnswers.filter((answer) => answer).length} / ${this.questions.length}`;
    this.dom.nextQuestionButton.style.display = "none";
  }
}

// Initialization
const dom = new DOMElements();
const scanner = new ScannerLogic(dom);
const quiz = new QuizLogic(dom);
