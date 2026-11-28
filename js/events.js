// Delexo events: click, keyboard, wheel, pointer and cursor binding.
function bind() {
  window.addEventListener("wheel", (event) => {
    const browsing = view === "home" || view === "socials" || view === "project";
    if (!browsing || event.ctrlKey || discordOpen) return;
    const onCard = event.target.closest && event.target.closest("#panel, .dots, .col-right");
    if (!onCard) return;
    event.preventDefault();
    const line = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
    const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY * line : 0;
    if (!delta) return;
    const now = performance.now();
    if (now - wheelAt > 160) wheelAcc = 0;
    wheelAt = now;
    if (wheelAcc === 1 || wheelAcc === -1) return;
    wheelAcc += delta;
    if (Math.abs(wheelAcc) < 24) return;
    const direction = wheelAcc > 0 ? 1 : -1;
    wheelAcc = direction;
    stepProjects(direction);
  }, { passive: false });

  window.addEventListener("resize", () => {
    placeCluster(true);
    if (inAbout(view)) placeMore();
    if (view !== "home" && view !== "socials" && view !== "project") return;
    const deck = document.getElementById("deck");
    if (deck) deck.style.transition = "none";
    placeDeck();
    if (deck) {
      void deck.offsetWidth;
      deck.style.transition = "";
    }
  });

  const panel = document.getElementById("panel");
  const dots = document.getElementById("dots");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const holdAuto = (on) => {
    autoHold = on;
    if (!progressAnim) {
      if (!on) scheduleAuto();
      return;
    }
    if (on) progressAnim.pause();
    else progressAnim.play();
  };
  if (finePointer) {
    panel.addEventListener("pointerenter", () => holdAuto(true));
    panel.addEventListener("pointerleave", () => holdAuto(false));
    dots.addEventListener("pointerenter", () => holdAuto(true));
    dots.addEventListener("pointerleave", () => holdAuto(false));
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopProgress();
    else scheduleAuto();
  });
  panel.addEventListener("mousedown", (event) => {
    const cardBtn = event.target.closest("[data-card]");
    if (!cardBtn || Number(cardBtn.dataset.card) === index) return;
    event.preventDefault();
  });
  let touchY = 0;
  let touchX = 0;
  panel.addEventListener("touchstart", (event) => {
    if (view !== "home" && view !== "socials" && view !== "project") return;
    touchY = event.touches[0].clientY;
    touchX = event.touches[0].clientX;
  }, { passive: true });
  panel.addEventListener("touchend", (event) => {
    if (view !== "home" && view !== "socials" && view !== "project") return;
    const dy = touchY - event.changedTouches[0].clientY;
    const dx = touchX - event.changedTouches[0].clientX;
    const deckEl = document.getElementById("deck");
    const across = !!deckEl && getComputedStyle(deckEl).flexDirection === "row";
    if (across) {
      if (Math.abs(dx) < 42 || Math.abs(dx) < Math.abs(dy)) return;
      dragged = true;
      stepProjects(dx > 0 ? 1 : -1);
      return;
    }
    if (Math.abs(dy) < 42 || Math.abs(dy) < Math.abs(dx)) return;
    dragged = true;
    stepProjects(dy > 0 ? 1 : -1);
  }, { passive: true });

  document.addEventListener("click", (event) => {
    if (dragged) {
      dragged = false;
      event.preventDefault();
      return;
    }
    const langBtn = event.target.closest("[data-lang]");
    if (langBtn) {
      setLang(langBtn.dataset.lang);
      return;
    }
    const go = event.target.closest("[data-go]");
    if (go) {
      goTo(go.dataset.go);
      return;
    }
    if (event.target.closest("#discord-accept")) {
      openDiscordProfile();
      return;
    }
    if (event.target.closest("[data-discord-close]")) {
      setDiscordOpen(false);
      return;
    }
    if (event.target.closest("[data-discord]")) {
      setDiscordOpen(true);
      return;
    }
    const dot = event.target.closest("[data-dot]");
    if (dot && (view === "home" || view === "socials" || view === "project")) {
      setIndex(Number(dot.dataset.dot));
      return;
    }
    const cardBtn = event.target.closest("[data-card]");
    if (cardBtn && (view === "home" || view === "socials")) {
      const next = Number(cardBtn.dataset.card);
      if (next === index) goTo("project");
      else setIndex(next);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (discordOpen) {
        setDiscordOpen(false);
        return;
      }
      if (view === "project") goTo("home");
      else if (inAbout(view) || view === "socials") goTo("home");
      return;
    }
    const browsable = view === "home" || view === "socials" || view === "project";
    if (browsable && (event.key === "ArrowDown" || event.key === "ArrowRight")) {
      event.preventDefault();
      stepProjects(1);
    }
    if (browsable && (event.key === "ArrowUp" || event.key === "ArrowLeft")) {
      event.preventDefault();
      stepProjects(-1);
    }
    if ((event.key === "Enter" || event.key === " ") && event.target.closest && event.target.closest(".card.is-on") && (view === "home" || view === "socials")) {
      event.preventDefault();
      goTo("project");
    }
  });
}

