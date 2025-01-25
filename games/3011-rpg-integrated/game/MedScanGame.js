import { drawText } from "./utils/drawText.js";
import { STATES } from "../config/constants.js";
import HUD from "./HUD.js";

export default class MedScanGame {
  static BASE_RESOLUTION = { width: 640, height: 360 };
  static MRI_IMAGE_DIMENSIONS = { width: 458, height: 248 };
  static PROGRESS_BAR_DIMENSIONS = { width: 400, height: 24 };
  static MRI_IMAGE_Y_OFFSET = 10;
  static PROGRESS_BAR_Y_OFFSET = 270;
  static MIN_FONT_SIZE = 20;

  constructor(canvas, ctx, keys, gameState, gameObjects) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.keys = keys;
    this.gameState = gameState;
    this.gameObjects = gameObjects;
    this.hud = new HUD(canvas, ctx);
    this.mriImg = new Image();
    this.mriImg.src = "assets/images/scanGame/mri.png";
    this.mriImg.onerror = () => console.error("Failed to load image: mri.png");

    this.quizQuestions = [
      {
        image: "brain.png",
        question: "What organ is this?",
        correctAnswer: "brain",
        options: ["brain", "heart", "liver", "kidney"],
      },
      {
        image: "heart.png",
        question: "What organ is this?",
        correctAnswer: "heart",
        options: ["lungs", "heart", "stomach", "pancreas"],
      },
      {
        image: "skull.png",
        question: "What bone structure is this?",
        correctAnswer: "skull",
        options: ["ribcage", "spine", "skull", "pelvis"],
      },
      {
        image: "handBones.png",
        question: "What body part's bones are these?",
        correctAnswer: "hand",
        options: ["foot", "arm", "hand", "leg"],
      },
    ];
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.incorrectQuestions = [];
    this.quizImages = {};
    this.loadQuizImages();

