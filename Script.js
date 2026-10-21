
"use strict";

// ==========================================
// ELEMENTS
// ==========================================

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

// ==========================================
// CUSTOMIZE YOUR WEBSITE HERE
// ==========================================

const proposalMessages = [
  "Think again 😢",
  "Are you sure? 🥺",
  "Please don't say no 💗",
  "Last chance ❤️"
];

const images = [
  "(>‿◠)✌",
  "(╥_╥)",
  "(｡•́︿•̀｡)",
  "(づ｡◕‿‿◕｡)づ"
];

const gifts = [
  {
    title: "Gift 1",
    emoji: "🎁",
    message: "A pocket of hugs for you. Sending you the biggest hug! 🤗"
  },
  {
    title: "Gift 2",
    emoji: "🍫",
    message: "Sweet like you, always. You make my world sweeter! 🍫❤️"
  },
  {
    title: "Gift 3",
    emoji: "🌹",
    message: "A rose for my rose. You deserve all the love in the world! 🌹"
  }
];

const quizQuestions = [
  {
    question: "Who is the absolute boss in this relationship?",
    options: ["Obviously You ❤️", "Me", "My Mom"],
    answerIndex: 0
  },
  {
    question: "What is our cutest activity together?",
    options: ["Endless hugs", "Arguing about food", "All of the above"],
    answerIndex: 2
  }
];

const finalNoteText =
  "Thank you for being in my life. You make every day special " +
  "and I feel lucky to have you. Forever yours ❤️";

// Put KALYANI.mp3 in the SAME folder as index.html.
// Set to "" if you don't want background music.
const musicURL = "KALYANI.mp3";

// ==========================================
// STATE
// ==========================================

let noClickCount = 0;
let solvedCount = 0;
let musicStarted = false;

// ==========================================
// SCREEN NAVIGATION
// ==========================================

function showScreen(id) {
  const target = document.getElementById(id);

  if (!target) {
    console.error("Screen not found:", id);
    return;
  }

  document.querySelectorAll(".screen").forEach((screen) => {
    const isActive = screen.id === id;

    screen.classList.toggle("active", isActive);
    screen.setAttribute("aria-hidden", String(!isActive));
  });
}

// ==========================================
// BACKGROUND MUSIC
// ==========================================

function startMusic() {
  if (!musicEl || !musicURL) return;

  if (!musicEl.getAttribute("src")) {
    musicEl.src = musicURL;
  }

  musicEl.volume = 0.35;

  const playPromise = musicEl.play();

  if (playPromise && typeof playPromise.catch === "function") {
    playPromise
      .then(() => {
        musicStarted = true;
      })
      .catch((error) => {
        // iPhone Safari may block playback until a user taps.
        console.log("Music playback waiting for user interaction.", error);
      });
  }
}

// ==========================================
// FLOATING HEARTS
// ==========================================

function createHearts() {
  if (!heartsContainer) return;

  const heart = document.createElement("span");

  heart.textContent = "❤";
  heart.style.left = Math.random() * 100 + "%";
  heart.style.animationDuration = 6 + Math.random() * 6 + "s";
  heart.style.fontSize = 12 + Math.random() * 18 + "px";

  heartsContainer.appendChild(heart);

  setTimeout(() => heart.remove(), 12000);
}

// ==========================================
// CONFETTI
// ==========================================

function showConfetti(count = 50) {
  for (let i = 0; i < count; i++) {
    const confetti = document.createElement("div");

    confetti.className = "confetti";
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.top = -20 - Math.random() * 80 + "px";
    confetti.style.backgroundColor =
      `hsl(${Math.random() * 360}, 90%, 70%)`;
    confetti.style.animationDelay = Math.random() * 0.4 + "s";

    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 3500);
  }
}

// ==========================================
// NO BUTTON
// ==========================================

function moveNoButton() {
  const area = document.querySelector(".proposal-actions");

  if (!area || !noBtn) return;

  const areaRect = area.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  // Keep the button within its parent area.
  const maxLeft = Math.max(0, areaRect.width - btnRect.width);
  const maxTop = Math.max(0, areaRect.height - btnRect.height);

  noBtn.style.position = "absolute";
  noBtn.style.margin = "0";
  noBtn.style.left = Math.random() * maxLeft + "px";
  noBtn.style.top = Math.random() * maxTop + "px";
}

function growYesButton() {
  if (!yesBtn) return;

  const scale = Math.min(1 + noClickCount * 0.12, 1.8);
  yesBtn.style.transform = `scale(${scale})`;
}

function handleNoClick() {
  if (noBtn.disabled) return;

  const messageIndex = noClickCount % proposalMessages.length;

  proposalTitle.textContent = proposalMessages[messageIndex];
  proposalImage.textContent = images[messageIndex];

  proposalMessage.textContent = "Hehe, try the other button! 💗";

  noClickCount++;

  growYesButton();
  moveNoButton();
}

