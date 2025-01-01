// quizLogic.js
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
    this.dom.nextQuestionButton.addEventListener("click", () => this.setNextQuestion());
  }

  setQuizVisible() {
    this.dom.quizContainer.style.display = "block";
    this.setQuestion();
  }

  setQuestion() {
    const currentQuestion = this.questions[this.currentQuestionIndex];
    this.dom.quizQuestion.textContent = currentQuestion.question;
    this.dom.quizOptions.innerHTML = "";

    currentQuestion.options.forEach((option) => {
      const button = document.createElement("button");
      button.textContent = option;
      button.addEventListener("click", () => this.setAnswer(option));
      this.dom.quizOptions.appendChild(button);
    });
  }

  setAnswer(selectedAnswer) {
    const currentQuestion = this.questions[this.currentQuestionIndex];
    this.userAnswers.push(selectedAnswer === currentQuestion.correctAnswer);
    Array.from(this.dom.quizOptions.children).forEach((button) => (button.disabled = true));
  }

  setNextQuestion() {
    this.currentQuestionIndex++;
    if (this.currentQuestionIndex < this.questions.length) this.setQuestion();
    else this.endQuiz();
  }

  endQuiz() {
    this.dom.quizContainer.innerHTML = `Your score: ${this.userAnswers.filter((answer) => answer).length} / ${this.questions.length}`;
    this.dom.nextQuestionButton.style.display = "none";
  }
}

export default QuizLogic;
