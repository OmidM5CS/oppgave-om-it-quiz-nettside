// ==========================================
// 1. DEFINISJON AV SPØRSMÅL (Matrise/Liste)
// TEMAER: Webutvikling, Internett og Drift
// ==========================================
const quizDatabase = [
  {
    // 1. Webutvikling
    question:
      "Hvilken HTML-tagg brukes for å lage den aller største overskriften på en nettside?",
    type: "mc",
    options: [
      { text: "<h1> (Helt riktig)", points: 3 },
      { text: "<heading>", points: 0 },
      { text: "<h6> (Dette er den minste overskriften)", points: 1 },
      { text: "<title>", points: 0 },
    ],
  },
  {
    // 2. Internett / Nettverk
    question:
      "Hvilken protokoll brukes for å sende kryptert og sikker webtrafikk på internett?",
    type: "mc",
    options: [
      { text: "HTTPS (Helt riktig)", points: 3 },
      { text: "HTTP (Dette er ukryptert)", points: 1 },
      { text: "FTP", points: 0 },
      { text: "IP", points: 0 },
    ],
  },
  {
    // 3. IT-Drift / Maskinvare
    question: "Hva står forkortelsen CPU for på en datamaskin?",
    type: "text",
    correctAnswers: [
      { text: "central processing unit", points: 3 },
      { text: "central hardware unit", points: 0 },
    ],
  },
  {
    // 4. Webutvikling / CSS
    question:
      "Hvilken CSS-egenskap bruker man for å endre bakgrunnsfargen til et element?",
    type: "text",
    correctAnswers: [
      { text: "background-color", points: 3 },
      { text: "background color", points: 3 },
      { text: "color", points: 1 },
    ],
  },
  {
    // 5. Internett
    question: "Hva står forkortelsen DNS for?",
    type: "mc",
    options: [
      { text: "Domain Name System (Helt riktig)", points: 3 },
      { text: "Data Network Server", points: 0 },
      { text: "Digital Name Service", points: 1 },
      { text: "Dynamic Network System", points: 0 },
    ],
  },
  {
    // 6. IT-Drift
    question:
      "Hva kalles den unike, fysiske maskinvare-adressen som er brent inn i nettverkskortet på en enhet?",
    type: "text",
    correctAnswers: [
      { text: "mac-adresse", points: 3 },
      { text: "mac adresse", points: 3 },
      { text: "mac", points: 3 },
      { text: "ip-adresse", points: 1 },
    ],
  },
  {
    // 7. IT-Drift / Nettverk
    question:
      "Hvilken tjeneste på en ruter deler ut IP-adresser automatisk til enheter som kobler seg på nettverket?",
    type: "mc",
    options: [
      { text: "DHCP-serveren (Helt riktig)", points: 3 },
      { text: "Brannmuren (Firewall)", points: 0 },
      { text: "DNS-serveren", points: 1 },
      { text: "Switchen", points: 0 },
    ],
  },
];

// ==========================================
// 2. GLOBALE VARIABLER OG TILSTAND
// ==========================================
let activeQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = {};
let questionPoints = {};

// Timer-variabler
let timerInterval;
const maxTimePerQuestion = 15;
let timeLeft = maxTimePerQuestion;

// DOM-Elementer
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
const timerBar = document.getElementById("timer-bar");
const scoreText = document.getElementById("score-text");
const highscoreList = document.getElementById("highscore-list");

// ==========================================
// 3. HJELPEFUNKSJONER (Stokking)
// ==========================================
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// ==========================================
// 4. QUIZ LOGIKK & NAVIGASJON
// ==========================================
function startQuiz() {
  let shuffled = shuffleArray([...quizDatabase]);
  activeQuestions = shuffled.slice(0, 5);

  // FIKSET FEIL: Sjekker nå nøye om 'options' eksisterer før den stokker om
  activeQuestions.forEach((q) => {
    if (q.type === "mc" && q.options) {
      q.options = shuffleArray([...q.options]);
    }
  });

  currentQuestionIndex = 0;
  userAnswers = {};
  questionPoints = {};

  switchScreen(startScreen, quizScreen);
  showQuestion();
}

function switchScreen(fromScreen, toScreen) {
  fromScreen.classList.remove("active");
  toScreen.classList.add("active");
  toScreen.classList.add("fade-in");
  setTimeout(() => {
    toScreen.classList.remove("fade-in");
  }, 300);
}

