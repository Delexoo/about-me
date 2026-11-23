// Delexo deck: card markup, deck placement, auto-advance and project slides.
function slideMarkup(project, i, clone) {
  return `
    <button type="button" class="card${clone ? " is-clone" : ""}" data-card="${i}"${clone ? ' data-clone="1"' : ""} style="--wash: ${project.wash}">
      <div class="wash"></div>
      <div class="panel-body">
        <div class="browser">
          <div class="browser-bar"><i></i><i></i><i></i><span>${esc(project.host)}</span></div>
          <img src="${project.image}" alt="" draggable="false" />
        </div>
        <span class="card-name">${esc(project.name)}</span>
      </div>
    </button>
  `;
}

let deckReady = false;

let wrapToken = 0;
let wrapBusy = false;
let wrapQueue = 0;

function placeDeck(wrapDirection) {
  const panel = document.getElementById("panel");
  const deck = document.getElementById("deck");
  if (!deck) return;
  const cards = [...deck.children];
  const browsing = view === "home" || view === "socials";
  const openWord = lang === "es" ? "Abrir" : "Open";
  const showWord = lang === "es" ? "Ver" : "Show";
  cards.forEach((card) => {
    const i = Number(card.dataset.card);
    const on = !card.hasAttribute("data-clone") && i === index;
    card.classList.toggle("is-on", on);
    card.tabIndex = browsing && on ? 0 : -1;
    card.setAttribute("aria-label", `${on ? openWord : showWord} ${projects[i].name}`);
    if (on) card.setAttribute("aria-current", "true");
    else card.removeAttribute("aria-current");
  });
  if (view === "project") {
    deck.style.gap = "0px";
    deck.style.transform = "none";
    return;
  }
  if (!browsing && !inAbout(view)) return;
  if (window.innerWidth <= 980 && (inAbout(view) || view === "socials")) return;
  if (wrapBusy && !wrapDirection) return;
  const card = cards.find((item) => !item.hasAttribute("data-clone")) || cards[0];
  if (!card) return;
  const across = getComputedStyle(deck).flexDirection === "row";
  const axis = across ? "X" : "Y";
  const panelSize = across ? panel.clientWidth : panel.clientHeight;
  const cardSize = across ? card.getBoundingClientRect().width : card.getBoundingClientRect().height;
  if (panelSize < 40 || cardSize < 40) return;
  const peek = 64;
  const gap = Math.max(28, (panelSize - cardSize) / 2 - peek);
  const step = cardSize + gap;
  const center = (panelSize - cardSize) / 2;
  const shift = (value) => {
    deck.style.transform = `translate${axis}(${value}px)`;
  };
  let slot = index + 2;
  if (wrapDirection === 1) slot = projects.length + 2;
  if (wrapDirection === -1) slot = 1;
  const snap = !wrapDirection && (!browsing || !deckReady || deck.style.transform === "none");
  if (snap) deck.style.transition = "none";
  deck.style.gap = `${gap}px`;
  shift(center - slot * step);
  if (snap) {
    void deck.offsetWidth;
    deck.style.transition = "";
    deckReady = true;
  }
  if (!wrapDirection) return;
  const token = ++wrapToken;
  wrapBusy = true;
  const settle = () => {
    if (token !== wrapToken) return;
    wrapToken += 1;
    wrapBusy = false;
    deck.style.transition = "none";
    placeDeck(0);
    void deck.offsetWidth;
    deck.style.transition = "";
    const queued = wrapQueue;
    wrapQueue = 0;
    if (queued) stepProjects(queued);
  };
  if (!motionOk) {
    settle();
    return;
  }
  const onEnd = (event) => {
    if (event.target !== deck || event.propertyName !== "transform") return;
    deck.removeEventListener("transitionend", onEnd);
    settle();
  };
  deck.addEventListener("transitionend", onEnd);
  window.setTimeout(() => {
    deck.removeEventListener("transitionend", onEnd);
    settle();
  }, 760);
}

