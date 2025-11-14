let score = 0;
let currentQuestionIndex = 0;
let currentQuiz = null;
let userAnswers = [];

const quizSelection = document.getElementById("quiz-selection");
const quizScreen = document.getElementById("quiz-screen");
const resultsScreen = document.getElementById("results-screen");
const quizList = document.getElementById("quiz-list");
const questionContainer = document.getElementById("question-container");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const scoreEl = document.getElementById("score");
const maxScoreEl = document.getElementById("max-score");
const bestScores = document.getElementById("best-scores");

async function loadQuizzes() {

    const response = await fetch("data/quiz.json");
    const quizzes = await response.json();

    quizList.innerHTML = "";

    quizzes.forEach(quiz => {
        const bestScore = localStorage.getItem(`best_score_${quiz.id}`) || 0;

        const quizItem = document.createElement("div");
        quizItem.className = "bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] p-6 rounded-xl border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-[1.02]";

        const quizTitle = document.createElement("h3");
        quizTitle.className = "font-semibold text-lg text-[#263973]";
        quizTitle.textContent = quiz.title;

        const questionCount = document.createElement("p");
        questionCount.className = "text-sm text-gray-600 mt-1";
        questionCount.textContent = quiz.questions.length + " Questions";

        const bestScoreEl = document.createElement("p");
        bestScoreEl.className = "font-semibold text-[#486CD9]";
        bestScoreEl.textContent = `Meilleur score: ${bestScore}/${quiz.questions.length}`;

        const startBtn = document.createElement("button");
        startBtn.textContent = "Commencer le quiz";
        startBtn.className = "w-full bg-[#486CD9] hover:bg-[#263973] text-white font-bold py-2 px-4 rounded-lg transition-colors mt-4";

        quizItem.appendChild(quizTitle);
        quizItem.appendChild(questionCount);
        quizItem.appendChild(bestScoreEl);
        quizItem.appendChild(startBtn);
        quizList.appendChild(quizItem);

        startBtn.addEventListener("click", () => {
            startQuiz(quiz);
        });
    });

}

function startQuiz(quiz) {
    currentQuiz = quiz;
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = new Array(quiz.questions.length).fill(null);

    quizSelection.classList.add("hidden");
    quizScreen.classList.remove("hidden");
    resultsScreen.classList.add("hidden");

    loadQuestion();
}

function loadQuestion() {
    const question = currentQuiz.questions[currentQuestionIndex];

    document.getElementById("quiz-title").textContent = currentQuiz.title;
    document.getElementById("current-question").textContent = currentQuestionIndex + 1;
    document.getElementById("total-questions").textContent = currentQuiz.questions.length;

    if (prevBtn) {
        prevBtn.classList.toggle("hidden", currentQuestionIndex === 0);
    }

    if (nextBtn) {
        nextBtn.textContent = currentQuestionIndex === currentQuiz.questions.length - 1 ? "Terminer" : "Suivant";
    }

    questionContainer.innerHTML = "";
    if (feedback) {
        feedback.classList.add("hidden");
    }

    const questionEl = document.createElement("div");
    questionEl.className = "mb-4";
    questionEl.innerHTML = `<h3 class="text-lg font-medium mb-4 text-gray-800">${question.question}</h3>`;

    if (question.type === "text") {
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Tapez votre réponse ici...";
        input.className = "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

        if (userAnswers[currentQuestionIndex] !== null) {
            input.value = userAnswers[currentQuestionIndex];
        }

        questionEl.appendChild(input);
    }
    else if (question.type === "true_false") {
        const container = document.createElement("div");
        container.className = "grid grid-cols-2 gap-4";

        ["Vrai", "Faux"].forEach((option, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = option;
            button.className = "p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-200 font-medium";
            button.dataset.value = index === 0;

            if (userAnswers[currentQuestionIndex] !== null && userAnswers[currentQuestionIndex] === (index === 0)) {
                button.classList.add("bg-[#486CD9]", "text-white", "border-[#486CD9]");
            }

            button.addEventListener("click", function () {
                container.querySelectorAll("button").forEach(btn => {
                    btn.classList.remove("bg-[#486CD9]", "text-white", "border-[#486CD9]");
                    btn.classList.add("border-gray-300");
                });

                this.classList.remove("border-gray-300");
                this.classList.add("bg-[#486CD9]", "text-white", "border-[#486CD9]");

                userAnswers[currentQuestionIndex] = this.dataset.value === "true";
            });

            container.appendChild(button);
        });

        questionEl.appendChild(container);
    }
    else if (question.type === "multiple_choice") {
        const container = document.createElement("div");
        container.className = "space-y-3";

        question.options.forEach((option, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = option;
            button.className = "w-full p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-200 text-left font-medium";
            button.dataset.value = index;

            if (userAnswers[currentQuestionIndex] !== null && userAnswers[currentQuestionIndex] == index) {
                button.classList.add("bg-[#486CD9]", "text-white", "border-[#486CD9]");
            }

            button.addEventListener("click", function () {
                container.querySelectorAll("button").forEach(btn => {
                    btn.classList.remove("bg-[#486CD9]", "text-white", "border-[#486CD9]");
                    btn.classList.add("border-gray-300");
                });

                this.classList.remove("border-gray-300");
                this.classList.add("bg-[#486CD9]", "text-white", "border-[#486CD9]");

                userAnswers[currentQuestionIndex] = parseInt(this.dataset.value);
            });

            container.appendChild(button);
        });

        questionEl.appendChild(container);
    }

    questionContainer.appendChild(questionEl);
}

