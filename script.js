let allData = [];
let questions = [];
let currentIndex = 0;
let score = 0;

async function startCategory(category) {
  const menu = document.getElementById('menu');
  const quiz = document.getElementById('quiz');

  menu.classList.add('hidden');
  quiz.classList.remove('hidden');

  const response = await fetch(`${category}.json`);
  allData = await response.json();

  questions = shuffle(allData).slice(0, 10);
  currentIndex = 0;
  score = 0;

  loadQuestion();
}

function loadQuestion() {
  const q = questions[currentIndex];
  document.getElementById('question-image').src = `images/${q.image}`;

  const optionsDiv = document.getElementById('options');
  optionsDiv.innerHTML = '';

  const options = getOptions(q, allData);
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.textContent = opt.name;
    btn.onclick = () => checkAnswer(opt, q);
    optionsDiv.appendChild(btn);
  });

  document.getElementById('progress').textContent = `${currentIndex + 1} / ${questions.length}`;
}

function checkAnswer(selected, correct) {
  if (selected.name === correct.name) score++;

  currentIndex++;
  if (currentIndex < questions.length) {
    loadQuestion();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  const quiz = document.getElementById('quiz');
  quiz.innerHTML = `<h2>Fertig!</h2><p>Punkte: ${score} / ${questions.length}</p>`;
}

function getOptions(correct, data) {
  const wrong = shuffle(data.filter(c => c.name !== correct.name)).slice(0, 3);
  return shuffle([...wrong, correct]);
}

function shuffle(arr) {
  return arr.sort(() => 0.5 - Math.random());
}
