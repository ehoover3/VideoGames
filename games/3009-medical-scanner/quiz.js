// quiz.js
export const quizQuestions = [
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

export function showQuiz() {
  quizContainer.style.display = "block";
  showQuestion();
}

export function showQuestion() {
  const currentQuestion = quizQuestions[currentQuestionIndex];
  quizQuestion.textContent = currentQuestion.question;
  quizOptions.innerHTML = "";
  currentQuestion.options.forEach((option) => {
    const optionButton = document.createElement("button");
    optionButton.textContent = option;
    optionButton.onclick = () => handleAnswer(option);
    quizOptions.appendChild(optionButton);
  });
}

export function handleAnswer(selectedAnswer) {
  const currentQuestion = quizQuestions[currentQuestionIndex];
  userAnswers.push(selectedAnswer === currentQuestion.correctAnswer);
  const optionButtons = quizOptions.querySelectorAll("button");
  optionButtons.forEach((button) => (button.disabled = true));
}

export function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizQuestions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

export function endQuiz() {
  quizContainer.innerHTML = `<h2>Your score: ${userAnswers.filter((answer) => answer).length} / ${quizQuestions.length}</h2>`;
  nextQuestionButton.style.display = "none";
}
