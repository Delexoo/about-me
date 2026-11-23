// Delexo motion: cluster placement and the flip, slide-out and shrink animations.
function shiftY(el) {
  let dy = 0;
  let node = el;
  while (node && node !== document.documentElement) {
    const transform = getComputedStyle(node).transform;
    if (transform && transform !== "none") dy += new DOMMatrix(transform).m42;
    node = node.parentElement;
  }
  return dy;
}

function placeCluster(instant) {
  const col = document.querySelector(".col-left");
  if (!col) return;
  const about = view === "profile" || view === "skills" || view === "certs" || view === "stack";
  const apply = (value) => {
    if (instant) col.style.transition = "none";
    if (col.style.paddingTop !== value) col.style.paddingTop = value;
    if (instant) {
      void col.offsetWidth;
      col.style.transition = "";
    }
  };
  if (!about) {
    apply("");
    return;
  }
  placeMore();
  if (window.innerWidth <= 980) {
    apply("");
    return;
  }
  const head = document.querySelector("h1");
  const tail = document.querySelector(".prose p:last-child");
  if (!head || !tail) {
    apply("");
    return;
  }
  const top = head.getBoundingClientRect().top + window.scrollY - shiftY(head);
  const bottom = tail.getBoundingClientRect().bottom + window.scrollY - shiftY(tail);
  const shift = (top + bottom) / 2 - window.innerHeight / 2;
  const current = parseFloat(getComputedStyle(col).paddingTop) || 0;
  apply(`${Math.max(36, Math.round(current - shift))}px`);
  placeMore();
}


function runFlip(panel, first) {
  const last = panel.getBoundingClientRect();
  if (!first.width || !last.width) return;
  const dx = first.left - last.left;
  const dy = first.top - last.top;
  const sx = first.width / last.width;
  const sy = first.height / last.height;
  if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(sx - 1) < 0.02 && Math.abs(sy - 1) < 0.02) return;
  panel.getAnimations().forEach((anim) => anim.cancel());
  panel.style.transformOrigin = "top left";
  const anim = panel.animate(
    [
      { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` },
      { transform: "translate(0px, 0px) scale(1, 1)" },
    ],
    { duration: 980, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
  );
  const clear = () => { panel.style.transformOrigin = ""; };
  anim.onfinish = clear;
  anim.oncancel = clear;
}

function runSlideOut(panel, first, duration) {
  const inline = panel.style.transform;
  panel.style.transform = "none";
  const base = panel.getBoundingClientRect();
  panel.style.transform = inline;
  if (!first || !first.width || !base.width) return [];
  const time = duration || 560;
  const dx = first.left - base.left;
  const dy = first.top - base.top;
  const distance = first.width * 1.05;
  panel.getAnimations().forEach((anim) => anim.cancel());
  const slide = panel.animate(
    [
      { transform: `translate(${dx}px, ${dy}px)` },
      { transform: `translate(${dx + distance}px, ${dy}px)` },
    ],
    { duration: time, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" }
  );
  const fade = panel.animate(
    [
      { opacity: 1, offset: 0 },
      { opacity: 1, offset: 0.6 },
      { opacity: 0, offset: 1 },
    ],
    { duration: time, easing: "linear", fill: "forwards" }
  );
  return [slide, fade];
}

function runShrink(panel, first) {
  const card = panel.querySelector(".card.is-on");
  if (!card) return;
  const last = card.getBoundingClientRect();
  const box = panel.getBoundingClientRect();
  if (!first.width || !last.width || !box.width) return;
  const scale = first.width / last.width;
  const dx = first.left + first.width / 2 - (last.left + last.width / 2);
  const dy = first.top + first.height / 2 - (last.top + last.height / 2);
  const cx = last.left + last.width / 2 - (box.left + box.width / 2);
  const cy = last.top + last.height / 2 - (box.top + box.height / 2);
  const tx = dx + (1 - scale) * cx;
  const ty = dy + (1 - scale) * cy;
  if (Math.abs(tx) < 1 && Math.abs(ty) < 1 && Math.abs(scale - 1) < 0.005) return;
  panel.getAnimations().forEach((anim) => anim.cancel());
  panel.style.transformOrigin = "center";
  document.body.classList.add("is-closing");
  const anim = panel.animate(
    [
      { transform: `translate(${tx}px, ${ty}px) scale(${scale})` },
      { transform: "translate(0px, 0px) scale(1)" },
    ],
    { duration: 980, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
  );
  const clear = () => {
    panel.style.transformOrigin = "";
    document.body.classList.remove("is-closing");
  };
  anim.onfinish = clear;
  anim.oncancel = clear;
}

function revealMobileInfo() {
  if (inAbout(view) || view === "socials") return;
  window.requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior: motionOk ? "smooth" : "auto" });
  });
}

