// =========================
// ui.js – Sichtbarkeit der Bereiche steuern
// =========================

const VIEWS = ['menu', 'menu-footer', 'menu-title', 'settings', 'difficulty', 'quiz', 'tf-quiz', 'result-screen'];

let lastMode = null;
let lastDifficulty = null;

function showViews(...visible) {
  VIEWS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
  visible.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
  });
}

function backToMenu() {
  showViews('menu', 'menu-footer', 'menu-title');
}

function playAgain() {
  hideResultScreen();
  if (lastMode === 'characters') {
    startQuizWithDifficulty(lastDifficulty);
  } else if (lastMode === 'truefalse') {
    startTrueFalseQuiz();
  }
}

function showDifficultySelection() {
  showViews('difficulty');
}