function showQuestion() {
  clearInterval(timerInterval);

  const currentQuestion = activeQuestions[currentQuestionIndex];

  questionNumberText.innerText = `Spørsmål ${currentQuestionIndex + 1} av 5`;
  questionText.innerText = currentQuestion.question;
  answerContainer.innerHTML = "";

  if (currentQuestionIndex === 0) {
    prevBtn.style.visibility = "hidden";
  } else {
    prevBtn.style.visibility = "visible";
  }

  if (currentQuestionIndex === activeQuestions.length - 1) {
    nextBtn.innerText = "Fullfør";
  } else {
    nextBtn.innerText = "Neste →";
  }

  if (currentQuestion.type === "mc") {
    currentQuestion.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.classList.add("option-btn");
      button.innerText = option.text;

      if (userAnswers[currentQuestionIndex] === index) {
        button.classList.add("selected");
      }

      button.onclick = () => {
        const buttons = answerContainer.getElementsByClassName("option-btn");
        for (let b of buttons) b.classList.remove("selected");

        button.classList.add("selected");
        userAnswers[currentQuestionIndex] = index;

        let basePoints = option.points;
        let bonus = 0;
        if (basePoints > 0) {
          bonus = Math.round((timeLeft / maxTimePerQuestion) * 2);
        }
        questionPoints[currentQuestionIndex] = basePoints + bonus;
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
      let typedText = input.value;
      userAnswers[currentQuestionIndex] = typedText;

      if (typedText.trim() !== "") {
        let match = currentQuestion.correctAnswers.find(
          (ans) => ans.text.toLowerCase() === typedText.trim().toLowerCase(),
        );

        if (match) {
          let bonus = Math.round((timeLeft / maxTimePerQuestion) * 2);
          questionPoints[currentQuestionIndex] = match.points + bonus;
        } else {
          questionPoints[currentQuestionIndex] = 0;
        }
      } else {
        questionPoints[currentQuestionIndex] = 0;
      }
    };

    answerContainer.appendChild(input);
  }

  startTimer();
}

// ==========================================
// 5. TIMER / TIDSBONUS LOGIKK
// ==========================================
function startTimer() {
  timeLeft = maxTimePerQuestion;
  timerBar.style.width = "100%";
  timerBar.style.backgroundColor = "#34a853";

  timerInterval = setInterval(() => {
    timeLeft -= 0.1;
    let percentage = (timeLeft / maxTimePerQuestion) * 100;
    timerBar.style.width = `${percentage}%`;

    if (percentage < 30) {
      timerBar.style.backgroundColor = "#ea4335";
    } else if (percentage < 60) {
      timerBar.style.backgroundColor = "#fbbc05";
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      if (questionPoints[currentQuestionIndex] === undefined) {
        questionPoints[currentQuestionIndex] = 0;
      }
    }
  }, 100);
}

// ==========================================
// 6. HÅNDTERING AV SVAR UNDERVEIS
// ==========================================
function handleNext() {
  if (questionPoints[currentQuestionIndex] === undefined) {
    questionPoints[currentQuestionIndex] = 0;
  }

  if (currentQuestionIndex < activeQuestions.length - 1) {
    currentQuestionIndex++;
    quizScreen.classList.add("fade-in");
    showQuestion();
    setTimeout(() => quizScreen.classList.remove("fade-in"), 300);
  } else {
    clearInterval(timerInterval);
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

function showResults() {
  let totalScore = 0;
  for (let i = 0; i < activeQuestions.length; i++) {
    totalScore += questionPoints[i] || 0;
  }

  scoreText.innerText = `Du fikk totalt ${totalScore} poeng!`;

  saveHighscore(totalScore);
  switchScreen(quizScreen, resultScreen);
  displayHighscores();
}

// ==========================================
// 7. HIGHSCORE LAGRING (localStorage)
// ==========================================
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
// 8. EVENT LISTENERS (Knappetrykk)
// ==========================================
startBtn.onclick = () => {
  startQuiz();
};

nextBtn.onclick = handleNext;
prevBtn.onclick = handlePrevious;
restartBtn.onclick = () => {
  startQuiz();
};

displayHighscores();