// ==========================================
// YES BUTTON
// ==========================================

function handleYesClick() {
  if (yesBtn.disabled) return;

  showConfetti(80);

  proposalMessage.textContent = "Yayyy ❤️ You are mine!";
  proposalTitle.textContent = "Yayyy ❤️ You are mine!";
  proposalImage.textContent = "(づ｡◕‿‿◕｡)づ";

  yesBtn.disabled = true;
  noBtn.disabled = true;

  startMusic();

  // Move to the gifts screen after the celebration.
  setTimeout(() => {
    showScreen("gifts");
  }, 1500);
}

// ==========================================
// GIFTS
// ==========================================

function renderGifts() {
  if (!giftGrid) return;

  giftGrid.innerHTML = "";

  gifts.forEach((gift) => {
    const card = document.createElement("button");

    card.type = "button";
    card.className = "gift-card";
    card.setAttribute("aria-label", gift.title);

    const emoji = document.createElement("div");
    emoji.className = "gift-emoji";
    emoji.textContent = gift.emoji;

    const title = document.createElement("div");
    title.textContent = gift.title;

    card.appendChild(emoji);
    card.appendChild(title);

    card.addEventListener("click", () => {
      giftMessage.textContent = gift.message;
      giftModal.classList.add("active");
      giftModal.setAttribute("aria-hidden", "false");
    });

    giftGrid.appendChild(card);
  });
}

function closeModal() {
  if (!giftModal) return;

  giftModal.classList.remove("active");
  giftModal.setAttribute("aria-hidden", "true");
}

// ==========================================
// QUIZ
// ==========================================

function renderQuiz() {
  if (!quizList) return;

  quizList.innerHTML = "";
  solvedCount = 0;

  submitQuizBtn.disabled = true;
  quizStatus.textContent = "";

  quizQuestions.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "quiz-card";

    const question = document.createElement("p");
    question.className = "quiz-question";
    question.textContent = `${index + 1}. ${item.question}`;

    card.appendChild(question);

    item.options.forEach((option, optionIndex) => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "option-btn";
      button.textContent = option;

      button.addEventListener("click", () => {
        // Don't count a question more than once.
        if (card.dataset.solved === "true") return;

        const buttons = card.querySelectorAll(".option-btn");

        buttons.forEach((node) => {
          node.classList.remove("wrong", "correct");
        });

        if (optionIndex === item.answerIndex) {
          button.classList.add("correct");
          card.dataset.solved = "true";

          // Lock answers once the correct choice is selected.
          buttons.forEach((node) => {
            node.disabled = true;
          });

          solvedCount++;
          showConfetti(20);
        } else {
          button.classList.add("wrong");
          quizStatus.textContent = "Not quite! Try another answer 💗";
        }

        if (solvedCount === quizQuestions.length) {
          quizStatus.textContent = "Perfect! You nailed it! ❤️";
          submitQuizBtn.disabled = false;
        }
      });

      card.appendChild(button);
    });

    quizList.appendChild(card);
  });
}

// ==========================================
// FINAL LETTER
// ==========================================

function initLetter() {
  if (finalNoteEl) {
    finalNoteEl.textContent = finalNoteText;
  }
}

// ==========================================
// SUBMIT QUIZ
// ==========================================

function handleSubmitQuiz() {
  if (submitQuizBtn.disabled) return;

  showConfetti(40);
  showScreen("submit");

  setTimeout(() => {
    showScreen("final");
    startMusic();
  }, 1800);
}

// ==========================================
// INITIALIZE ALL BUTTONS
// ==========================================

function init() {
  // Proposal buttons
  yesBtn.addEventListener("click", handleYesClick);
  noBtn.addEventListener("click", handleNoClick);

  // Gift and quiz navigation
  toQuizBtn.addEventListener("click", () => {
    renderQuiz();
    showScreen("quiz");
  });

  submitQuizBtn.addEventListener("click", handleSubmitQuiz);

  // Gift modal
  closeModalBtn.addEventListener("click", closeModal);

  giftModal.addEventListener("click", (event) => {
    if (event.target === giftModal) {
      closeModal();
    }
  });

  // Retry music after a genuine user interaction.
  document.addEventListener(
    "pointerdown",
    () => {
      if (!musicStarted) startMusic();
    },
    { passive: true }
  );

  // Initial setup
  renderGifts();
  renderQuiz();
  initLetter();
  showScreen("proposal");

  // Start floating hearts.
  createHearts();
  setInterval(createHearts, 700);

  console.log("Website initialized successfully!");
}

// Run after the HTML elements are available.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
