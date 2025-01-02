// domElements.js
class DOMElements {
  constructor() {
    this.patient = document.querySelector(".patient");

    this.patientFemaleClothed = document.querySelector(".patient-female-clothed");
    this.patientFemaleSkeleton = document.querySelector(".patient-female-skeleton");
    this.patientFemaleMuscles = document.querySelector(".patient-female-muscles");
    this.patientFemaleCardiovascular = document.querySelector(".patient-female-cardiovascular");
    this.patientMaleClothed = document.querySelector(".patient-male-clothed");
    this.patientMaleSkeleton = document.querySelector(".patient-male-skeleton");
    this.patientMaleMuscles = document.querySelector(".patient-male-muscles");
    this.patientMaleCardiovascular = document.querySelector(".patient-male-cardiovascular");

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
