// index.js
import DOMElements from "./dom.js";
import QuizLogic from "./quiz.js";
import ScannerLogic from "./scanner.js";

document.addEventListener("DOMContentLoaded", () => {
  const dom = new DOMElements();
  const quiz = new QuizLogic(dom);
  const scanner = new ScannerLogic(dom, quiz);
});
