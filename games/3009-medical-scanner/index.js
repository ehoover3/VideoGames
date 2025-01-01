// index.js
import DOMElements from "./domElements.js";
import QuizLogic from "./quizLogic.js";
import ScannerLogic from "./scannerLogic.js";

document.addEventListener("DOMContentLoaded", () => {
  const dom = new DOMElements();
  const quiz = new QuizLogic(dom);
  const scanner = new ScannerLogic(dom, quiz);
});