function bindCursor() {
  const cursor = document.getElementById("cursor");
  const visit = document.getElementById("visit-tip");
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!cursor || !fine) return;
  let x = 0;
  let y = 0;
  let tx = 0;
  let ty = 0;
  let active = false;
  let overCard = false;
  let linkTipHtml = "";
  const placeVisit = () => {
    if (!visit) return;
    const cardTip = overCard && (view === "home" || view === "socials");
    if (cardTip) {
      const label = copy[lang].visit;
      if (visit.textContent !== label) visit.textContent = label;
    } else if (linkTipHtml) {
      if (visit.innerHTML !== linkTipHtml) visit.innerHTML = linkTipHtml;
    } else if (visit.textContent) {
      visit.textContent = "";
    }
    const show = cardTip || !!linkTipHtml;
    visit.hidden = false;
    visit.classList.toggle("is-on", show);
    if (!show) return;
    const width = visit.offsetWidth;
    const height = visit.offsetHeight;
    let left = x + 18;
    let top = y + 22;
    let corner = "tl";
    if (left + width > window.innerWidth - 12) {
      left = x - width - 12;
      corner = "tr";
    }
    if (top + height > window.innerHeight - 12) {
      top = y - height - 16;
      corner = corner === "tl" ? "bl" : "br";
    }
    visit.dataset.corner = corner;
    visit.style.transform = `translate(${left}px, ${top}px)`;
  };
  let raf = 0;
  const tick = () => {
    raf = 0;
    const follow = motionOk ? 0.45 : 1;
    x += (tx - x) * follow;
    y += (ty - y) * follow;
    cursor.style.transform = `translate(${x - 5}px, ${y - 4.2}px)`;
    placeVisit();
    if (active && (Math.abs(tx - x) > 0.15 || Math.abs(ty - y) > 0.15)) {
      raf = window.requestAnimationFrame(tick);
    }
  };
  const kick = () => {
    if (!raf) raf = window.requestAnimationFrame(tick);
  };
  window.addEventListener("pointermove", (event) => {
    tx = event.clientX;
    ty = event.clientY;
    const card = event.target.closest && event.target.closest(".card.is-on");
    overCard = !!(card && !card.hasAttribute("data-clone"));
    const link = event.target.closest && event.target.closest(".prose-link");
    const linkTipEl = link ? link.querySelector(".tip") : null;
    linkTipHtml = linkTipEl ? linkTipEl.innerHTML.trim() : "";
    if (!active) {
      x = tx;
      y = ty;
      active = true;
      cursor.classList.add("is-on");
    }
    placeVisit();
    kick();
  });
  document.addEventListener("pointerleave", () => {
    active = false;
    overCard = false;
    linkTipHtml = "";
    cursor.classList.remove("is-on");
    if (visit) visit.classList.remove("is-on");
    if (raf) {
      window.cancelAnimationFrame(raf);
      raf = 0;
    }
  });
}

