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
  paintText("role", view === "project" ? project[lang].sub : text("major"));
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

function paintSocialRow() {
  const row = document.getElementById("social-row");
  if (socialKey !== lang) {
    socialKey = lang;
    row.innerHTML = socialLinks();
  }
  const show = view === "socials";
  clearTimeout(socialTimer);
  row.classList.remove("is-in");
  if (show) {
    row.classList.remove("is-out");
    row.hidden = false;
    if (booted && motionOk) {
      void row.offsetWidth;
      row.classList.add("is-in");
    }
    return;
  }
  if (row.hidden) return;
  if (!booted || !motionOk) {
    row.hidden = true;
    return;
  }
  row.classList.add("is-out");
  socialTimer = setTimeout(() => {
    row.classList.remove("is-out");
    row.hidden = true;
  }, 520);
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
    <span class="note-kicker">${esc(data.note)}</span>
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
  return `<div class="stack">${stack.map(([name, src]) =>
    `<figure><img src="${src}" alt="" width="36" height="36" draggable="false" onerror="this.parentElement.remove()" /><figcaption>${esc(name)}</figcaption></figure>`
  ).join("")}</div>`;
}


function paintLower() {
  const key = `${view}|${lang}`;
  if (key === lowerKey) return;
  const prev = lowerKey;
  lowerKey = key;
  const lower = document.getElementById("lower");
  const more = document.getElementById("more");
  const t = copy[lang];
  const about = view === "skills" || view === "certs" || view === "stack";
  if (!about) {
    lower.classList.remove("fresh");
    lower.innerHTML = "";
    more.hidden = true;
    more.innerHTML = "";
    return;
  }
  const tab = (name) => `<button type="button" data-go="${name}" class="${view === name ? "is-on" : ""}" aria-pressed="${view === name}">${esc(t[name])}</button>`;
  const detail = view === "skills"
    ? `<ul class="skill-list">${t.skillItems.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`
    : view === "certs"
      ? `<ul class="cert-list">${t.certItems.map((item) => `<li><img src="assets/verified.webp" alt="" width="28" height="28" />${esc(item)}</li>`).join("")}</ul>`
      : stackHtml();
  const switching = /^(skills|certs|stack)\|/.test(prev) && prev.endsWith(`|${lang}`) && more.querySelector(".links");
  if (!switching) {
    lower.classList.remove("fresh");
    lower.innerHTML = `<div class="prose"><p>${t.profileA}</p><p>${t.profileB}</p></div>`;
    more.hidden = false;
    more.innerHTML = `
      <div class="links" role="tablist">
        <span class="links-thumb" aria-hidden="true"></span>
        ${tab("skills")}
        ${tab("certs")}
        ${tab("stack")}
      </div>
      <div class="detail">${detail}</div>
    `;
    placeThumb(true);
    if (!booted || !motionOk) return;
    void lower.offsetWidth;
    lower.classList.add("fresh");
    return;
  }
  more.querySelectorAll(".links button").forEach((btn) => {
    const on = btn.dataset.go === view;
    btn.classList.toggle("is-on", on);
    btn.setAttribute("aria-pressed", String(on));
  });
  const panel = more.querySelector(".detail");
  panel.innerHTML = detail;
  placeThumb(false);
  if (!booted || !motionOk) return;
  panel.classList.remove("is-in");
  void panel.offsetWidth;
  panel.classList.add("is-in");
}

function placeThumb(instant) {
  const links = document.querySelector("#more .links");
  if (!links) return;
  const thumb = links.querySelector(".links-thumb");
  const on = links.querySelector("button.is-on");
  if (!thumb || !on) return;
  const apply = () => {
    thumb.style.width = `${on.offsetWidth}px`;
    thumb.style.transform = `translate(${on.offsetLeft}px, 0)`;
  };
  if (instant) thumb.style.transition = "none";
  apply();
  if (instant) {
    void thumb.offsetWidth;
    thumb.style.transition = "";
  }
}

function placeMore() {
  const more = document.getElementById("more");
  if (!more || more.hidden) return;
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
  const cards = view === "home" || view === "socials";
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

