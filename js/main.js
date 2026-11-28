// Delexo main: boot the app.
function init() {
  try {
    const saved = localStorage.getItem("delexo-lang");
    if (saved === "en" || saved === "es") lang = saved;
  } catch (err) { /* ignore */ }
  document.body.classList.add("is-booting");
  if (motionOk) document.body.classList.add("is-deck-boot");
  paint();
  trackProfileViews();
  if (!motionOk) document.body.classList.remove("is-deck-boot");
  booted = true;
  bind();
  bindCursor();
  const finishHeaderBoot = () => {
    document.body.classList.remove("is-booting");
    if (!motionOk && !sliding && !progressAnim) armAuto();
  };
  if (motionOk) {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => deckBootEnter());
    });
    window.setTimeout(finishHeaderBoot, 880);
  } else {
    finishHeaderBoot();
  }
}

init();
