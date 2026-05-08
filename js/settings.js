// =========================
// settings.js – Einstellungen
// =========================

function openSettings() {
  const saved = localStorage.getItem("questionAmount");
  if (saved) {
    document.getElementById("questionAmount").value = saved;
  }
  showViews('settings');
}

function closeSettings() {
  backToMenu();
}

function saveSettings() {
  const amount = document.getElementById("questionAmount").value;
  localStorage.setItem("questionAmount", amount);
  closeSettings();
}

/**
 * Gibt die gespeicherte Fragenanzahl zurück (Standard: 10)
 */
function getQuestionAmount() {
  return parseInt(localStorage.getItem("questionAmount") || "10");
}