function saveAnswer() {
    const question = currentQuiz.questions[currentQuestionIndex];

    if (question.type === "text") {
        const input = questionContainer.querySelector("input[type='text']");
        if (input) {
            userAnswers[currentQuestionIndex] = input.value.trim();
        }
    }
}

function checkAnswer() {
    const question = currentQuiz.questions[currentQuestionIndex];
    const userAnswer = userAnswers[currentQuestionIndex];

    if (userAnswer === null) return false;

    if (question.type === "text") {
        return question.acceptedAnswers.some(answer =>
            userAnswer.toLowerCase() === answer.toLowerCase()
        );
    }
    else if (question.type === "true_false") {
        return userAnswer === question.correct;
    }
    else if (question.type === "multiple_choice") {
        return userAnswer === question.correct;
    }

    return false;
}

function showFeedback(isCorrect) {
    if (!feedback) return;

    feedback.classList.remove("hidden");

    const question = currentQuiz.questions[currentQuestionIndex];
    let correctAnswer = "";

    if (question.type === "text") {
        correctAnswer = question.acceptedAnswers[0];
    }
    else if (question.type === "true_false") {
        correctAnswer = question.correct ? "Vrai" : "Faux";
    }
    else if (question.type === "multiple_choice") {
        correctAnswer = question.options[question.correct];
    }

    if (isCorrect) {
        feedback.className = "p-4 bg-green-100 text-green-800 rounded-lg mb-4 border border-green-200";
        feedback.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-check-circle mr-3 text-green-500"></i>
                <span class="font-medium">Correct !</span>
            </div>
        `;
    } else {
        feedback.className = "p-4 bg-red-100 text-red-800 rounded-lg mb-4 border border-red-200";
        feedback.innerHTML = `
            <div class="flex items-center mb-2">
                <i class="fas fa-times-circle mr-3 text-red-500"></i>
                <span class="font-medium">Incorrect !</span>
            </div>
            <div>La réponse correcte est : <strong>${correctAnswer}</strong></div>
        `;
    }
}

function nextQuestion() {
    saveAnswer();

    if (userAnswers[currentQuestionIndex] === null) {
        alert("Veuillez répondre à la question avant de continuer.");
        return;
    }

    const isCorrect = checkAnswer();
    showFeedback(isCorrect);

    if (isCorrect) {
        score++;
    }

    if (currentQuestionIndex === currentQuiz.questions.length - 1) {
        setTimeout(showResults, 1500);
    } else {
        setTimeout(() => {
            currentQuestionIndex++;
            loadQuestion();
        }, 1500);
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
}

function showResults() {
    const bestScoreKey = `best_score_${currentQuiz.id}`;
    const currentBestScore = localStorage.getItem(bestScoreKey) || 0;

    if (score > currentBestScore) {
        localStorage.setItem(bestScoreKey, score);
    }

    quizScreen.classList.add("hidden");
    resultsScreen.classList.remove("hidden");

    if (scoreEl) scoreEl.textContent = score;
    if (maxScoreEl) maxScoreEl.textContent = currentQuiz.questions.length;

    if (bestScores) {
        bestScores.innerHTML = "";
        const allQuizzes = JSON.parse(localStorage.getItem("all_quizzes") || "[]");

        allQuizzes.forEach(quiz => {
            const bestScore = localStorage.getItem(`best_score_${quiz.id}`) || 0;
            const scoreItem = document.createElement("div");
            scoreItem.className = "flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg";
            scoreItem.innerHTML = `
                <span class="text-gray-700">${quiz.title}</span>
                <span class="font-semibold text-[#486CD9]">${bestScore}/${quiz.questions.length}</span>
            `;
            bestScores.appendChild(scoreItem);
        });
    }


}


document.addEventListener("DOMContentLoaded", () => {
    loadQuizzes();

    if (nextBtn) {
        nextBtn.addEventListener("click", nextQuestion);
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", prevQuestion);
    }
});