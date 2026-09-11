// ==========================================
// 1. SPØRSMÅLSLISTE (Web, Internett og Drift)
// ==========================================
const quizDatabase = [
  {
    question:
      "Hvilken HTML-tagg brukes for å lage den aller største overskriften på en nettside?",
    type: "mc",
    options: ["<h1>", "<heading>", "<h6>", "<title>"],
    correctAnswer: "<h1>",
  },
  {
    question:
      "Hvilken protokoll brukes for å sende kryptert og sikker webtrafikk på internett?",
    type: "mc",
    options: ["HTTPS", "HTTP", "FTP", "IP"],
    correctAnswer: "HTTPS",
  },
  {
    question: "Hva står forkortelsen CPU for på en datamaskin?",
    type: "text",
    correctAnswers: ["central processing unit", "cpu"],
  },
  {
    question:
      "Hvilken CSS-egenskap bruker man for å endre bakgrunnsfargen til et element?",
    type: "text",
    correctAnswers: ["background-color", "background color"],
  },
  {
    question: "Hva står forkortelsen DNS for?",
    type: "mc",
    options: [
      "Domain Name System",
      "Data Network Server",
      "Digital Name Service",
      "Dynamic Network System",
    ],
    correctAnswer: "Domain Name System",
  },
  {
    question:
      "Hva kalles den unike, fysiske maskinvare-adressen som er brent inn i nettverkskortet på en enhet?",
    type: "text",
    correctAnswers: ["mac-adresse", "mac adresse", "mac"],
  },
  {
    question:
      "Hvilken tjeneste på en ruter deler ut IP-adresser automatisk til enheter som kobler seg på?",
    type: "mc",
    options: [
      "DHCP-serveren",
      "Brannmuren (Firewall)",
      "DNS-serveren",
      "Switchen",
    ],
    correctAnswer: "DHCP-serveren",
  },
];

// ==========================================
// 2. GLOBALE VARIABLER
// ==========================================
let activeQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = {}; // Lagrer tekst eller valgt alternativ streng-verdi

// DOM-Elementer fra index.html
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const restartBtn = document.getElementById("restart-btn");

const questionNumberText = document.getElementById("question-number");
const questionText = document.getElementById("question-text");
const answerContainer = document.getElementById("answer-container");
const scoreText = document.getElementById("score-text");
const highscoreList = document.getElementById("highscore-list");

// ==========================================
// 3. QUIZ LOGIKK & NAVIGASJON
// ==========================================
function startQuiz() {
  // Stokker databasen og henter ut 5 tilfeldige spørsmål
  let shuffled = [...quizDatabase].sort(() => Math.random() - 0.5);
  activeQuestions = shuffled.slice(0, 5);

  // Nullstiller runden
  currentQuestionIndex = 0;
  userAnswers = {};

  switchScreen(startScreen, quizScreen);
  showQuestion();
}

function switchScreen(fromScreen, toScreen) {
  fromScreen.classList.remove("active");
  toScreen.classList.add("active");
  toScreen.classList.add("fade-in");
  setTimeout(() => toScreen.classList.remove("fade-in"), 300);
}

function showQuestion() {
  const currentQuestion = activeQuestions[currentQuestionIndex];

  // Oppdaterer tekster på skjermen
  questionNumberText.innerText = `Spørsmål ${currentQuestionIndex + 1} av 5`;
  questionText.innerText = currentQuestion.question;
  answerContainer.innerHTML = "";

  // Styring av Forrige-knapp
  prevBtn.style.visibility = currentQuestionIndex === 0 ? "hidden" : "visible";
  nextBtn.innerText =
    currentQuestionIndex === activeQuestions.length - 1 ? "Fullfør" : "Neste →";

  // Bygger svargrensesnitt
  if (currentQuestion.type === "mc") {
    currentQuestion.options.forEach((option) => {
      const button = document.createElement("button");
      button.classList.add("option-btn");
      button.innerText = option;

      if (userAnswers[currentQuestionIndex] === option) {
        button.classList.add("selected");
      }

      button.onclick = () => {
        const buttons = answerContainer.getElementsByClassName("option-btn");
        for (let b of buttons) b.classList.remove("selected");

        button.classList.add("selected");
        userAnswers[currentQuestionIndex] = option; // Lagrer teksten brukeren valgte
      };
      answerContainer.appendChild(button);
    });
  } else if (currentQuestion.type === "text") {
    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("text-input");
    input.placeholder = "Skriv svaret ditt her...";

    if (userAnswers[currentQuestionIndex] !== undefined) {
      input.value = userAnswers[currentQuestionIndex];
    }

    input.oninput = () => {
      userAnswers[currentQuestionIndex] = input.value; // Lagrer fortløpende det brukeren skriver
    };
    answerContainer.appendChild(input);
  }
}

function handleNext() {
  if (currentQuestionIndex < activeQuestions.length - 1) {
    currentQuestionIndex++;
    quizScreen.classList.add("fade-in");
    showQuestion();
    setTimeout(() => quizScreen.classList.remove("fade-in"), 300);
  } else {
    showResults();
  }
}

function handlePrevious() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    quizScreen.classList.add("fade-in");
    showQuestion();
    setTimeout(() => quizScreen.classList.remove("fade-in"), 300);
  }
}

// ==========================================
// 4. BEREGNING OG HIGHSCORE
// ==========================================
function showResults() {
  let totalScore = 0;

  activeQuestions.forEach((q, index) => {
    let userAnswer = userAnswers[index] || "";

    if (q.type === "mc") {
      if (userAnswer === q.correctAnswer) {
        totalScore += 3; // Riktig flervalg gir 3 poeng
      }
    } else if (q.type === "text") {
      let match = q.correctAnswers.includes(userAnswer.trim().toLowerCase());
      if (match) {
        totalScore += 3; // Riktig tekstsvar gir 3 poeng
      }
    }
  });

  scoreText.innerText = `Du fikk totalt ${totalScore} poeng!`;

  saveHighscore(totalScore);
  switchScreen(quizScreen, resultScreen);
  displayHighscores();
}

function saveHighscore(score) {
  let scores = JSON.parse(localStorage.getItem("quizHighscores")) || [];
  const now = new Date();
  const timeString = `${now.toLocaleDateString()} kl. ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

  scores.push({ score: score, time: timeString });
  scores.sort((a, b) => b.score - a.score);
  scores = scores.slice(0, 5);

  localStorage.setItem("quizHighscores", JSON.stringify(scores));
}

function displayHighscores() {
  highscoreList.innerHTML = "";
  let scores = JSON.parse(localStorage.getItem("quizHighscores")) || [];

  if (scores.length === 0) {
    highscoreList.innerHTML = "<li>Ingen forsøk lagret enda.</li>";
    return;
  }

  scores.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>#${index + 1}:</strong> ${item.score} poeng (${item.time})`;
    highscoreList.appendChild(li);
  });
}

// ==========================================
// 5. EVENT LISTENERS (Knappekoblinger)
// ==========================================
startBtn.onclick = startQuiz;
nextBtn.onclick = handleNext;
prevBtn.onclick = handlePrevious;
restartBtn.onclick = startQuiz;

// Viser lagrede highscores med en gang siden laster
displayHighscores();
