// =========================
// results.js – Gemeinsamer Ergebnis-Screen
// Von allen Modi verwendet
// =========================

/**
 * Zeigt den Ergebnis-Screen an
 * @param {number} score  - Erreichte Punkte
 * @param {number} total  - Gesamtanzahl Fragen
 */
function showResultScreen(score, total) {
  document.getElementById('result-score').textContent =
    `Dein Punktestand: ${score} / ${total}`;
  document.getElementById('result-screen').classList.remove('hidden');
}

/**
 * Versteckt den Ergebnis-Screen
 */
function hideResultScreen() {
  document.getElementById('result-screen').classList.add('hidden');
}