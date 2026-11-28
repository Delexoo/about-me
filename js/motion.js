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

function stackPaddingPx(head, tail, floor) {
  const col = document.querySelector(".col-left");
  if (!col || !head || !tail) return floor;
  const top = head.getBoundingClientRect().top + window.scrollY - shiftY(head);
  const bottom = tail.getBoundingClientRect().bottom + window.scrollY - shiftY(tail);
  const shift = (top + bottom) / 2 - window.innerHeight / 2;
  const current = parseFloat(getComputedStyle(col).paddingTop) || 0;
  return Math.max(floor, Math.round(current - shift));
}

function placeCluster(instant) {
  const col = document.querySelector(".col-left");
  if (!col) return;
  const about = inAbout(view);
  const socials = view === "socials";
  const apply = (value) => {
    if (instant) col.style.transition = "none";
    if (col.style.paddingTop !== value) col.style.paddingTop = value;
    if (instant) {
      void col.offsetWidth;
      col.style.transition = "";
    }
  };
  if (!about && !socials) {
    apply("");
    col.style.justifyContent = "";
    return;
  }
  if (about) placeMore();
  if (window.innerWidth <= 980) {
    apply("");
    return;
  }
  if (about) {
    col.style.justifyContent = "flex-start";
    apply("");
    return;
  }
  const head = document.querySelector("h1");
  const tail = about
    ? document.querySelector(".prose p:last-child")
    : document.querySelector(".social-row:not([hidden])");
  if (!head || !tail) {
    apply("");
    return;
  }
  apply(`${stackPaddingPx(head, tail, 36)}px`);
  placeMore();
}

function openClusterTransition(anchorTop) {
  const col = document.querySelector(".col-left");
  const identity = document.querySelector(".col-left .identity");
  if (!col || !identity) {
    placeCluster();
    return;
  }
  col.style.transition = "none";
  col.style.justifyContent = "flex-start";
  const delta = anchorTop - identity.getBoundingClientRect().top;
  const pad = parseFloat(getComputedStyle(col).paddingTop) || 0;
  col.style.paddingTop = `${Math.round(pad + delta)}px`;
  void col.offsetWidth;
  col.style.transition = "";
  col.style.justifyContent = "";
  placeCluster();
  if (view !== "socials") return;
  revealSocialRow(true, true);
}

function openAboutCluster(anchorTop) {
  openClusterTransition(anchorTop);
}

const MOBILE_SOCIALS_LINKS_DELAY_MS = 200;
const MOBILE_SOCIALS_ROW_OUT_MS = 520;
const MOBILE_DECK_PANEL_MS = 520;
const MOBILE_DECK_DOT_MS = 400;
const MOBILE_DECK_DOT_STAGGER_MS = 60;
const MOBILE_PROFILE_PORTRAIT_MS = 440;

function mobileDeckChaptersMs(dotCount) {
  if (dotCount < 1) return 0;
  return MOBILE_DECK_DOT_MS + dotCount * MOBILE_DECK_DOT_STAGGER_MS;
}

function mobileDeckPairMs(dotCount, includeDots) {
  const chapters = includeDots ? mobileDeckChaptersMs(dotCount) : 0;
  return Math.max(MOBILE_DECK_PANEL_MS, chapters);
}
const CLUSTER_CLOSE_PAD_MS = 680;
const CLUSTER_CONTENT_OUT_MS = 420;
const CLUSTER_SWAP_OUT_MS = 220;
const CLUSTER_SWAP_ABOUT_OUT_MS = 280;
const CLUSTER_SWAP_PAD_MS = 360;

function measureHomePadding(head, tail, hideEls) {
  const col = document.querySelector(".col-left");
  if (!col || !head || !tail) return 0;
  const saved = hideEls.map((el) => (el ? el.style.display : ""));
  hideEls.forEach((el) => {
    if (el) el.style.display = "none";
  });
  void col.offsetHeight;
  const pad = stackPaddingPx(head, tail, 0);
  hideEls.forEach((el, i) => {
    if (el) el.style.display = saved[i];
  });
  return pad;
}

