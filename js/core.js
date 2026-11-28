// Delexo core: shared state and small helpers.
let lang = "en";
let view = "home";
let index = 0;
let booted = false;
let actionKey = "";
let aboutExitToken = 0;
let lowerKey = "";
let clusterHold = false;
let clusterClosing = false;
let clusterSwitching = false;
let clusterCloseToken = 0;
let mobileSocialsRevealTimer = 0;
let mobileNavBusy = false;
let wheelAcc = 0;
let wheelAt = 0;
let sliding = false;
let dragged = false;

const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function esc(value) {
  return String(value).replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
  }[char]));
}

function icon(name) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${glyphs[name]}</svg>`;
}

function text(t) {
  return copy[lang][t];
}

function paintText(id, value) {
  const el = document.getElementById(id);
  if (el.textContent === value) return;
  el.textContent = value;
  if (!booted || !motionOk) return;
  el.classList.remove("swap");
  void el.offsetWidth;
  el.classList.add("swap");
}


function tip(label) {
  return `<span class="tip">${esc(label)}</span>`;
}


function inAbout(name) {
  return name === "profile" || name === "skills" || name === "certs" || name === "stack";
}

function mobileShowsDeck(name) {
  // On phones Links is a centered icon grid — the project deck stays off-screen.
  return name === "home";
}

