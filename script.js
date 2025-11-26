let allCharacters = [];
let questions = [];
let currentQuestion = 0;
let score = 0;

function addTapEffect(btn, option) {
  btn.addEventListener("pointerdown", () => btn.classList.add("active-mobile"));
  btn.addEventListener("pointerup", () => btn.classList.remove("active-mobile"));
  btn.addEventListener("pointerleave", () => btn.classList.remove("active-mobile"));
  btn.addEventListener("pointercancel", () => btn.classList.remove("active-mobile"));

  btn.addEventListener("click", () => {
    btn.classList.remove("active-mobile");
    checkAnswer(option);
  });
}

function openSettings() {
  document.getElementById('settings').classList.remove('hidden');
  document.getElementById('menu').classList.add('hidden');
  document.getElementById('settings-btn').classList.add('hidden');

  const saved = localStorage.getItem("questionAmount");
  if (saved) {
    document.getElementById("questionAmount").value = saved;
  }
}

function closeSettings() {
  document.getElementById('settings').classList.add('hidden');
  document.getElementById('menu').classList.remove('hidden');
  document.getElementById('settings-btn').classList.remove('hidden');
}

function saveSettings() {
  const amount = document.getElementById("questionAmount").value;
  localStorage.setItem("questionAmount", amount);
  closeSettings();
}

function startCategory(category) {
  document.getElementById('menu').classList.add('hidden');
  document.getElementById('settings-btn').classList.add('hidden');
  document.getElementById('menu-title').classList.add('hidden');
  document.getElementById('menu-version').classList.add('hidden');
  document.getElementById('quiz').classList.remove('hidden');
  document.getElementById('progress').classList.remove('hidden');


  currentQuestion = 0;
  score = 0;

  let questionCount = parseInt(localStorage.getItem("questionAmount") || "10");

  fetch(`questions/${category}.json`)
    .then(res => res.json())
    .then(data => {
      allCharacters = data.map(q => ({
        ...q,
        image: `images/${category}/${q.image}`
      }));

      questions = [...allCharacters];
      shuffleArray(questions);

      questionCount = Math.min(questionCount, questions.length);
      questions = questions.slice(0, questionCount);

      showQuestion();
    })
    .catch(err => console.error('Fehler beim Laden der Kategorie:', err));
}

function getOptions(correctName) {
  let otherOptions = allCharacters
    .map(c => c.name)
    .filter(name => name !== correctName);

  shuffleArray(otherOptions);

  let options = otherOptions.slice(0, 3);
  options.push(correctName);

  shuffleArray(options);
  return options;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function showQuestion() {
  const q = questions[currentQuestion];
  const image = document.getElementById('question-image');
  const optionsEl = document.getElementById('options');

  image.src = q.image;
  image.classList.remove('hidden');
  optionsEl.innerHTML = '';

  const opts = getOptions(q.name);

  opts.forEach(option => {
    const btn = document.createElement('button');
    btn.textContent = option;
    addTapEffect(btn, option);
    optionsEl.appendChild(btn);
  });

  document.getElementById('progress').textContent =
    `Frage ${currentQuestion + 1} / ${questions.length}`;
}

function checkAnswer(selected) {
  if (selected === questions[currentQuestion].name) score++;
  currentQuestion++;

  if (currentQuestion < questions.length) showQuestion();
  else showResults();
}

function showResults() {
  document.getElementById('options').innerHTML = '';
  document.getElementById('question-image').classList.add('hidden');
  document.getElementById('progress').classList.add('hidden');

  document.getElementById('score').textContent =
    `Dein Punktestand: ${score} / ${questions.length}`;

  document.getElementById('results').classList.remove('hidden');
}

function backToMenu() {
  document.getElementById('results').classList.add('hidden');
  document.getElementById('quiz').classList.add('hidden');
  document.getElementById('menu').classList.remove('hidden');
  document.getElementById('menu-title').classList.remove('hidden');
  document.getElementById('menu-version').classList.remove('hidden');
  document.getElementById('settings-btn').classList.remove('hidden');
}
