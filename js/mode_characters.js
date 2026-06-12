// =========================
// mode_characters.js – Spielmodus: Charakter anhand Bild raten
// =========================

let allCharacters = [];   // Alle gefilterten Charaktere (gleiche Difficulty)
let decoyCharacters = []; // Charaktere die NICHT in den Fragen sind -> falsche Antworten
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
  lastMode = 'characters';
  lastDifficulty = diff;

  document.getElementById('question-image').classList.remove('hidden');
  document.getElementById('progress').classList.remove('hidden');

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

      const questionNames = new Set(questions.map(q => q.name));
      decoyCharacters = allCharacters.filter(c => !questionNames.has(c.name));

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
  // Falsche Antworten nur aus Charakteren die nicht in den Fragen sind
  let pool = decoyCharacters.map(c => c.name);

  // Falls nicht genug Koeder vorhanden: mit Fragen-Charakteren auffuellen (ausser richtige Antwort)
  if (pool.length < 3) {
    const extra = allCharacters
      .map(c => c.name)
      .filter(name => name !== correctName && !pool.includes(name));
    pool = [...pool, ...extra];
  }

  shuffleArray(pool);

  const options = [...pool.slice(0, 3), correctName];
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
  showViews('result-screen');
  showResultScreen(score, questions.length);
}