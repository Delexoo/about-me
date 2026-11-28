// Delexo navigation: paint(), view changes, language and project stepping.
function isClusterToggleNav(next, from) {
  return (
    inAbout(next) ||
    next === "socials" ||
    (next === "home" && (inAbout(from) || from === "socials"))
  );
}

function lockMobileNav() {
  mobileNavBusy = true;
  document.body.classList.add("is-mobile-nav-busy");
}

function unlockMobileNav() {
  mobileNavBusy = false;
  document.body.classList.remove("is-mobile-nav-busy");
}

function releaseMobileNav(exitToken) {
  if (exitToken === aboutExitToken) unlockMobileNav();
}

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
  if (!clusterHold) placeCluster();
}


function goTo(next) {
  if (next === "profile") next = inAbout(view) ? "home" : "skills";
  if (next === "socials" && view === "socials") next = "home";
  if (!next || next === view) return;
  const mobileEarly = motionOk && window.innerWidth <= 980;
  if (mobileEarly && mobileNavBusy) return;
  if (!mobileEarly && (clusterClosing || clusterSwitching) && isClusterToggleNav(next, view)) return;
  if (clusterClosing || clusterSwitching) abortClusterClose();
  if (mobileEarly && !mobileNavBusy) cancelMobileDeckReveal();
  window.clearTimeout(mobileSocialsRevealTimer);
  document.body.classList.remove("is-booting", "is-deck-boot", "is-socials-await");
  if (next === "project") {
    wrapBusy = false;
    wrapQueue = 0;
    sliding = false;
  } else {
    document.body.classList.remove("is-project-sliding");
  }
  const prev = view;
  const panel = document.getElementById("panel");
  const cardUp = (name) => name === "home" || name === "socials";
  const closing = motionOk && prev === "project" && cardUp(next);
  const shouldFlip = motionOk && ((cardUp(prev) && next === "project") || (prev === "project" && cardUp(next)));
  const active = panel.querySelector(".card.is-on");
  const first = shouldFlip && active ? active.getBoundingClientRect() : null;
  // Peek positions of every non-active card, captured before the view switches,
  // so the neighbours can glide off-screen on the same clock as the morph.
  const deckEl = active ? active.parentElement : null;
  const neighborEls = shouldFlip && deckEl ? [...deckEl.children].filter((c) => c !== active) : [];
  const firsts = shouldFlip && neighborEls.length ? neighborEls.map((n) => n.getBoundingClientRect()) : null;
  const mobile = motionOk && window.innerWidth <= 980;
  const slideOut = mobile && prev === "home" && inAbout(next);
  const slideIn = mobile && inAbout(prev) && next === "home";
  const deckExit =
    mobile && mobileShowsDeck(prev) && !mobileShowsDeck(next) && !slideOut && next !== "project";
  const deckEnter =
    mobile && !mobileShowsDeck(prev) && mobileShowsDeck(next) && !slideIn;
  const exitToken = ++aboutExitToken;
  if (document.body.classList.contains("is-about-exit")) {
    panel.getAnimations().forEach((anim) => anim.cancel());
    document.body.classList.remove("is-about-exit");
  }
  // Leaving the profile on a phone: the portrait slides off first, and only
  // then does the project deck come back, so the two never overlap.
  if (slideIn) {
    lockMobileNav();
    const portrait = document.querySelector(".portrait");
    view = next;
    stopProgress();
    document.body.classList.add("is-about-exit");
    if (portrait) {
      portrait.animate(
        [
          { transform: "translateX(0px)", opacity: 1 },
          { transform: "translateX(70%)", opacity: 0 },
        ],
        { duration: MOBILE_PROFILE_PORTRAIT_MS, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" }
      );
    }
    window.setTimeout(() => {
      if (exitToken !== aboutExitToken) return;
      if (portrait) {
        portrait.getAnimations().forEach((anim) => anim.cancel());
        portrait.style.transform = "";
        portrait.style.opacity = "";
      }
      document.body.classList.add("is-deck-await");
      paint();
      revealMobileInfo();
      document.body.classList.remove("is-about-exit");
      mobileDeckRevealEnter(true).then(() => {
        if (exitToken !== aboutExitToken || view !== "home") return;
        scheduleAuto();
      }).finally(() => releaseMobileNav(exitToken));
    }, motionOk ? MOBILE_PROFILE_PORTRAIT_MS : 0);
    return;
  }
  if (slideOut) {
    lockMobileNav();
    const target = next;
    stopProgress();
    document.body.classList.add("is-about-exit");
    mobileDeckRevealExit().then(() => {
      if (exitToken !== aboutExitToken) return;
      view = target;
      paint();
      revealMobileInfo();
      document.body.classList.remove("is-about-exit");
    }).finally(() => releaseMobileNav(exitToken));
    return;
  }
  const mobileCloseSocials = mobile && prev === "socials" && next === "home";
  if (mobileCloseSocials) {
    lockMobileNav();
    stopProgress();
    const row = document.getElementById("social-row");
    if (row && !row.hidden && motionOk) {
      row.classList.remove("is-in");
      void row.offsetWidth;
      row.classList.add("is-out");
    }
    window.setTimeout(() => {
      if (exitToken !== aboutExitToken) return;
      if (row) {
        row.classList.remove("is-out");
        row.hidden = true;
      }
      view = "home";
      document.body.classList.add("is-deck-await");
      paint();
      revealMobileInfo();
      mobileDeckRevealEnter(true).then(() => {
        if (exitToken !== aboutExitToken || view !== "home") return;
        scheduleAuto();
      }).finally(() => releaseMobileNav(exitToken));
    }, motionOk ? MOBILE_SOCIALS_ROW_OUT_MS : 0);
    return;
  }
  const mobileOpenSocials = mobile && prev === "home" && next === "socials";
  if (mobileOpenSocials) {
    lockMobileNav();
    stopProgress();
    mobileDeckRevealExit({ holdPanelOffscreen: true }).then(() => {
      if (exitToken !== aboutExitToken) {
        releaseMobileNav(exitToken);
        return;
      }
      view = "socials";
      document.body.classList.add("is-socials-await");
      paint();
      revealMobileInfo();
      mobileSocialsRevealTimer = window.setTimeout(() => {
        if (exitToken !== aboutExitToken || view !== "socials") return;
        revealMobileSocialRow();
        releaseMobileNav(exitToken);
      }, MOBILE_SOCIALS_LINKS_DELAY_MS);
    });
    return;
  }
  if (deckExit) {
    lockMobileNav();
    const target = next;
    stopProgress();
    mobileDeckRevealExit().then(() => {
      if (exitToken !== aboutExitToken) return;
      view = target;
      paint();
      revealMobileInfo();
      if (mobileShowsDeck(view)) scheduleAuto();
    }).finally(() => releaseMobileNav(exitToken));
    return;
  }
  if (deckEnter) {
    lockMobileNav();
    stopProgress();
    view = next;
    document.body.classList.add("is-deck-await");
    paint();
    mobileDeckRevealEnter(true).then(() => {
      if (exitToken !== aboutExitToken) return;
      scheduleAuto();
    }).finally(() => releaseMobileNav(exitToken));
    return;
  }
  const closeSocials =
    motionOk && window.innerWidth > 980 && prev === "socials" && next === "home";
  const closeAbout =
    motionOk && window.innerWidth > 980 && inAbout(prev) && next === "home";
  const swapToAbout =
    motionOk && window.innerWidth > 980 && prev === "socials" && inAbout(next);
  const swapToSocials =
    motionOk && window.innerWidth > 980 && inAbout(prev) && next === "socials";
  if (closeSocials) {
    if (clusterClosing || clusterSwitching) return;
    stopProgress();
    clusterClosing = true;
    closeSocialsTransition(() => {
      scheduleAuto();
    });
    return;
  }
  if (closeAbout) {
    if (clusterClosing || clusterSwitching) return;
    stopProgress();
    clusterClosing = true;
    closeAboutTransition(() => {
      scheduleAuto();
    });
    return;
  }
  if (swapToAbout) {
    if (clusterClosing || clusterSwitching) return;
    swapSocialsForAboutTransition(next, scheduleAuto);
    return;
  }
  if (swapToSocials) {
    if (clusterClosing || clusterSwitching) return;
    swapAboutForSocialsTransition(scheduleAuto);
    return;
  }
  // Home uses flex centring; profile and links use padding-top. Without a bridge
  // the column snaps the moment the view flips or the social row mounts.
  const openCluster =
    motionOk &&
    window.innerWidth > 980 &&
    prev === "home" &&
    (inAbout(next) || next === "socials");
  if (openCluster) {
    const identity = document.querySelector(".col-left .identity");
    const anchorTop = identity ? identity.getBoundingClientRect().top : 0;
    clusterHold = true;
    view = next;
    stopProgress();
    paint();
    clusterHold = false;
    openClusterTransition(anchorTop);
    return;
  }
  const stepping = (prev === "project" && cardUp(next)) || (cardUp(prev) && next === "project");
  const col = stepping ? document.querySelector(".col-left") : null;
  if (col) col.style.transition = "none";
  cancelNeighbors(active);
  if (closing) document.body.classList.add("is-closing");
  else if (shouldFlip) document.body.classList.add("is-flipping");
  if (
    shouldFlip &&
    mobile &&
    cardUp(prev) &&
    next === "project" &&
    document.body.classList.contains("is-dots-ready")
  ) {
    document.body.classList.add("is-dots-exit");
    void document.body.offsetWidth;
  }
  view = next;
  // Reset a scrolled mobile page instantly, before the panel starts sliding, so
  // the vertical scroll and the horizontal slide never overlap.
  if (window.innerWidth <= 980 && !inAbout(view) && view !== "socials") {
    window.scrollTo(0, 0);
  }
  const deckElLive = document.getElementById("deck");
  if (shouldFlip && deckElLive) {
    deckElLive.style.transition = "none";
    deckElLive.getAnimations().forEach((anim) => anim.cancel());
  }
  paint();
  if (col) {
    void col.offsetWidth;
    col.style.transition = "";
  }
  if (mobileShowsDeck(view)) scheduleAuto();
  else stopProgress();
  if (!first) {
    document.body.classList.remove("is-closing", "is-flipping");
    return;
  }
  if (closing) {
    const currentCard = panel.querySelector(".card.is-on");
    // Measure the peek slots before the shrink animation starts: once the panel
    // is animating, descendant rects read back transformed and would lie.
    const deckForPeeks = currentCard ? currentCard.parentElement : null;
    const peekEls = deckForPeeks ? [...deckForPeeks.children].filter((c) => c !== currentCard) : [];
    void panel.offsetWidth;
    const homeCardRect = currentCard ? currentCard.getBoundingClientRect() : null;
    const peekRects = peekEls.length ? peekEls.map((n) => n.getBoundingClientRect()) : null;
    if (!runShrink(panel, first)) document.body.classList.remove("is-closing");
    else if (currentCard && homeCardRect && peekRects) runNeighborsIn(currentCard, homeCardRect, peekEls, peekRects);
    return;
  }
  const current = panel.querySelector(".card.is-on");
  if (!current) {
    document.body.classList.remove("is-flipping");
    return;
  }
  void panel.offsetWidth;
  if (!runFlip(panel, first, firsts, neighborEls)) document.body.classList.remove("is-flipping");
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
  document.body.classList.remove("is-booting", "is-deck-boot");
  stopProgress();
  const deck = document.getElementById("deck");
  const previous = view === "project" && deck ? deck.querySelector(".card.is-on") : null;
  const step = wrap || (next > index ? 1 : -1);
  // Keep the outgoing full panel visible across the paint that switches is-on.
  if (view === "project" && previous && motionOk) {
    document.body.classList.add("is-project-sliding");
    previous.classList.add("is-project-exit");
  }
  index = next;
  if (view === "project") {
    paintPanel(0);
    paintDots();
    scheduleAuto();
    actionKey = "";
    paintIdentity();
    paintActions();
    paintNote();
    slideProject(previous, step);
    return;
  }
  // Home/socials: animate the deck rail (including wrap via clones).
  paintPanel(wrap);
  paintDots();
  scheduleAuto();
}

function stepProjects(direction) {
  if (wrapBusy || (view === "project" && sliding)) {
    wrapQueue = direction;
    return;
  }
  const count = projects.length;
  sliding = true;
  setIndex((index + direction + count) % count);
}

