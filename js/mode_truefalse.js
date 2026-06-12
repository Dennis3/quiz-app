// =========================
// mode_truefalse.js – Spielmodus: Wahr oder Falsch
// =========================

let tfQuestions = [];
let tfCurrent = 0;
let tfScore = 0;
let tfAnswered = false;
let tfTimeout = null; // Aktiver Timeout – wird bei neuer Frage abgebrochen

/**
 * Startet das Wahr/Falsch-Quiz mit der gewählten Schwierigkeit
 * @param {number} diff - 0 = alle, 1 = normal, 2 = schwer, 3 = unmöglich
 */
function startTrueFalseQuiz() {
  tfCurrent = 0;
  tfScore = 0;
  tfAnswered = false;
  lastMode = 'truefalse';
  lastDifficulty = null;

  document.getElementById('tf-buttons').classList.remove('hidden');

  showViews('tf-quiz');

  fetch('questions/true-false/index.json')
    .then(res => res.json())
    .then(fileList =>
      Promise.all(
        fileList.map(filename =>
          fetch(`questions/true-false/${filename}`).then(res => res.json())
        )
      )
    )
    .then(results => {
      const data = results.flat();

      if (data.length === 0) {
        alert('Keine Fragen verfügbar!');
        backToMenu();
        return;
      }

      const questionCount = Math.min(getQuestionAmount(), data.length);
      tfQuestions = shuffleArray([...data]).slice(0, questionCount);

      showTFQuestion();
    })
    .catch(err => {
      console.error('Fehler beim Laden:', err);
      alert('Fehler beim Laden der Fragen.');
      backToMenu();
    });
}

/**
 * Zeigt die aktuelle Frage an
 */
function showTFQuestion() {
  clearTimeout(tfTimeout);
  tfAnswered = false;

  const q = tfQuestions[tfCurrent];

  document.getElementById('tf-progress').textContent =
    `Frage ${tfCurrent + 1} / ${tfQuestions.length}`;

  document.getElementById('tf-question').textContent = q.question;

  // Buttons zurücksetzen
  const trueBtn = document.getElementById('tf-true');
  const falseBtn = document.getElementById('tf-false');
  trueBtn.className = '';
  falseBtn.className = '';
  trueBtn.disabled = false;
  falseBtn.disabled = false;

  // Erklärung verstecken
  document.getElementById('tf-explanation').classList.add('hidden');
  document.getElementById('tf-explanation').textContent = '';
}

/**
 * Wertet die Antwort aus
 * @param {boolean} selected - true = Wahr, false = Falsch
 */
function checkTrueFalse(selected) {
  if (tfAnswered) return;
  tfAnswered = true;

  const q = tfQuestions[tfCurrent];
  const correct = q.answer;

  const trueBtn = document.getElementById('tf-true');
  const falseBtn = document.getElementById('tf-false');

  // Buttons sperren
  trueBtn.disabled = true;
  falseBtn.disabled = true;

  // Richtigen Button grün markieren
  if (correct === true) {
    trueBtn.classList.add('correct');
  } else {
    falseBtn.classList.add('correct');
  }

  // Falsch gewählten Button rot markieren
  if (selected !== correct) {
    if (selected === true) {
      trueBtn.classList.add('wrong');
    } else {
      falseBtn.classList.add('wrong');
    }
  } else {
    tfScore++;
  }

  // Erklärung nur bei falscher Antwort anzeigen
  if (selected !== correct && q.explanation) {
    const expEl = document.getElementById('tf-explanation');
    expEl.textContent = q.explanation;
    expEl.classList.remove('hidden');
  }

  tfTimeout = setTimeout(() => {
    tfCurrent++;
    if (tfCurrent < tfQuestions.length) {
      showTFQuestion();
    } else {
      showTFResults();
    }
  }, q.explanation ? 2000 : 1000); // Mehr Zeit wenn Erklärung sichtbar
}

/**
 * Zeigt das Ergebnis
 */
function showTFResults() {
  document.getElementById('tf-progress').textContent = '';
  document.getElementById('tf-question').textContent = '';
  document.getElementById('tf-buttons').classList.add('hidden');
  document.getElementById('tf-explanation').classList.add('hidden');
  showViews('result-screen');
  showResultScreen(tfScore, tfQuestions.length);
}