function finishAboutPortraitForHome() {
  document.body.classList.remove("is-about-closing");
  const portrait = document.querySelector(".portrait");
  const panel = document.getElementById("panel");
  if (portrait) {
    portrait.style.transition = "";
    portrait.style.transform = "";
    portrait.style.opacity = "";
  }
  if (panel) {
    panel.style.transition = "";
    panel.style.transform = "";
    panel.style.opacity = "";
  }
}

function beginAboutPortraitExit() {
  if (window.innerWidth <= 980 || !motionOk) return;
  document.body.classList.add("is-about-closing");
  void document.body.offsetWidth;
}

function beginClusterPaddingDown(col, head, tail, hideEls) {
  const startPad = parseFloat(getComputedStyle(col).paddingTop) || 0;
  col.style.justifyContent = "flex-start";
  col.style.transition = "none";
  col.style.paddingTop = `${Math.round(startPad)}px`;
  void col.offsetWidth;
  col.style.transition = `padding-top ${CLUSTER_CLOSE_PAD_MS}ms var(--ease-soft)`;
  const targetPad = measureHomePadding(head, tail, hideEls);
  col.style.paddingTop = `${targetPad}px`;
}

function resetIdentityDrift(identity) {
  if (!identity) return;
  identity.getAnimations().forEach((a) => a.cancel());
  identity.style.transform = "";
  identity.style.willChange = "";
}

function abortClusterClose() {
  clusterCloseToken += 1;
  clusterClosing = false;
  clusterSwitching = false;
  clusterHold = false;
  document.body.classList.remove("is-about-closing", "is-cluster-swapping");
  const col = document.querySelector(".col-left");
  if (col) col.style.transition = "";
  resetIdentityDrift(document.querySelector(".col-left .identity"));
  resetSocialRowLayout();
}

function releaseClusterToHome(col, done) {
  const identity = col.querySelector(".identity");
  const anchorTop = identity ? identity.getBoundingClientRect().top : 0;
  col.style.transition = "none";
  col.style.paddingTop = "";
  col.style.justifyContent = "";
  view = "home";
  clusterHold = true;
  paint();
  clusterHold = false;
  finishAboutPortraitForHome();
  done();
  if (!identity) return;
  const drift = anchorTop - identity.getBoundingClientRect().top;
  if (Math.abs(drift) < 1.5) return;
  identity.style.willChange = "transform";
  const anim = identity.animate(
    [
      { transform: `translateY(${drift}px)` },
      { transform: "translateY(0px)" },
    ],
    { duration: 420, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "both" }
  );
  const settle = () => resetIdentityDrift(identity);
  if (anim) {
    anim.onfinish = settle;
    anim.oncancel = settle;
  } else settle();
  window.setTimeout(settle, 480);
}

