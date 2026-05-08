// =========================
// utils.js – Hilfsfunktionen
// Wird von allen Modi verwendet
// =========================

/**
 * Mischt ein Array zufällig (Fisher-Yates)
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Fügt Touch/Pointer-Feedback zu einem Button hinzu
 * @param {HTMLElement} btn
 * @param {Function} onClick - Callback bei Klick
 */
function addTapEffect(btn, onClick) {
  btn.addEventListener("pointerdown", () => btn.classList.add("active-mobile"));
  btn.addEventListener("pointerup", () => btn.classList.remove("active-mobile"));
  btn.addEventListener("pointerleave", () => btn.classList.remove("active-mobile"));
  btn.addEventListener("pointercancel", () => btn.classList.remove("active-mobile"));

  btn.addEventListener("click", () => {
    if (btn.classList.contains("disabled")) return;
    btn.classList.remove("active-mobile");
    onClick();
  });
}