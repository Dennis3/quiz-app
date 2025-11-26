let questions = [];
let currentQuestion = 0;
let score = 0;

// Mobile + Desktop Tap Effekt zuverlässig setzen/entfernen
function addTapEffect(btn, option) {
  btn.addEventListener("pointerdown", () => {
    btn.classList.add("active-mobile");
  });

  btn.addEventListener("pointerup", () => {
    btn.classList.remove("active-mobile");
  });

  btn.addEventListener("pointerleave", () => {
    btn.classList.remove("active-mobile");
  });

  btn.addEventListener("pointercancel", () => {
    btn.classList.remove("active-mobile");
  });

  btn.addEventListener("click", () => {
    btn.classList.remove("active-mobile");
    checkAnswer(option);
  });
}

// Kategorie starten und JSON laden
function startCategory(category) {
  document.getElementById('menu').classList.add('hidden');
  document.getElementById('menu-title').classList.add('hidden');   // Header ausblenden
  document.getElementById('menu-version').classList.add('hidden'); // Version ausblenden
  document.getElementById('quiz').classList.remove('hidden');
  currentQuestion = 0;
  score = 0;

  fetch(`questions/${category}.json`)
    .then(res => res.json())
    .then(data => {
      questions = data.map(q => ({
        ...q,
        image: `images/${category}/${q.image}`
      }));
      showQuestion();
    })
    .catch(err => console.error('Fehler beim Laden der Kategorie:', err));
}

// Hilfsfunktion: zufällige Auswahlmöglichkeiten erstellen
function getOptions(correctName) {
  let otherOptions = questions
    .map(q => q.name)
    .filter(name => name !== correctName);

  shuffleArray(otherOptions);

  let options = otherOptions.slice(0, 3);
  options.push(correctName);
  shuffleArray(options);
  return options;
}

// Array mischen
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Frage anzeigen
function showQuestion() {
  const question = questions[currentQuestion];
  const imageEl = document.getElementById('question-image');
  const optionsEl = document.getElementById('options');
  const progressEl = document.getElementById('progress');

  imageEl.src = question.image;
  imageEl.classList.remove('hidden');
  optionsEl.innerHTML = '';

  const options = getOptions(question.name);

  options.forEach(option => {
    const btn = document.createElement('button');
    btn.textContent = option;
    addTapEffect(btn, option);
    optionsEl.appendChild(btn);
  });

  progressEl.textContent = `Frage ${currentQuestion + 1} / ${questions.length}`;
  progressEl.classList.remove('hidden');
  document.getElementById('results').classList.add('hidden');
}

// Antwort prüfen
function checkAnswer(selected) {
  if (selected === questions[currentQuestion].name) score++;
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showResults();
  }
}

// Ergebnisse anzeigen
function showResults() {
  document.getElementById('options').innerHTML = '';
  document.getElementById('question-image').classList.add('hidden');
  document.getElementById('progress').classList.add('hidden');

  document.getElementById('score').textContent = `Dein Punktestand: ${score} / ${questions.length}`;
  document.getElementById('results').classList.remove('hidden');
}

// Zurück zum Hauptmenü
function backToMenu() {
  document.getElementById('results').classList.add('hidden');
  document.getElementById('quiz').classList.add('hidden');
  document.getElementById('menu').classList.remove('hidden');
  document.getElementById('menu-title').classList.remove('hidden');   // Header wieder anzeigen
  document.getElementById('menu-version').classList.remove('hidden'); // Version wieder anzeigen
  document.getElementById('question-image').classList.remove('hidden');
  document.getElementById('progress').classList.remove('hidden');
}