    this.lastKeyPressTime = 0;
    this.KEY_PRESS_COOLDOWN = 300; // milliseconds
    this.quizStarted = false;
    this.quizCompleted = false;
  }

  loadQuizImages() {
    this.quizQuestions.forEach((q) => {
      const img = new Image();
      img.src = `assets/images/scanGame/${q.image}`;
      img.onload = () => {
        this.quizImages[q.image] = img;
      };
      img.onerror = () => console.error(`Failed to load image: ${q.image}`);
    });
  }

  load() {
    this.update();
    this.draw();
  }

  update() {
    const {
      keys,
      gameObjects: { player },
      gameState,
    } = this;
    let { scanProgress, maxScanProgress, currentState, previousState, savedPlayerPosition } = gameState;

    const currentTime = Date.now();

    if (!this.quizStarted && keys["Enter"]) {
      this.quizStarted = true;
    }

    if (this.quizStarted && !this.quizCompleted) {
      // Only allow answer selection if no feedback is shown
      if (!this.answerFeedback && (keys["1"] || keys["2"] || keys["3"] || keys["4"]) && currentTime - this.lastKeyPressTime > this.KEY_PRESS_COOLDOWN) {
        this.handleQuizAnswer(keys);
        this.lastKeyPressTime = currentTime;
      }

      // Process next question when feedback is shown and Enter is pressed
      if (this.answerFeedback && keys["Enter"]) {
        this.processNextQuestion();
      }
    }

    if (this.quizCompleted && keys["Enter"]) {
      currentState = STATES.OVERWORLD;
      player.x = savedPlayerPosition.x;
      player.y = savedPlayerPosition.y;
      scanProgress = 0;
    }

    if (this.keys["Escape"]) {
      previousState = currentState;
      currentState = STATES.SYSTEM;
    }

    Object.assign(this.gameState, { currentState, previousState, scanProgress });
  }

  handleQuizAnswer(keys) {
    const currentQuestion = this.quizQuestions[this.currentQuestionIndex];
    console.log("Current answerFeedback:", this.answerFeedback);
    console.log("Enter key pressed:", keys["Enter"]);

    // Early return if answer feedback is already shown
    if (this.answerFeedback) {
      if (keys["Enter"]) {
        console.log("Processing next question");
        this.processNextQuestion();
      }
      return;
    }

    // Determine selected answer based on key press
    const selectedAnswer = this.getSelectedAnswer(keys, currentQuestion.options);

    if (selectedAnswer) {
      this.processAnswer(selectedAnswer, currentQuestion);
    }
  }

  getSelectedAnswer(keys, options) {
    const keyMap = {
      1: 0,
      2: 1,
      3: 2,
      4: 3,
    };

    for (const [key, index] of Object.entries(keyMap)) {
      if (keys[key]) return options[index];
    }

    return null;
  }

  processAnswer(selectedAnswer, currentQuestion) {
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    this.answerFeedback = {
      isCorrect,
      correctAnswer: currentQuestion.correctAnswer,
    };

    if (isCorrect) {
      this.score++;
      this.gameState.scanProgress = Math.ceil((this.score / this.quizQuestions.length) * this.gameState.maxScanProgress);
    } else {
      this.incorrectQuestions.push(this.currentQuestionIndex);
    }
  }

  processNextQuestion() {
    console.log("Before increment:", this.currentQuestionIndex);
    this.currentQuestionIndex++;
    this.answerFeedback = null;

    console.log("After increment:", this.currentQuestionIndex);
    console.log("Total questions:", this.quizQuestions.length);
    console.log("Incorrect questions:", this.incorrectQuestions);

    if (this.currentQuestionIndex >= this.quizQuestions.length) {
      if (this.incorrectQuestions.length > 0) {
        this.currentQuestionIndex = this.incorrectQuestions.shift();
        console.log("Revisiting incorrect question");
      } else {
        this.gameState.scanProgress = this.gameState.maxScanProgress;
        this.quizCompleted = true;
        console.log("Quiz completed");
      }
    }
  }

  draw() {
    this.clearCanvas();
    if (this.mriImg.complete) {
      if (!this.quizStarted) {
        this.drawStartScreen();
      } else if (!this.quizCompleted) {
        this.drawQuizQuestion();
      } else {
        this.drawFinishScreen();
      }
    }
  }

  drawStartScreen() {
    const scaleX = this.canvas.width / MedScanGame.BASE_RESOLUTION.width;
    const scaleY = this.canvas.height / MedScanGame.BASE_RESOLUTION.height;
    const imageWidth = MedScanGame.MRI_IMAGE_DIMENSIONS.width * scaleX;
    const imageHeight = MedScanGame.MRI_IMAGE_DIMENSIONS.height * scaleY;
    const x = (this.canvas.width - imageWidth) / 2;
    const y = MedScanGame.MRI_IMAGE_Y_OFFSET * scaleY;

    this.ctx.drawImage(this.mriImg, 0, 0, this.mriImg.width, this.mriImg.height, x, y, imageWidth, imageHeight);

    const scaledFontSize = Math.max(MedScanGame.MIN_FONT_SIZE * (this.canvas.height / MedScanGame.BASE_RESOLUTION.height), MedScanGame.MIN_FONT_SIZE) + "px Arial";
    drawText(this.ctx, "Start Quiz - Press Enter to Start", this.canvas.width / 2, y + imageHeight + 50, "center", scaledFontSize);
  }

  drawFinishScreen() {
    const scaleX = this.canvas.width / MedScanGame.BASE_RESOLUTION.width;
    const scaleY = this.canvas.height / MedScanGame.BASE_RESOLUTION.height;
    const imageWidth = MedScanGame.MRI_IMAGE_DIMENSIONS.width * scaleX;
    const imageHeight = MedScanGame.MRI_IMAGE_DIMENSIONS.height * scaleY;
    const x = (this.canvas.width - imageWidth) / 2;
    const y = MedScanGame.MRI_IMAGE_Y_OFFSET * scaleY;

    this.ctx.drawImage(this.mriImg, 0, 0, this.mriImg.width, this.mriImg.height, x, y, imageWidth, imageHeight);

    const scaledFontSize = Math.max(MedScanGame.MIN_FONT_SIZE * (this.canvas.height / MedScanGame.BASE_RESOLUTION.height), MedScanGame.MIN_FONT_SIZE) + "px Arial";
    drawText(this.ctx, `Finished Quiz! Final Score: ${this.score}/${this.quizQuestions.length}`, this.canvas.width / 2, y + imageHeight + 50, "center", scaledFontSize);
    drawText(this.ctx, "Press Enter to Return to Overworld", this.canvas.width / 2, y + imageHeight + 100, "center", scaledFontSize);
  }

  drawQuizQuestion() {
    const currentQuestion = this.quizQuestions[this.currentQuestionIndex];
    const currentImage = this.quizImages[currentQuestion.image];

    if (currentImage && currentImage.complete) {
      const scaleX = this.canvas.width / MedScanGame.BASE_RESOLUTION.width;
      const scaleY = this.canvas.height / MedScanGame.BASE_RESOLUTION.height;
      const imageWidth = MedScanGame.MRI_IMAGE_DIMENSIONS.width * scaleX;
      const imageHeight = MedScanGame.MRI_IMAGE_DIMENSIONS.height * scaleY;
      const x = (this.canvas.width - imageWidth) / 2;
      const y = MedScanGame.MRI_IMAGE_Y_OFFSET * scaleY;

      this.ctx.drawImage(currentImage, 0, 0, currentImage.width, currentImage.height, x, y, imageWidth, imageHeight);

      const questionY = y + imageHeight + 20;
      const scaledFontSize = Math.max(MedScanGame.MIN_FONT_SIZE * (this.canvas.height / MedScanGame.BASE_RESOLUTION.height), MedScanGame.MIN_FONT_SIZE) + "px Arial";
      drawText(this.ctx, currentQuestion.question, this.canvas.width / 2, questionY, "center", scaledFontSize);

      // Only draw options if no feedback is shown
      if (!this.answerFeedback) {
        currentQuestion.options.forEach((option, index) => {
          const optionY = questionY + 40 + index * 30;
          drawText(this.ctx, `${index + 1}. ${option}`, this.canvas.width / 2, optionY, "center", scaledFontSize);
        });
      }
      drawText(this.ctx, `Score: ${this.score}/${this.quizQuestions.length}`, this.canvas.width - 100, 30, "right", "20px Arial");

      // Add feedback display
      if (this.answerFeedback) {
        const feedbackY = questionY + 70;
        const feedbackText = this.answerFeedback.isCorrect ? `Correct, the answer is ${this.answerFeedback.correctAnswer}. Press Enter to continue.` : `Incorrect, the answer is ${this.answerFeedback.correctAnswer}. Press Enter to continue.`;

        this.ctx.fillStyle = this.answerFeedback.isCorrect ? "green" : "red";
        drawText(this.ctx, feedbackText, this.canvas.width / 2, feedbackY, "center", scaledFontSize);
      }
    }
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
