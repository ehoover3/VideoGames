// index.js
import DOMElements from "./dom.js";
import ScannerLogic from "./scanner.js";

document.addEventListener("DOMContentLoaded", () => {
  const dom = new DOMElements();
  const scanner = new ScannerLogic(dom);
});
