// dom.js
class DOMElements {
  constructor() {
    this.root = document.getElementById("root");

    // Create all necessary DOM elements
    this.createPatientSection();
    this.createControls();
  }

  createPatientSection() {
    this.patient = document.createElement("section");

    this.patientDiv = document.createElement("div");
    this.patientDiv.classList.add("patient");

    this.patientFemaleClothed = document.createElement("div");
    this.patientFemaleClothed.classList.add("patient-female-clothed");

    this.patientFemaleMuscles = document.createElement("div");
    this.patientFemaleMuscles.classList.add("patient-female-muscles");

    this.patientFemaleSkeleton = document.createElement("div");
    this.patientFemaleSkeleton.classList.add("patient-female-skeleton");

    this.patientFemaleCardiovascular = document.createElement("div");
    this.patientFemaleCardiovascular.classList.add("patient-female-cardiovascular");

    this.patientMaleClothed = document.createElement("div");
    this.patientMaleClothed.classList.add("patient-male-clothed");

    this.patientMaleMuscles = document.createElement("div");
    this.patientMaleMuscles.classList.add("patient-male-muscles");

    this.patientMaleSkeleton = document.createElement("div");
    this.patientMaleSkeleton.classList.add("patient-male-skeleton");

    this.patientMaleCardiovascular = document.createElement("div");
    this.patientMaleCardiovascular.classList.add("patient-male-cardiovascular");

    this.scanner = document.createElement("div");
    this.scanner.classList.add("scanner");

    this.patientDiv.append(this.patientFemaleClothed, this.patientFemaleMuscles, this.patientFemaleSkeleton, this.patientFemaleCardiovascular, this.patientMaleClothed, this.patientMaleMuscles, this.patientMaleSkeleton, this.patientMaleCardiovascular, this.scanner);

    this.patient.appendChild(this.patientDiv);
    this.root.appendChild(this.patient);
  }

  createControls() {
    this.controls = document.createElement("div");
    this.controls.classList.add("controls");

    this.genderSelectLabel = document.createElement("label");
    this.genderSelectLabel.setAttribute("for", "gender-select");
    this.genderSelectLabel.textContent = "Select Gender:";

    this.genderSelect = document.createElement("select");
    this.genderSelect.id = "gender-select";
    this.genderSelect.innerHTML = `
      <option value="female">Female</option>
      <option value="male">Male</option>
    `;

    this.scanTypeSelectLabel = document.createElement("label");
    this.scanTypeSelectLabel.setAttribute("for", "scan-type-select");
    this.scanTypeSelectLabel.textContent = "Select Scan Type:";

    this.scanTypeSelect = document.createElement("select");
    this.scanTypeSelect.id = "scan-type-select";
    this.scanTypeSelect.innerHTML = `
      <option value="muscles">Muscles</option>
      <option value="skeleton">Skeleton</option>
      <option value="cardiovascular">Cardiovascular</option>
    `;

    this.startButton = document.createElement("button");
    this.startButton.classList.add("start-button");
    this.startButton.setAttribute("aria-label", "Start the scan");
    this.startButton.textContent = "START SCAN";

    this.resetButton = document.createElement("button");
    this.resetButton.classList.add("reset-button");
    this.resetButton.setAttribute("aria-label", "Reset the game");
    this.resetButton.textContent = "RESET";

    this.progressBarContainer = document.createElement("div");
    this.progressBarContainer.classList.add("progress-bar-container");

    this.progressBar = document.createElement("div");
    this.progressBar.classList.add("progress-bar");

    this.progressLabel = document.createElement("div");
    this.progressLabel.classList.add("progress-label");
    this.progressLabel.textContent = "0%";

    this.progressBarContainer.append(this.progressBar, this.progressLabel);

    this.controls.append(this.genderSelectLabel, this.genderSelect, this.scanTypeSelectLabel, this.scanTypeSelect, this.startButton, this.resetButton, this.progressBarContainer);

    this.root.appendChild(this.controls);
  }
}

export default DOMElements;
