// Delexo navigation: paint(), view changes, language and project stepping.
function paint() {
  document.body.dataset.view = view;
  document.getElementById("stage").dataset.view = view;
  document.documentElement.lang = lang;
  paintLang();
  paintIdentity();
  paintActions();
  paintNote();
  paintLower();
  paintPanel();
  paintDots();
  paintDiscord();
  placeCluster();
}


function goTo(next) {
  if (next === "profile") next = inAbout(view) ? "home" : "skills";
  if (next === "socials" && view === "socials") next = "home";
  if (!next || next === view) return;
  document.body.classList.remove("is-booting");
  if (next !== "project") {
    window.clearTimeout(projectSlideTimer);
    document.body.classList.remove("is-project-sliding");
  }
  const prev = view;
  const panel = document.getElementById("panel");
  const cardUp = (name) => name === "home" || name === "socials";
  const closing = motionOk && prev === "project" && cardUp(next);
  const shouldFlip = motionOk && ((cardUp(prev) && next === "project") || (prev === "project" && cardUp(next)));
  const active = panel.querySelector(".card.is-on");
  const first = shouldFlip && active ? active.getBoundingClientRect() : null;
  const slideOut = motionOk && window.innerWidth <= 980 && prev === "home" && inAbout(next);
  const exitToken = ++aboutExitToken;
  if (document.body.classList.contains("is-about-exit")) {
    panel.getAnimations().forEach((anim) => anim.cancel());
    document.body.classList.remove("is-about-exit");
  }
  if (slideOut) {
    const exitFrom = panel.getBoundingClientRect();
    const slideMs = 420;
    view = next;
    stopProgress();
    document.body.classList.add("is-about-exit");
    runSlideOut(panel, exitFrom, slideMs);
    window.setTimeout(() => {
      if (exitToken !== aboutExitToken) return;
      panel.getAnimations().forEach((anim) => anim.cancel());
      document.body.classList.remove("is-about-exit");
      paint();
      revealMobileInfo();
    }, slideMs + 20);
    return;
  }
  view = next;
  paint();
  if (view === "home" || view === "socials") scheduleAuto();
  else stopProgress();
  if (window.innerWidth <= 980) revealMobileInfo();
  if (!first) return;
  if (closing) {
    runShrink(panel, first);
    return;
  }
  const current = panel.querySelector(".card.is-on");
  if (current) runFlip(current, first);
}

function setLang(next) {
  if ((next !== "en" && next !== "es") || next === lang) return;
  lang = next;
  try { localStorage.setItem("delexo-lang", lang); } catch (err) { /* ignore */ }
  paint();
}


function setIndex(next) {
  if (next < 0 || next >= projects.length || next === index) return;
  const wrap = index === projects.length - 1 && next === 0 ? 1
    : index === 0 && next === projects.length - 1 ? -1
    : 0;
  document.body.classList.remove("is-booting");
  stopProgress();
  const deck = document.getElementById("deck");
  const previous = view === "project" && deck ? deck.querySelector(".card.is-on") : null;
  const step = wrap || (next > index ? 1 : -1);
  index = next;
  paintPanel(wrap);
  paintDots();
  scheduleAuto();
  if (view === "project") {
    actionKey = "";
    paintIdentity();
    paintActions();
    paintNote();
    slideProject(previous, step);
  }
}

function stepProjects(direction) {
  if (wrapBusy) {
    wrapQueue = direction;
    return;
  }
  const count = projects.length;
  sliding = true;
  setIndex((index + direction + count) % count);
}

