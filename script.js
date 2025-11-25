let questions = [];
let currentQuestion = 0;
let score = 0;

// Kategorie starten und JSON laden
function startCategory(category) {
  document.getElementById('menu').classList.add('hidden');
  document.getElementById('quiz').classList.remove('hidden');
  currentQuestion = 0;
  score = 0;

  fetch(`questions/${category}.json`)
    .then(res => res.json())
    .then(data => {
      // Bildpfad aus /images hinzufügen
      questions = data.map(q => ({
        ...q,
        image: `images/${category}/${q.image}` // Unterordner nach Kategorie
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

  let options = otherOptions.slice(0, 3); // 3 zufällige falsche Antworten
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
    btn.onclick = () => checkAnswer(option);
    optionsEl.appendChild(btn);
  });

  // >>> HIER EINSETZEN <<<
  const optionButtons = optionsEl.querySelectorAll('button');
  optionButtons.forEach(btn => {
    btn.addEventListener('touchend', () => btn.blur());
    btn.addEventListener('click', () => btn.blur());
  });
  // <<< HIER ENDE <<<

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
  document.getElementById('question-image').classList.remove('hidden');
  document.getElementById('progress').classList.remove('hidden');
}
