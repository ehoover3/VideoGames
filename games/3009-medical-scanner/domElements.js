// domElements.js
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

export default DOMElements;