function settleClusterIdentity(identity, firstTop, token, done) {
  const complete = () => {
    resetIdentityDrift(identity);
    clusterHold = false;
    placeCluster(true);
    done();
  };
  if (!identity || !motionOk) {
    complete();
    return;
  }
  const dy = firstTop - identity.getBoundingClientRect().top;
  identity.style.transition = "none";
  identity.style.willChange = "transform";
  identity.style.transform = Math.abs(dy) < 0.5 ? "translateY(0px)" : `translateY(${dy}px)`;
  void identity.offsetWidth;
  window.requestAnimationFrame(() => {
    if (token !== clusterCloseToken) return;
    identity.style.transition = `transform ${CLUSTER_SWAP_PAD_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;
    identity.style.transform = "translateY(0px)";
  });
  window.setTimeout(() => {
    if (token !== clusterCloseToken) return;
    complete();
  }, CLUSTER_SWAP_PAD_MS + 48);
}

function prepareAboutColumn(col) {
  if (!col) return;
  col.style.transition = "none";
  col.style.justifyContent = "flex-start";
  col.style.paddingTop = "";
  void col.offsetWidth;
}

function swapSocialsForAboutTransition(next, done) {
  const token = ++clusterCloseToken;
  clusterSwitching = true;
  clusterHold = true;
  document.body.classList.add("is-cluster-swapping");
  setClusterActionToggles(true, false);
  const col = document.querySelector(".col-left");
  const identity = document.querySelector(".col-left .identity");
  const row = document.getElementById("social-row");
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    clusterHold = false;
    clusterSwitching = false;
    document.body.classList.remove("is-cluster-swapping");
    if (col) col.style.transition = "";
    done();
  };
  const commitAbout = () => {
    if (token !== clusterCloseToken) return;
    const firstTop = identity ? identity.getBoundingClientRect().top : 0;
    hideSocialRow(row);
    view = next;
    stopProgress();
    prepareAboutColumn(col);
    paint();
    settleClusterIdentity(identity, firstTop, token, finish);
  };
  if (!col || !dismissSocialRow()) {
    commitAbout();
    return;
  }
  window.setTimeout(commitAbout, CLUSTER_SWAP_OUT_MS);
}

function swapAboutForSocialsTransition(done) {
  const token = ++clusterCloseToken;
  clusterSwitching = true;
  clusterHold = true;
  document.body.classList.add("is-cluster-swapping");
  setClusterActionToggles(false, true);
  const col = document.querySelector(".col-left");
  const identity = document.querySelector(".col-left .identity");
  const lower = document.getElementById("lower");
  const more = document.getElementById("more");
  const anchorTop = identity ? identity.getBoundingClientRect().top : 0;
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    clusterHold = false;
    clusterSwitching = false;
    document.body.classList.remove("is-cluster-swapping");
    if (col) col.style.transition = "";
    done();
  };
  const commitSocials = () => {
    if (token !== clusterCloseToken) return;
    if (lower) {
      lower.classList.remove("is-out", "fresh");
      lower.innerHTML = "";
    }
    if (more) {
      more.classList.remove("is-out", "is-swap-in");
      more.hidden = true;
      more.innerHTML = "";
    }
    lowerKey = `home|${lang}`;
    view = "socials";
    stopProgress();
    paint();
    resetSocialRowLayout();
    openClusterTransition(anchorTop);
    finish();
  };
  if (!col || !dismissAboutContent()) {
    commitSocials();
    return;
  }
  window.setTimeout(commitSocials, CLUSTER_SWAP_ABOUT_OUT_MS);
}

function clusterCloseDone(done) {
  let called = false;
  return () => {
    if (called) return;
    called = true;
    clusterClosing = false;
    done();
  };
}

function closeSocialsTransition(done) {
  const token = ++clusterCloseToken;
  const finish = clusterCloseDone(done);
  const col = document.querySelector(".col-left");
  const row = document.getElementById("social-row");
  if (!col || !dismissSocialRow()) {
    finish();
    return;
  }
  releaseClusterActionToggles();
  const head = document.querySelector("h1");
  const actions = document.getElementById("actions");
  beginClusterPaddingDown(col, head, actions, [row]);

  window.setTimeout(() => {
    if (token !== clusterCloseToken) return;
    hideSocialRow(row);
  }, CLUSTER_CONTENT_OUT_MS);

  window.setTimeout(() => {
    if (token !== clusterCloseToken) return;
    releaseClusterToHome(col, finish);
  }, CLUSTER_CLOSE_PAD_MS);

  window.setTimeout(() => {
    if (token !== clusterCloseToken) return;
    finish();
  }, CLUSTER_CLOSE_PAD_MS + 400);
}

function closeAboutTransition(done) {
  const token = ++clusterCloseToken;
  const finish = clusterCloseDone(done);
  const col = document.querySelector(".col-left");
  const lower = document.getElementById("lower");
  const more = document.getElementById("more");
  if (!col || !dismissAboutContent()) {
    finishAboutPortraitForHome();
    finish();
    return;
  }
  beginAboutPortraitExit();
  releaseClusterActionToggles();
  const head = document.querySelector("h1");
  const actions = document.getElementById("actions");
  beginClusterPaddingDown(col, head, actions, [lower, more]);

  window.setTimeout(() => {
    if (token !== clusterCloseToken) return;
    lower.classList.remove("is-out", "fresh");
    lower.innerHTML = "";
    more.classList.remove("is-out");
    more.hidden = true;
    more.innerHTML = "";
    lowerKey = `home|${lang}`;
  }, CLUSTER_CONTENT_OUT_MS);

  window.setTimeout(() => {
    if (token !== clusterCloseToken) return;
    releaseClusterToHome(col, finish);
  }, CLUSTER_CLOSE_PAD_MS);

  window.setTimeout(() => {
    if (token !== clusterCloseToken) return;
    finish();
  }, CLUSTER_CLOSE_PAD_MS + 400);
}

const MORPH_MS = 700;
const MORPH_EASE = "cubic-bezier(0.33, 1, 0.68, 1)";

// Opening a project: same center-origin scale morph as runShrink, but growing
// from the home card into the project panel (no rail motion during the expand).
function runFlip(panel, first, firsts, neighborEls) {
  const card = panel.querySelector(".card.is-on");
  if (!card || !first || !first.width || !first.height) return null;
  const last = card.getBoundingClientRect();
  const box = panel.getBoundingClientRect();
  if (!last.width || !last.height || !box.width) return null;
  const scale = first.width / last.width;
  const dx = first.left + first.width / 2 - (last.left + last.width / 2);
  const dy = first.top + first.height / 2 - (last.top + last.height / 2);
  const cx = last.left + last.width / 2 - (box.left + box.width / 2);
  const cy = last.top + last.height / 2 - (box.top + box.height / 2);
  const tx = dx + (1 - scale) * cx;
  const ty = dy + (1 - scale) * cy;
  if (Math.abs(tx) < 1 && Math.abs(ty) < 1 && Math.abs(scale - 1) < 0.005) return null;
  panel.getAnimations().forEach((anim) => anim.cancel());
  card.getAnimations().forEach((anim) => anim.cancel());
  document.body.classList.add("is-flipping");
  panel.style.transformOrigin = "center";
  panel.style.willChange = "transform";
  // Pin the start pose before the first painted frame so the panel never flashes
  // at full project size, then ease up in scale like the old expand.
  const from = `translate(${tx}px, ${ty}px) scale(${scale})`;
  const to = "translate(0px, 0px) scale(1)";
  panel.style.transform = from;
  void panel.offsetWidth;
  const anim = panel.animate(
    [{ transform: from }, { transform: to }],
    { duration: MORPH_MS, easing: MORPH_EASE }
  );
  runNeighborsOut(card, firsts, first, neighborEls);
  const clear = () => {
    panel.style.transform = "";
    panel.style.transformOrigin = "";
    panel.style.willChange = "";
    document.body.classList.remove("is-flipping", "is-dots-exit", "is-dots-ready");
    if (view === "project") placeDeck(0);
  };
  anim.onfinish = clear;
  anim.oncancel = clear;
  return anim;
}

// Opening a project: peeking neighbours mount on document.body in screen space
// (a transformed panel would break position:fixed) and slide off past the edge.
function clearNeighborPin(card, deck, anchor) {
  card.classList.remove("is-neighbor");
  card.style.transformOrigin = "";
  card.style.position = "";
  card.style.left = "";
  card.style.top = "";
  card.style.width = "";
  card.style.height = "";
  card.style.zIndex = "";
  card.style.margin = "";
  card.style.transform = "";
  if (deck && card.parentElement === document.body) {
    if (anchor && anchor.parentElement === deck) deck.insertBefore(card, anchor);
    else deck.appendChild(card);
  }
}

function runNeighborsOut(panelCard, firsts, first, neighborEls) {
  const deck = panelCard.parentElement;
  if (!deck || !firsts || !neighborEls?.length || firsts.length !== neighborEls.length) return;
  const across = getComputedStyle(deck).flexDirection === "row";
  const reserve = 72;
  const peekReserve = 90;
  neighborEls.forEach((card, i) => {
    const home = firsts[i];
    if (!home || !home.width || !home.height) return;
    const shows = across
      ? home.right > -peekReserve && home.left < window.innerWidth + peekReserve
      : home.bottom > -peekReserve && home.top < window.innerHeight + peekReserve;
    if (!shows) return;
    card.getAnimations().forEach((anim) => anim.cancel());
    const anchor = card.nextElementSibling;
    document.body.appendChild(card);
    card.classList.add("is-neighbor");
    card.style.position = "fixed";
    card.style.left = `${home.left}px`;
    card.style.top = `${home.top}px`;
    card.style.width = `${home.width}px`;
    card.style.height = `${home.height}px`;
    card.style.margin = "0";
    card.style.zIndex = "12";
    card.style.transformOrigin = "center";
    const above = home.bottom < first.top + first.height / 2;
    const before = home.right < first.left + first.width / 2;
    const exitX = across
      ? (before ? -home.width - reserve : window.innerWidth + reserve) - home.left
      : 0;
    const exitY = across
      ? 0
      : (above ? -home.height - reserve : window.innerHeight + reserve) - home.top;
    const anim = card.animate(
      [
        { transform: "translate(0px, 0px)", opacity: 1 },
        { transform: `translate(${exitX}px, ${exitY}px)`, opacity: 1 },
      ],
      { duration: MORPH_MS, easing: MORPH_EASE }
    );
    const settleCard = () => clearNeighborPin(card, deck, anchor);
    anim.onfinish = settleCard;
    anim.oncancel = settleCard;
  });
}

// Closing a project: the neighbours glide back in on the same clock as the
// shrink. `peekRects` were captured after the view repainted but before the
// shrink's first frame, so they are the exact home peek slots — measuring
// live here would instead read squished rects under the shrink transform.
// Cards whose resting slot sits fully off-screen never show, so they are
// left alone; the peeking neighbours sweep in from past the viewport edge
// and ease straight into their peek slot (no overshoot dip).
function runNeighborsIn(panelCard, homeCardRect, peekEls, peekRects) {
  const deck = panelCard.parentElement;
  if (!deck) return;
  const cards = peekEls && peekEls.length ? peekEls : [...deck.children].filter((c) => c !== panelCard);
  const homes = peekRects && peekRects.length === cards.length ? peekRects : cards.map((n) => n.getBoundingClientRect());
  if (!cards.length || cards.length !== homes.length) return;
  const across = getComputedStyle(deck).flexDirection === "row";
  const home = homeCardRect || panelCard.getBoundingClientRect();
  const reserve = 90; // clearance so every flight starts fully off-screen
  cards.forEach((card, i) => {
    const peek = homes[i];
    if (!peek || !peek.width || !peek.height) return;
    // Deep stacked cards stay outside the viewport for the whole shrink, so
    // animating them would only burn frames on invisible motion.
    const shows = across
      ? peek.right > -reserve && peek.left < window.innerWidth + reserve
      : peek.bottom > -reserve && peek.top < window.innerHeight + reserve;
    if (!shows) return;
    card.getAnimations().forEach((anim) => anim.cancel());
    card.classList.add("is-neighbor");
    const above = peek.bottom < home.top + home.height / 2;
    const before = peek.right < home.left + home.width / 2;
    let keyframes;
    if (across) {
      // On a phone the deck runs horizontally with no empty margin beside
      // the panel, so the neighbours simply slide in from past the edge.
      const enter = before ? -(peek.right + reserve) : window.innerWidth + reserve - peek.left;
      keyframes = [
        { transform: `translateX(${enter}px)`, easing: MORPH_EASE },
        { transform: "translateX(0px)" },
      ];
    } else {
      const enter = above ? -(peek.bottom + reserve) : window.innerHeight + reserve - peek.top;
      keyframes = [
        { transform: `translateY(${enter}px)` },
        { transform: "translateY(0px)" },
      ];
    }
    const anim = card.animate(keyframes, { duration: MORPH_MS, easing: MORPH_EASE });
    const settleCard = () => {
      card.classList.remove("is-neighbor");
    };
    anim.onfinish = settleCard;
    anim.oncancel = settleCard;
  });
}

// Any pending neighbour flights are cancelled when a new view change starts,
// so a quick toggle never leaves half-finished card animations behind.
function cancelNeighbors(panelCard) {
  const deck = panelCard ? panelCard.parentElement : null;
  if (deck) {
    [...deck.children].forEach((c) => {
      if (c !== panelCard) c.getAnimations().forEach((anim) => anim.cancel());
    });
  }
  document.querySelectorAll("#deck .card.is-neighbor, body > .card.is-neighbor").forEach((card) => {
    card.getAnimations().forEach((anim) => anim.cancel());
  });
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
  if (!card) return null;
  const last = card.getBoundingClientRect();
  const box = panel.getBoundingClientRect();
  if (!first.width || !last.width || !box.width) return null;
  const scale = first.width / last.width;
  const dx = first.left + first.width / 2 - (last.left + last.width / 2);
  const dy = first.top + first.height / 2 - (last.top + last.height / 2);
  const cx = last.left + last.width / 2 - (box.left + box.width / 2);
  const cy = last.top + last.height / 2 - (box.top + box.height / 2);
  const tx = dx + (1 - scale) * cx;
  const ty = dy + (1 - scale) * cy;
  if (Math.abs(tx) < 1 && Math.abs(ty) < 1 && Math.abs(scale - 1) < 0.005) return null;
  panel.getAnimations().forEach((anim) => anim.cancel());
  panel.style.transformOrigin = "center";
  document.body.classList.add("is-closing");
  const anim = panel.animate(
    [
      { transform: `translate(${tx}px, ${ty}px) scale(${scale})` },
      { transform: "translate(0px, 0px) scale(1)" },
    ],
    { duration: MORPH_MS, easing: MORPH_EASE }
  );
  const clear = () => {
    panel.style.transformOrigin = "";
    document.body.classList.remove("is-closing");
    const homeDeck = document.getElementById("deck");
    // Restore the home rail easing after a snapped close morph.
    if (homeDeck && (view === "home" || view === "socials")) {
      homeDeck.style.transition = "";
    }
  };
  anim.onfinish = clear;
  anim.oncancel = clear;
  return anim;
}

function revealMobileInfo() {
  if (inAbout(view) || view === "socials") return;
  window.requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior: motionOk ? "smooth" : "auto" });
  });
}

let deckRevealToken = 0;
let mobileChapterTimer = 0;

function cancelMobileDeckReveal() {
  deckRevealToken += 1;
  window.clearTimeout(mobileChapterTimer);
  document.body.classList.remove(
    "is-deck-enter",
    "is-deck-exit",
    "is-deck-await",
    "is-dots-reveal",
    "is-dots-exit"
  );
  clearMobileDeckPanelInline();
}

function holdMobilePanelOffscreen() {
  const panel = document.getElementById("panel");
  if (!panel) return;
  panel.getAnimations().forEach((anim) => anim.cancel());
  panel.style.transition = "none";
  panel.style.transform = "translateX(106%)";
  panel.style.opacity = "0";
}

function clearMobileDeckPanelInline() {
  const panel = document.getElementById("panel");
  if (!panel) return;
  panel.getAnimations().forEach((anim) => anim.cancel());
  panel.style.transition = "";
  panel.style.transform = "";
  panel.style.opacity = "";
}

function waitDeckMs(ms, token) {
  return new Promise((resolve) => {
    mobileChapterTimer = window.setTimeout(() => {
      resolve(token === deckRevealToken);
    }, ms);
  });
}

function snapMobileDeckMotion(enter, dots) {
  const panel = document.getElementById("panel");
  if (enter) {
    document.body.classList.add("is-deck-enter");
    if (dots) document.body.classList.add("is-dots-reveal");
    document.body.classList.remove("is-deck-await");
    if (panel) panel.style.transition = "";
  } else {
    document.body.classList.add("is-deck-exit");
    if (dots) document.body.classList.add("is-dots-exit");
  }
  void panel?.offsetWidth;
  void document.body.offsetWidth;
}

function mobileDeckRevealEnter(fromOffscreen) {
  if (window.innerWidth > 980 || !mobileShowsDeck(view) || !motionOk) return Promise.resolve();
  const token = deckRevealToken;
  const panel = document.getElementById("panel");
  const showDots = view === "home";
  document.body.classList.remove(
    "is-deck-exit",
    "is-dots-exit",
    "is-dots-reveal",
    "is-deck-enter",
    "is-dots-ready"
  );
  document.body.classList.add("is-deck-await");
  if (panel) {
    panel.style.transition = "none";
    panel.style.transform = "";
    panel.style.opacity = "";
    void panel.offsetWidth;
  }
  placeDeck(true);
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(async () => {
        if (token !== deckRevealToken) return resolve();
        snapMobileDeckMotion(true, showDots);
        const dots = showDots ? document.querySelectorAll("#dots .dot") : null;
        const dotCount = dots ? dots.length : 0;
        const waitMs = mobileDeckPairMs(dotCount, showDots);
        if (!(await waitDeckMs(waitMs, token))) return resolve();
        if (showDots) {
          document.body.classList.remove("is-dots-reveal");
          document.body.classList.add("is-dots-ready");
        }
        document.body.classList.remove("is-deck-enter");
        if (panel) panel.style.transition = "";
        resolve();
      });
    });
  });
}

function mobileDeckRevealExit(options) {
  if (window.innerWidth > 980 || !mobileShowsDeck(view) || !motionOk) return Promise.resolve();
  const holdPanelOffscreen = options && options.holdPanelOffscreen === true;
  const token = deckRevealToken;
  const dotCount = document.querySelectorAll("#dots .dot").length;
  const useDots = view === "home" && dotCount > 0;
  document.body.classList.remove("is-deck-enter", "is-dots-reveal", "is-deck-exit", "is-deck-await");
  const panel = document.getElementById("panel");
  const finishExit = () => {
    document.body.classList.remove("is-deck-exit", "is-dots-exit", "is-dots-ready");
    if (!panel) return;
    panel.getAnimations().forEach((anim) => anim.cancel());
    if (holdPanelOffscreen) holdMobilePanelOffscreen();
    else clearMobileDeckPanelInline();
  };
  if (!useDots) {
    snapMobileDeckMotion(false, false);
    return waitDeckMs(MOBILE_DECK_PANEL_MS, token).then((ok) => {
      if (!ok) return;
      finishExit();
    });
  }
  if (view === "home" && !document.body.classList.contains("is-dots-ready")) {
    document.body.classList.add("is-dots-ready");
    void document.body.offsetWidth;
  }
  snapMobileDeckMotion(false, true);
  const dots = document.querySelectorAll("#dots .dot");
  const waitMs = mobileDeckPairMs(dots.length, true);
  return waitDeckMs(waitMs, token).then((ok) => {
    if (!ok) return;
    finishExit();
  });
}

function deckBootEnter() {
  if (!motionOk || !mobileShowsDeck(view)) {
    document.body.classList.remove("is-deck-boot", "is-deck-enter");
    if (!sliding && !progressAnim) armAuto();
    return;
  }
  const token = deckRevealToken;
  const mobile = window.innerWidth <= 980;
  const showDots = mobile && view === "home";
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(async () => {
      if (token !== deckRevealToken) return;
      document.body.classList.add("is-deck-enter");
      void document.getElementById("panel")?.offsetWidth;
      void document.body.offsetWidth;
      const panelMs = mobile ? 420 : 450;
      if (!(await waitDeckMs(panelMs, token))) return;
      if (showDots) document.body.classList.add("is-dots-ready");
      document.body.classList.remove("is-deck-enter");
      document.body.classList.remove("is-deck-boot");
      if (!sliding && !progressAnim && mobileShowsDeck(view)) scheduleAuto();
    });
  });
}

function replayMobileAboutMotion() {
  if (window.innerWidth > 980 || !inAbout(view) || !motionOk) return;
  const parts = document.querySelectorAll(
    "#lower .prose p, #more .branch, .portrait"
  );
  parts.forEach((el) => {
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = "";
  });
}
