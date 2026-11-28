// Delexo ui: view painters for identity, actions, links, notes and the discord card.
function paintLang() {
  const el = document.getElementById("lang");
  el.setAttribute("role", "group");
  el.setAttribute("aria-label", text("language"));
  el.innerHTML = `
    <button type="button" data-lang="en" class="${lang === "en" ? "is-on" : ""}" aria-pressed="${lang === "en"}">EN</button>
    <span aria-hidden="true">/</span>
    <button type="button" data-lang="es" class="${lang === "es" ? "is-on" : ""}" aria-pressed="${lang === "es"}">ES</button>
  `;
}

function paintIdentity() {
  const project = projects[index];
  paintText("title", view === "project" ? project.name : "Delexo");
  const role = document.getElementById("role");
  if (view === "project") {
    paintText("role", "");
    if (role) role.hidden = true;
  } else {
    if (role) role.hidden = false;
    paintText("role", text("major"));
  }
}


function socialLinks() {
  return socials.map((item) => {
    const label = item[lang];
    const graphic = item.src
      ? `<img src="${item.src}" alt="" draggable="false" onerror="this.remove()" />`
      : icon(item.icon);
    if (item.discord) {
      return `<button type="button" class="icon-btn" data-discord="1" aria-haspopup="dialog" aria-controls="discord-modal" aria-label="${esc(label)}">${graphic}${tip(label)}</button>`;
    }
    const external = item.href.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a class="icon-btn" href="${esc(item.href)}"${external} aria-label="${esc(label)}">${graphic}${tip(label)}</a>`;
  }).join("");
}

function releaseClusterActionToggles() {
  setClusterActionToggles(false, false);
}

function setClusterActionToggles(profileOn, socialsOn) {
  if (view === "project") return;
  const actions = document.getElementById("actions");
  if (!actions) return;
  const profileBtn = actions.querySelector("[data-go='profile']");
  const socialBtn = actions.querySelector("[data-go='socials']");
  if (profileBtn) {
    profileBtn.classList.toggle("is-on", profileOn);
    profileBtn.setAttribute("aria-pressed", String(profileOn));
  }
  if (socialBtn) {
    socialBtn.classList.toggle("is-on", socialsOn);
    socialBtn.setAttribute("aria-pressed", String(socialsOn));
  }
}

function paintActions() {
  const actions = document.getElementById("actions");
  const t = copy[lang];
  const onProfile = view === "profile" || view === "skills" || view === "certs" || view === "stack";

  if (view === "project") {
    const key = `project|${lang}|${index}`;
    if (key === actionKey) return;
    actionKey = key;
    const project = projects[index];
    const repo = project.repo
      ? `<a class="icon-btn" href="${esc(project.repo)}" target="_blank" rel="noopener noreferrer" aria-label="GitHub">${githubMark}${tip("GitHub")}</a>`
      : "";
    actions.className = booted && motionOk ? "actions fresh" : "actions";
    actions.innerHTML = `
      <button type="button" class="icon-btn" data-go="home" aria-label="${esc(t.back)}">${icon("back")}${tip(t.back)}</button>
      <a class="icon-btn" href="${esc(project.href)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(t.open)}">${icon("external")}${tip(t.open)}</a>
      ${repo}
    `;
    paintSocialRow();
    return;
  }

  const key = `home|${lang}`;
  if (actionKey !== key) {
    actionKey = key;
    actions.className = "actions";
    actions.innerHTML = `
      <button type="button" class="icon-btn" data-go="profile" aria-label="${esc(t.profile)}">${icon("person")}${tip(t.profile)}</button>
      <button type="button" class="icon-btn" data-go="socials" aria-label="${esc(t.socials)}">${icon("link")}${tip(t.socials)}</button>
      <a class="icon-btn" href="${esc(stripeHref)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(t.support)}">${icon("support")}${tip(t.support)}</a>
    `;
  }
  const profileBtn = actions.querySelector("[data-go='profile']");
  const socialBtn = actions.querySelector("[data-go='socials']");
  profileBtn.classList.toggle("is-on", onProfile);
  profileBtn.setAttribute("aria-pressed", String(onProfile));
  socialBtn.classList.toggle("is-on", view === "socials");
  socialBtn.setAttribute("aria-pressed", String(view === "socials"));
  paintSocialRow();
}

let socialKey = "";
let socialTimer = 0;

function dismissAboutContent() {
  const lower = document.getElementById("lower");
  const more = document.getElementById("more");
  if (!lower.textContent.trim() || more.hidden) return false;
  lower.classList.remove("fresh");
  lower.classList.add("is-out");
  more.classList.add("is-out");
  return true;
}

function dismissSocialRow() {
  const row = document.getElementById("social-row");
  if (!row || row.hidden) return false;
  clearTimeout(socialTimer);
  row.classList.remove("is-in");
  void row.offsetWidth;
  row.classList.add("is-out");
  return true;
}

function resetSocialRowLayout(row) {
  const el = row || document.getElementById("social-row");
  if (!el) return;
  el.style.position = "";
  el.style.left = "";
  el.style.top = "";
  el.style.width = "";
  el.style.margin = "";
  el.style.marginTop = "";
  el.style.zIndex = "";
  el.style.opacity = "";
  el.style.pointerEvents = "";
  el.style.transform = "";
  el.style.transition = "";
  el.style.overflow = "";
  el.style.maxHeight = "";
  delete el.dataset.collapsing;
}

function hideSocialRow(row) {
  const el = row || document.getElementById("social-row");
  if (!el) return;
  clearTimeout(socialTimer);
  // Hide before clearing is-out so the sink animation never snaps back to visible.
  el.hidden = true;
  el.classList.remove("is-out", "is-in");
  resetSocialRowLayout(el);
}

function revealMobileSocialRow() {
  document.body.classList.remove("is-socials-await");
  const row = document.getElementById("social-row");
  if (!row || view !== "socials") return;
  resetSocialRowLayout(row);
  row.classList.remove("is-out");
  row.hidden = false;
  if (!motionOk) return;
  void row.offsetWidth;
  row.classList.add("is-in");
}

function revealSocialRow(animated, forceReplay) {
  const row = document.getElementById("social-row");
  if (!row || view !== "socials") return;
  clearTimeout(socialTimer);
  resetSocialRowLayout(row);
  row.classList.remove("is-out");
  row.hidden = false;
  if (!animated || !booted || !motionOk) return;
  if (window.innerWidth <= 980 && document.body.classList.contains("is-socials-await")) {
    row.classList.remove("is-in");
    return;
  }
  if (!forceReplay && row.classList.contains("is-in")) return;
  row.classList.remove("is-in");
  void row.offsetWidth;
  row.classList.add("is-in");
}

function paintSocialRow() {
  const row = document.getElementById("social-row");
  if (!row) return;
  if (socialKey !== lang) {
    socialKey = lang;
    row.innerHTML = socialLinks();
  }
  const show = view === "socials";
  if (show) {
    clearTimeout(socialTimer);
    resetSocialRowLayout(row);
    row.classList.remove("is-out");
    row.hidden = false;
    if (clusterClosing || clusterSwitching || clusterHold) return;
    revealSocialRow(true);
    return;
  }
  // Outside Links, always hard-hide. Never leave a fading/fixed row over project UI.
  if (clusterClosing || clusterSwitching) return;
  clearTimeout(socialTimer);
  hideSocialRow(row);
}

function paintNote() {
  const note = document.getElementById("note");
  const show = view === "project";
  if (!show) {
    note.hidden = true;
    note.textContent = "";
    note.dataset.key = "";
    note.classList.remove("show");
    return;
  }
  const data = projects[index][lang];
  const key = `${index}|${lang}`;
  if (note.dataset.key === key) return;
  note.dataset.key = key;
  note.innerHTML = `
    <p class="note-body">${esc(data.desc)}</p>
    <ul class="note-facts">${data.facts.map((fact) => `<li>${esc(fact)}</li>`).join("")}</ul>
  `;
  note.hidden = false;
  if (!motionOk) return;
  note.classList.remove("show");
  void note.offsetWidth;
  note.classList.add("show");
}

function stackHtml() {
  return `<div class="stack">${stack.map(([name, src]) => {
    const key = String(src).split("/").pop().replace(/\.\w+$/, "");
    return `<figure class="stack-item stack-item--${esc(key)}"><span class="stack-icon" aria-hidden="true"><img src="${src}" alt="" width="24" height="24" draggable="false" onerror="this.closest('figure').remove()" /></span><figcaption>${esc(name)}</figcaption></figure>`;
  }).join("")}</div>`;
}

function projectsHtml() {
  return `<ul class="project-list">${projects.map((project) => {
    const locale = project[lang] || {};
    const identity = locale.sub || locale.note || "";
    const tint = project.tint || "#ececec";
    const icon = project.icon || project.image;
    return `<li><a class="app-row" href="${esc(project.href)}" target="_blank" rel="noopener noreferrer"><span class="app-row__icon" style="background:${esc(tint)}"><img src="${esc(icon)}" alt="" width="28" height="28" draggable="false" loading="lazy" decoding="async" /></span><span class="app-row__copy"><span class="app-row__name">${esc(project.name)}</span>${identity ? `<span class="app-row__id">${esc(identity)}</span>` : ""}</span></a></li>`;
  }).join("")}</ul>`;
}

function skillsHtml(t) {
  return `<ul class="skill-list">${t.skillItems.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
}

function certsHtml(t) {
  return `<ul class="cert-list">${t.certItems.map((item) => {
    const name = typeof item === "string" ? item : item.name;
    const href = typeof item === "string" ? "" : item.href;
    const label = `<img src="assets/verified.webp" alt="" width="28" height="28" /><span>${esc(name)}</span>`;
    return href
      ? `<li><a class="cert-link" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${label}</a></li>`
      : `<li>${label}</li>`;
  }).join("")}</ul>`;
}

function branchHtml(id, label, body) {
  return `<details class="branch" data-branch="${esc(id)}"><summary><span>${esc(label)}</span><span class="branch-chevron" aria-hidden="true"></span></summary><div class="branch-body"><div class="branch-panel">${body}</div></div></details>`;
}

function animateBranch(details, open) {
  const body = details.querySelector(".branch-body");
  if (!body) {
    details.open = open;
    return;
  }
  if (!motionOk) {
    details.open = open;
    details.classList.toggle("is-expanded", open);
    body.style.height = "";
    body.style.opacity = "";
    body.style.overflow = "";
    body.style.transition = "";
    return;
  }
  if (details.dataset.animating === "1") return;
  details.dataset.animating = "1";
  const duration = 360;
  const ease = "cubic-bezier(0.22, 1, 0.36, 1)";
  const finish = (propertyName, done) => {
    const onEnd = (event) => {
      if (event.target !== body || event.propertyName !== propertyName) return;
      body.removeEventListener("transitionend", onEnd);
      done();
    };
    body.addEventListener("transitionend", onEnd);
  };

  if (open) {
    details.classList.add("is-expanded");
    details.open = true;
    body.style.overflow = "hidden";
    body.style.height = "0px";
    body.style.opacity = "0";
    body.style.transition = "none";
    const target = body.scrollHeight;
    void body.offsetHeight;
    body.style.transition = `height ${duration}ms ${ease}, opacity ${Math.round(duration * 0.8)}ms ${ease}`;
    body.style.height = `${target}px`;
    body.style.opacity = "1";
    finish("height", () => {
      if (details.open) {
        body.style.height = "auto";
        body.style.overflow = "";
        body.style.transition = "";
      }
      details.dataset.animating = "0";
    });
    return;
  }

  details.classList.remove("is-expanded");
  body.style.overflow = "hidden";
  body.style.height = `${body.scrollHeight}px`;
  body.style.opacity = "1";
  body.style.transition = "none";
  void body.offsetHeight;
  body.style.transition = `height ${duration}ms ${ease}, opacity ${Math.round(duration * 0.65)}ms ease`;
  body.style.height = "0px";
  body.style.opacity = "0";
  finish("height", () => {
    details.open = false;
    body.style.height = "";
    body.style.opacity = "";
    body.style.overflow = "";
    body.style.transition = "";
    details.dataset.animating = "0";
  });
}

function bindBranches(root) {
  root.querySelectorAll(".branch").forEach((details) => {
    const summary = details.querySelector("summary");
    if (!summary || summary.dataset.bound === "1") return;
    summary.dataset.bound = "1";
    summary.addEventListener("click", (event) => {
      event.preventDefault();
      if (details.dataset.animating === "1") return;
      animateBranch(details, !details.open);
    });
  });
}

let profileMetaTimer = 0;
let profileViewsCount = null;
let profileViewsPromise = null;
let profileUpdatedMs = null;
let profileUpdatedPromise = null;

function formatProfileAgo(fromMs) {
  const t = copy[lang];
  const units = t.ago;
  const elapsed = Math.max(0, Date.now() - fromMs);
  const second = 1000;
  const minute = 60 * second;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  let value;
  let key;
  if (elapsed < minute) {
    value = Math.max(1, Math.floor(elapsed / second));
    key = "second";
  } else if (elapsed < hour) {
    value = Math.floor(elapsed / minute);
    key = "minute";
  } else if (elapsed < day) {
    value = Math.floor(elapsed / hour);
    key = "hour";
  } else if (elapsed < week) {
    value = Math.floor(elapsed / day);
    key = "day";
  } else if (elapsed < month) {
    value = Math.floor(elapsed / week);
    key = "week";
  } else {
    value = Math.max(1, Math.floor(elapsed / month));
    key = "month";
  }
  const label = units[key][value === 1 ? 0 : 1];
  if (lang === "es") return `${t.lastUpdated}: hace ${value} ${label}`;
  return `${t.lastUpdated}: ${value} ${label}`;
}

function formatProfileViews(count) {
  const label = copy[lang].profileViews;
  if (count == null || Number.isNaN(count)) return `${label}: —`;
  return `${label}: ${Number(count).toLocaleString(lang === "es" ? "es" : "en")}`;
}

function paintProfileMeta() {
  const updated = document.getElementById("profile-updated");
  const views = document.getElementById("profile-views");
  if (!updated && !views) return;
  if (updated) {
    updated.href = profileRepo.url;
    updated.textContent = Number.isFinite(profileUpdatedMs)
      ? formatProfileAgo(profileUpdatedMs)
      : `${copy[lang].lastUpdated}: —`;
  }
  if (views) views.textContent = formatProfileViews(profileViewsCount);
}

function stopProfileMetaTicker() {
  window.clearInterval(profileMetaTimer);
  profileMetaTimer = 0;
}

function startProfileMetaTicker() {
  stopProfileMetaTicker();
  paintProfileMeta();
  profileMetaTimer = window.setInterval(paintProfileMeta, 1000);
}

function readCachedProfileUpdated() {
  try {
    const raw = localStorage.getItem("delexo-profile-updated");
    if (!raw) return null;
    const data = JSON.parse(raw);
    const ms = Number(data && data.ms);
    const at = Number(data && data.at);
    if (!Number.isFinite(ms) || !Number.isFinite(at)) return null;
    if (Date.now() - at > 15 * 60 * 1000) return null;
    return ms;
  } catch (err) {
    return null;
  }
}

function writeCachedProfileUpdated(ms) {
  try {
    localStorage.setItem("delexo-profile-updated", JSON.stringify({ ms, at: Date.now() }));
  } catch (err) { /* ignore */ }
}

async function fetchProfileUpdatedMs() {
  const res = await fetch(profileRepo.commitsApi, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`commits ${res.status}`);
  const data = await res.json();
  const iso = data && data[0] && data[0].commit && data[0].commit.committer && data[0].commit.committer.date;
  const ms = Date.parse(iso);
  if (!Number.isFinite(ms)) throw new Error("commits bad payload");
  return ms;
}

function trackProfileUpdated() {
  if (profileUpdatedPromise) return profileUpdatedPromise;
  const cached = readCachedProfileUpdated();
  if (cached != null) {
    profileUpdatedMs = cached;
    paintProfileMeta();
  }
  profileUpdatedPromise = (async () => {
    try {
      const ms = await fetchProfileUpdatedMs();
      profileUpdatedMs = ms;
      writeCachedProfileUpdated(ms);
    } catch (err) {
      if (profileUpdatedMs == null && cached != null) profileUpdatedMs = cached;
    }
    paintProfileMeta();
    return profileUpdatedMs;
  })();
  return profileUpdatedPromise;
}

function readCachedProfileViews() {
  try {
    const raw = localStorage.getItem("delexo-profile-views");
    if (raw == null) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch (err) {
    return null;
  }
}

function writeCachedProfileViews(count) {
  try {
    localStorage.setItem("delexo-profile-views", String(count));
  } catch (err) { /* ignore */ }
}

async function fetchProfileViews(hit) {
  const url = hit ? profileViewsEndpoint.hit : profileViewsEndpoint.get;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`views ${res.status}`);
  const data = await res.json();
  const count = Number(data.value);
  if (!Number.isFinite(count)) throw new Error("views bad payload");
  return count;
}

function trackProfileViews() {
  if (profileViewsPromise) return profileViewsPromise;
  const cached = readCachedProfileViews();
  if (cached != null) profileViewsCount = cached;
  let shouldHit = true;
  try {
    shouldHit = sessionStorage.getItem("delexo-profile-hit") !== "1";
  } catch (err) { /* ignore */ }
  profileViewsPromise = (async () => {
    try {
      const count = await fetchProfileViews(shouldHit);
      profileViewsCount = count;
      writeCachedProfileViews(count);
      if (shouldHit) {
        try { sessionStorage.setItem("delexo-profile-hit", "1"); } catch (err) { /* ignore */ }
      }
    } catch (err) {
      if (profileViewsCount == null) {
        profileViewsCount = (cached == null ? 0 : cached) + (shouldHit ? 1 : 0);
        writeCachedProfileViews(profileViewsCount);
        try { sessionStorage.setItem("delexo-profile-hit", "1"); } catch (e) { /* ignore */ }
      }
    }
    paintProfileMeta();
    return profileViewsCount;
  })();
  return profileViewsPromise;
}

function paintLower() {
  const key = `${view}|${lang}`;
  if (key === lowerKey) {
    if (inAbout(view)) paintProfileMeta();
    return;
  }
  lowerKey = key;
  const lower = document.getElementById("lower");
  const more = document.getElementById("more");
  const t = copy[lang];
  if (!inAbout(view)) {
    stopProfileMetaTicker();
    if (clusterClosing || clusterSwitching) return;
    lower.classList.remove("fresh", "is-out");
    lower.innerHTML = "";
    more.classList.remove("is-out");
    more.hidden = true;
    more.innerHTML = "";
    return;
  }
  lower.classList.remove("fresh");
  lower.innerHTML = `<div class="prose"><p>${t.profileA}</p><p>${t.profileB}</p></div>`;
  more.hidden = false;
  more.innerHTML = `
    <div class="branches">
      ${branchHtml("skills", t.skills, skillsHtml(t))}
      ${branchHtml("certs", t.certs, certsHtml(t))}
      ${branchHtml("stack", t.stack, stackHtml())}
      ${branchHtml("projects", t.projects, projectsHtml())}
    </div>
    <footer class="profile-meta">
      <a class="profile-meta__line profile-meta__link" id="profile-updated" href="${esc(profileRepo.url)}" target="_blank" rel="noopener noreferrer"></a>
      <p class="profile-meta__line" id="profile-views"></p>
    </footer>
  `;
  bindBranches(more);
  trackProfileUpdated();
  trackProfileViews();
  startProfileMetaTicker();
  if (!booted || !motionOk) return;
  // Cluster swaps already move the column; skip the heavy infoUp entrance.
  if (clusterSwitching) {
    lower.classList.remove("fresh");
    more.classList.add("is-swap-in");
    return;
  }
  void lower.offsetWidth;
  lower.classList.add("fresh");
  if (window.innerWidth <= 980) {
    window.requestAnimationFrame(() => replayMobileAboutMotion());
  }
}

function placeMore() {
  const more = document.getElementById("more");
  if (!more || more.hidden) return;
  if (window.innerWidth > 980 || inAbout(view)) {
    more.style.width = "";
    more.style.marginLeft = "";
    return;
  }
  const parent = more.parentElement;
  const stage = document.querySelector(".stage");
  const anchor = parent.getBoundingClientRect().width || !stage ? parent : stage;
  const pad = parseFloat(getComputedStyle(anchor).paddingLeft) || 0;
  const left = anchor.getBoundingClientRect().left + pad + window.scrollX;
  more.style.width = `${document.documentElement.clientWidth}px`;
  more.style.marginLeft = `${-left}px`;
}


function paintDots() {
  const el = document.getElementById("dots");
  const cards = view === "home" || view === "socials" || view === "project";
  el.setAttribute("aria-hidden", cards ? "false" : "true");
  const fresh = el.querySelectorAll(".dot").length !== projects.length;
  if (fresh) {
    el.innerHTML = projects.map((project, i) =>
      `<button type="button" class="dot" data-dot="${i}" aria-label="${esc(project.name)}"><span class="pip" aria-hidden="true"><span class="pip-fill"></span></span></button>`
    ).join("");
  }
  [...el.querySelectorAll(".dot")].forEach((dot, i) => {
    const on = i === index;
    if (!(fresh && on)) dot.classList.toggle("is-on", on);
    dot.tabIndex = cards ? 0 : -1;
    if (on) dot.setAttribute("aria-current", "true");
    else dot.removeAttribute("aria-current");
  });
  if (fresh) {
    window.requestAnimationFrame(() => {
      const dot = el.querySelector(`[data-dot="${index}"]`);
      if (dot) dot.classList.add("is-on");
    });
  }
}

let discordOpen = false;
const DISCORD_USER_ID = "812938158806794281";

function paintDiscord() {
  const request = document.getElementById("discord-request");
  const accept = document.getElementById("discord-accept");
  const ignore = document.getElementById("discord-ignore");
  const close = document.getElementById("discord-close");
  const backdrop = document.querySelector("[data-discord-close].discord-modal__backdrop");
  request.innerHTML = text("discordRequest");
  accept.textContent = text("discordAccept");
  ignore.textContent = text("discordIgnore");
  close.setAttribute("aria-label", text("close"));
  if (backdrop) backdrop.setAttribute("aria-label", text("close"));
}

function setDiscordOpen(next) {
  const modal = document.getElementById("discord-modal");
  discordOpen = next;
  if (next) stopProgress();
  else scheduleAuto();
  if (next) {
    modal.hidden = false;
    void modal.offsetWidth;
    modal.classList.add("is-open");
    document.documentElement.classList.add("discord-open");
    document.getElementById("discord-close").focus();
    return;
  }
  modal.classList.remove("is-open");
  document.documentElement.classList.remove("discord-open");
  window.setTimeout(() => {
    if (!discordOpen) modal.hidden = true;
  }, 220);
}

function openDiscordProfile() {
  setDiscordOpen(false);
  const appLink = document.createElement("a");
  appLink.href = `discord://-/users/${DISCORD_USER_ID}`;
  appLink.rel = "noopener noreferrer";
  document.body.appendChild(appLink);
  appLink.click();
  appLink.remove();
  window.setTimeout(() => {
    window.open(`https://discord.com/users/${DISCORD_USER_ID}`, "_blank", "noopener,noreferrer");
  }, 700);
}