function paintPanel(wrapDirection) {
  const panel = document.getElementById("panel");
  panel.removeAttribute("role");
  panel.removeAttribute("aria-label");
  panel.tabIndex = -1;
  if (!panel.querySelector(".deck")) {
    const last = projects.length - 1;
    const secondLast = (last - 1 + projects.length) % projects.length;
    const second = projects.length > 1 ? 1 : 0;
    const markup = [
      slideMarkup(projects[secondLast], secondLast, true),
      slideMarkup(projects[last], last, true),
      ...projects.map((project, i) => slideMarkup(project, i)),
      slideMarkup(projects[0], 0, true),
      slideMarkup(projects[second], second, true),
    ].join("");
    panel.innerHTML = `<div class="deck" id="deck">${markup}</div>`;
    panel.querySelectorAll("img").forEach((img) => {
      img.addEventListener("error", () => img.closest(".card").classList.add("no-shot"));
    });
  }
  placeDeck(wrapDirection || 0);
}

let autoTimer = 0;
let fillTimer = 0;
let progressAnim = null;
let autoHold = false;
const AUTO_MS = 4200;

function clearFill() {
  document.querySelectorAll(".pip-fill").forEach((fill) => {
    fill.getAnimations().forEach((anim) => anim.cancel());
    fill.style.transform = "";
    fill.style.transformOrigin = "";
  });
}

function stopProgress() {
  window.clearTimeout(autoTimer);
  window.clearTimeout(fillTimer);
  progressAnim = null;
  clearFill();
}

function scheduleAuto() {
  window.clearTimeout(autoTimer);
  window.clearTimeout(fillTimer);
  if (progressAnim) {
    progressAnim.cancel();
    progressAnim = null;
  }
  if (!motionOk || autoHold || discordOpen || view !== "home") return;
  autoTimer = window.setTimeout(() => { sliding = false; }, motionOk ? 280 : 0);
  fillTimer = window.setTimeout(() => {
    if (!autoHold && !sliding) armAuto();
  }, motionOk ? 520 : 0);
}

function armAuto() {
  if (!motionOk || autoHold || discordOpen || view !== "home") return;
  const el = document.getElementById("dots");
  const fill = el && el.querySelector(".dot.is-on .pip-fill");
  if (!fill) return;
  const across = getComputedStyle(el).flexDirection === "row";
  fill.style.transformOrigin = across ? "left center" : "top center";
  const frames = across
    ? [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }]
    : [{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }];
  progressAnim = fill.animate(frames, { duration: AUTO_MS, easing: "linear", fill: "forwards" });
  progressAnim.onfinish = () => {
    progressAnim = null;
    if (autoHold || discordOpen || view !== "home") return;
    stepProjects(1);
  };
}


let projectSlideTimer = 0;

function slideProject(previous, step) {
  if (!motionOk || !previous || !step) return;
  const deck = document.getElementById("deck");
  const panel = document.getElementById("panel");
  const current = deck && deck.querySelector(".card.is-on");
  if (!current || current === previous || !panel) return;
  const across = getComputedStyle(deck).flexDirection === "row";
  const axis = across ? "X" : "Y";
  const distance = (across ? panel.clientWidth : panel.clientHeight) || 600;
  const ease = "cubic-bezier(0.45, 0.05, 0.25, 1)";
  const duration = 620;
  previous.getAnimations().forEach((anim) => anim.cancel());
  current.getAnimations().forEach((anim) => anim.cancel());
  document.body.classList.add("is-project-sliding");
  window.clearTimeout(projectSlideTimer);
  projectSlideTimer = window.setTimeout(() => {
    document.body.classList.remove("is-project-sliding");
  }, duration + 60);
  previous.animate(
    [
      { opacity: 1, transform: `translate${axis}(0px)` },
      { opacity: 1, transform: `translate${axis}(${-distance * step}px)` },
    ],
    { duration, easing: ease }
  );
  current.animate(
    [
      { opacity: 1, transform: `translate${axis}(${distance * step}px)` },
      { opacity: 1, transform: `translate${axis}(0px)` },
    ],
    { duration, easing: ease }
  );
}

