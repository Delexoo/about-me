// Delexo main: boot the app.
function init() {
  try {
    const saved = localStorage.getItem("delexo-lang");
    if (saved === "en" || saved === "es") lang = saved;
  } catch (err) { /* ignore */ }
  document.body.classList.add("is-booting");
  paint();
  booted = true;
  bind();
  bindCursor();
  window.setTimeout(() => {
    document.body.classList.remove("is-booting");
    if (!sliding && !progressAnim) armAuto();
  }, 1100);
}

init();
