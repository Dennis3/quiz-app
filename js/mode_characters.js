// =========================
// mode_characters.js – Spielmodus: Charakter anhand Bild raten
// =========================

let allCharacters = [];
let questions = [];
let currentQuestion = 0;
let score = 0;

/**
 * Startet das Quiz mit der gewählten Schwierigkeit
 * @param {number} diff - 0 = alle, 1 = normal, 2 = schwer, 3 = unmöglich
 */
function startQuizWithDifficulty(diff) {
  currentQuestion = 0;
  score = 0;

  showViews('quiz');

  fetch('questions/characters/index.json')
    .then(res => res.json())
    .then(fileList =>
      Promise.all(
        fileList.map(filename =>
          fetch(`questions/characters/${filename}`).then(res => res.json())
        )
      )
    )
    .then(results => {
      const data = results.flat();
      const filtered = diff > 0 ? data.filter(q => q.difficulty === diff) : data;

      allCharacters = filtered.map(q => ({
        ...q,
        image: `images/characters/${q.image}`
      }));

      if (allCharacters.length === 0) {
        alert('Keine Charaktere für diese Schwierigkeit verfügbar!');
        backToMenu();
        return;
      }

      const questionCount = Math.min(getQuestionAmount(), allCharacters.length);
      questions = shuffleArray([...allCharacters]).slice(0, questionCount);

      showQuestion();
    })
    .catch(err => {
      console.error('Fehler beim Laden:', err);
      alert('Fehler beim Laden der Fragen.');
      backToMenu();
    });
}

/**
 * Gibt 4 Antwortoptionen zurück (1 richtig, 3 zufällig)
 */
function getOptions(correctName) {
  const others = allCharacters
    .map(c => c.name)
    .filter(name => name !== correctName);

  shuffleArray(others);

  const options = [...others.slice(0, 3), correctName];
  shuffleArray(options);
  return options;
}

/**
 * Zeigt die aktuelle Frage an
 */
function showQuestion() {
  const q = questions[currentQuestion];

  const image = document.getElementById('question-image');
  image.src = q.image;
  image.classList.remove('hidden');

  const optionsEl = document.getElementById('options');
  optionsEl.innerHTML = '';

  getOptions(q.name).forEach(option => {
    const btn = document.createElement('button');
    btn.textContent = option;
    addTapEffect(btn, () => checkAnswer(option));
    optionsEl.appendChild(btn);
  });

  document.getElementById('progress').textContent =
    `Frage ${currentQuestion + 1} / ${questions.length}`;
}

/**
 * Wertet die gewählte Antwort aus
 */
function checkAnswer(selected) {
  const correct = questions[currentQuestion].name;
  const buttons = document.querySelectorAll("#options button");

  buttons.forEach(btn => {
    btn.classList.add("disabled");

    if (btn.textContent === correct) {
      btn.classList.add("correct");
    } else if (btn.textContent === selected) {
      btn.classList.add("wrong");
    }
  });

  if (selected === correct) score++;

  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      showQuestion();
    } else {
      showResults();
    }
  }, 1000);
}

/**
 * Zeigt das Ergebnis am Ende des Quiz
 */
function showResults() {
  document.getElementById('options').innerHTML = '';
  document.getElementById('question-image').classList.add('hidden');
  document.getElementById('progress').classList.add('hidden');
  document.getElementById('score').textContent =
    `Dein Punktestand: ${score} / ${questions.length}`;
  document.getElementById('results').classList.remove('hidden');
}