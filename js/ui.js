// =========================
// ui.js – Sichtbarkeit der Bereiche steuern
// Alle show/hide Logik an einem Ort
// =========================

// Alle bekannten Bereiche
const VIEWS = ['menu', 'menu-footer', 'menu-title', 'settings', 'difficulty', 'quiz'];

/**
 * Blendet alle Bereiche aus und zeigt nur die gewünschten an.
 * @param {string[]} visible - IDs der Elemente die sichtbar sein sollen
 */
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

/**
 * Zeigt das Hauptmenü
 */
function backToMenu() {
  // Quiz-State zurücksetzen falls nötig
  document.getElementById('results').classList.add('hidden');
  document.getElementById('progress').classList.remove('hidden');

  showViews('menu', 'menu-footer', 'menu-title');
}

/**
 * Zeigt die Difficulty-Auswahl
 */
function showDifficultySelection() {
  showViews('difficulty');
}
