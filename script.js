const proposalTitle = document.getElementById("proposalTitle");
const proposalImage = document.getElementById("proposalImage");
const proposalMessage = document.getElementById("proposalMessage");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const toQuizBtn = document.getElementById("toQuizBtn");
const submitQuizBtn = document.getElementById("submitQuizBtn");
const quizStatus = document.getElementById("quizStatus");
const giftGrid = document.getElementById("giftGrid");
const giftModal = document.getElementById("giftModal");
const giftMessage = document.getElementById("giftMessage");
const closeModalBtn = document.getElementById("closeModalBtn");
const quizList = document.getElementById("quizList");
const finalNoteEl = document.getElementById("finalNoteText");
const heartsContainer = document.querySelector(".hearts");
const musicEl = document.getElementById("bgMusic");

// Easy customization zone
const proposalMessages = [
  "Think again 😢",
  "Are you sure 😠",
  "Please don’t say no 🥺",
  "Last chance ❤️",
];

const images = ["(>‿◠)✌", "(╥_╥)", "(｡•́︿•̀｡)", "(づ｡◕‿‿◕｡)づ"];

const gifts = [
  { title: "Gift 1", emoji: "🎁", message: "A pocket of hugs for you." },
  { title: "Gift 2", emoji: "🍫", message: "Sweet like you, always." },
  { title: "Gift 3", emoji: "🌹", message: "A rose for my rose." },
];

const quizQuestions = [
  {
    question: "Who is the absolute boss in this relationship?",
    options: ["Obviously You ❤️", "Me", "My Mom"],
    answerIndex: 0,
  },
  {
    question: "What is our cutest activity together?",
    options: ["Endless hugs", "Arguing about food", "All of the above"],
    answerIndex: 2,
  },
];

const finalNoteText =
  "Thank you for being in my life. You make every day special and I feel lucky " +
  "to have you. Forever yours ❤️";

const musicURL = "KALYANI.mp3"; // Replace with any Bollywood love song file

let noClickCount = 0;
let solvedCount = 0;

function startMusic() {
  if (!musicURL) {
    return;
  }

  if (!musicEl.src) {
    musicEl.src = musicURL;
    musicEl.volume = 0.35;
  }

  if (musicEl.paused) {
    musicEl.play().catch(() => {
      // Autoplay can be blocked; a user interaction will retry.
    });
  }
}

function setupMusicAutoplay() {
  startMusic();

  const resumeOnGesture = () => {
    startMusic();
    document.removeEventListener("click", resumeOnGesture);
    document.removeEventListener("touchstart", resumeOnGesture);
  };

  document.addEventListener("click", resumeOnGesture);
  document.addEventListener("touchstart", resumeOnGesture);
}

function createHearts() {
  const heart = document.createElement("span");
  heart.textContent = "❤";
  heart.style.left = Math.random() * 100 + "%";
  heart.style.animationDuration = 6 + Math.random() * 6 + "s";
  heart.style.fontSize = 12 + Math.random() * 18 + "px";
  heartsContainer.appendChild(heart);

  setTimeout(() => heart.remove(), 12000);
}

setInterval(createHearts, 320);

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.toggle("active", screen.id === id);
  });
}

function moveNoButton() {
  const area = document.querySelector(".proposal-actions");
  const areaRect = area.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();
  const padding = 8;

  const maxLeft = areaRect.width - btnRect.width - padding;
  const maxTop = areaRect.height - btnRect.height - padding;

  const randomLeft = Math.max(0, Math.random() * maxLeft);
  const randomTop = Math.max(0, Math.random() * maxTop);

  noBtn.style.position = "absolute";
  noBtn.style.left = randomLeft + "px";
  noBtn.style.top = randomTop + "px";
}

function growYesButton() {
  const scale = 1 + noClickCount * 0.14;
  yesBtn.style.transform = `scale(${scale})`;
}

function handleNoClick() {
  moveNoButton();

  const messageIndex = noClickCount % proposalMessages.length;
  proposalTitle.textContent = proposalMessages[messageIndex];
  proposalImage.textContent = images[messageIndex] || images[0];

  noClickCount += 1;
  growYesButton();
}

function showConfetti(count) {
  const confettiCount = count || 70;
  for (let i = 0; i < confettiCount; i += 1) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 90%, 70%)`;
    confetti.style.animationDelay = Math.random() * 0.4 + "s";
    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 3500);
  }
}

function handleYesClick() {
  showConfetti(80);
  proposalMessage.textContent = "Yayyy ❤️ You are mine!";
  proposalTitle.textContent = "Yayyy ❤️ You are mine!";
  proposalImage.textContent = "(づ｡◕‿‿◕｡)づ";
  yesBtn.disabled = true;
  noBtn.disabled = true;
  noBtn.style.opacity = "0.6";

  startMusic();

  setTimeout(() => showScreen("gifts"), 2000);
}

function renderGifts() {
  giftGrid.innerHTML = "";
  gifts.forEach((gift) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "gift-card";
    card.innerHTML = `
      <div class="gift-emoji">${gift.emoji}</div>
      <div>${gift.title}</div>
    `;

    card.addEventListener("click", () => {
      giftMessage.textContent = gift.message;
      giftModal.classList.add("active");
      giftModal.setAttribute("aria-hidden", "false");
    });

    giftGrid.appendChild(card);
  });
}

function closeModal() {
  giftModal.classList.remove("active");
  giftModal.setAttribute("aria-hidden", "true");
}

function renderQuiz() {
  quizList.innerHTML = "";
  solvedCount = 0;
  submitQuizBtn.disabled = true;
  quizQuestions.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "quiz-card";

    const question = document.createElement("p");
    question.className = "quiz-question";
    question.textContent = item.question;
    card.appendChild(question);

    item.options.forEach((option, optionIndex) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";
      btn.textContent = option;

      btn.addEventListener("click", () => {
        if (btn.classList.contains("correct")) {
          return;
        }

        const buttons = card.querySelectorAll(".option-btn");
        buttons.forEach((node) => node.classList.remove("wrong"));

        if (optionIndex === item.answerIndex) {
          btn.classList.add("correct");
          if (!card.dataset.solved) {
            card.dataset.solved = "true";
            solvedCount += 1;
            showConfetti(25);
          }
        } else {
          btn.classList.add("wrong");
        }

        if (solvedCount === quizQuestions.length) {
          quizStatus.textContent = "Perfect! You nailed it.";
          submitQuizBtn.disabled = false;
        } else {
          quizStatus.textContent = "";
        }
      });

      card.appendChild(btn);
    });

    quizList.appendChild(card);
  });
}

function initLetter() {
  finalNoteEl.textContent = finalNoteText;
}

function handleSubmitQuiz() {
  showConfetti(30);
  showScreen("submit");

  setTimeout(() => {
    showScreen("final");
    startMusic();
  }, 1800);
}

noBtn.addEventListener("click", handleNoClick);
noBtn.addEventListener("mouseenter", handleNoClick);
yesBtn.addEventListener("click", handleYesClick);

toQuizBtn.addEventListener("click", () => showScreen("quiz"));
submitQuizBtn.addEventListener("click", handleSubmitQuiz);
closeModalBtn.addEventListener("click", closeModal);
giftModal.addEventListener("click", (event) => {
  if (event.target === giftModal) {
    closeModal();
  }
});

renderGifts();
renderQuiz();
initLetter();
setupMusicAutoplay();
