const copy = {
  en: {
    language: "Language",
    major: "Computer Science",
    profileA:
      'Undergrad in Computer Science at <a class="prose-link" href="https://maps.app.goo.gl/QrTyyX34rBrLbPry9" target="_blank" rel="noopener noreferrer">California State University San Marcos<span class="tip">Visit school</span></a>, also completing <a class="prose-link" href="https://harvardonline.harvard.edu/course/cybersecurity-managing-risk-information-age" target="_blank" rel="noopener noreferrer">Harvard&#39;s Cybersecurity for Business<span class="tip">Visit course</span></a> program.',
    profileB: "Strong work ethic, problem solving, and active outside class.",
    skills: "Skills",
    certs: "Certificates",
    stack: "Stack",
    skillItems: [
      "Attention to detail",
      "Problem solving",
      "Quick learner",
      "Customer service and cash handling",
      "Computer science and cybersecurity internship",
    ],
    certItems: [
      "Harvard CS50",
      "Google Cybersecurity",
      "Harvard Cybersecurity for Business",
    ],
    profile: "Profile",
    socials: "Links",
    support: "Support",
    back: "Back",
    close: "Close",
    open: "Open site",
    visit: "View project",
    discordRequest: "<strong>delexo</strong> sent you a friend request.",
    discordAccept: "Accept",
    discordIgnore: "Ignore",
  },
  es: {
    language: "Idioma",
    major: "Ciencias de la Computación",
    profileA:
      'Estudiante de Ciencias de la Computación en <a class="prose-link" href="https://maps.app.goo.gl/QrTyyX34rBrLbPry9" target="_blank" rel="noopener noreferrer">California State University San Marcos<span class="tip">Visitar escuela</span></a>, también completando el programa <a class="prose-link" href="https://harvardonline.harvard.edu/course/cybersecurity-managing-risk-information-age" target="_blank" rel="noopener noreferrer">Cybersecurity for Business de Harvard<span class="tip">Visitar curso</span></a>.',
    profileB: "Fuerte ética de trabajo, resolución de problemas y participación fuera de clase.",
    skills: "Habilidades",
    certs: "Certificados",
    stack: "Stack",
    skillItems: [
      "Atención al detalle",
      "Resolución de problemas",
      "Aprendo rápido",
      "Atención al cliente y manejo de efectivo",
      "Pasantía en informática y ciberseguridad",
    ],
    certItems: [
      "CS50 de Harvard",
      "Ciberseguridad de Google",
      "Cybersecurity for Business de Harvard",
    ],
    profile: "Perfil",
    socials: "Enlaces",
    support: "Apoyo",
    back: "Volver",
    close: "Cerrar",
    open: "Abrir sitio",
    visit: "Ver proyecto",
    discordRequest: "<strong>delexo</strong> te envió una solicitud de amistad.",
    discordAccept: "Aceptar",
    discordIgnore: "Ignorar",
  },
};

const projects = [
  {
    name: "Mochi",
    href: "https://mochi-delexo.vercel.app/",
    host: "mochi-delexo.vercel.app",
    image: "assets/mochi.png",
    tint: "#f4efe6",
    wash: "#e7d3b8",
    en: {
      sub: "Windows AI assistant",
      note: "Always-on desktop companion. Beta.",
      desc: "An AI assistant that docks to the right edge of the Windows desktop, so you can ask about whatever is on screen, queue your own music, hide from a screenshare, or let it edit files and take notes without opening another window. Chats and playlists stay local and encrypted on the PC, and voice input is optional.",
      facts: ["Windows · Tauri", "Local-first & encrypted", "Chat, music, voice, files"],
    },
    es: {
      sub: "Asistente de IA para Windows",
      note: "Compañero de escritorio, siempre activo. Beta.",
      desc: "Un asistente de IA que se ancla al borde derecho del escritorio de Windows: le preguntas por lo que hay en pantalla, pones tu música, te escondes de una captura de pantalla o dejas que edite archivos y tome notas sin abrir otra ventana. Las conversaciones y listas se quedan locales y cifradas en el PC, y la voz es opcional.",
      facts: ["Windows · Tauri", "Local y cifrado", "Chat, música, voz, archivos"],
    },
  },
  {
    name: "Moonrise",
    href: "https://trymoonrise.com/",
    host: "trymoonrise.com",
    image: "assets/moonrise.png",
    tint: "#f6deb6",
    wash: "#f0c48a",
    en: {
      sub: "Websites, in one click",
      note: "AI sites for local businesses and creators.",
      desc: "Moonrise scans nearby businesses that still have no website, generates a working site for one in a single click, and lets you sell it: the owner pays through the built-in checkout, the watermark comes off, and the creator keeps 90%. Sites are assembled from its own UI library and deploy to Vercel, with a custom domain when the client is ready for one.",
      facts: ["90% kept by the creator", "One-click site generation", "OpenStreetMap business finder"],
    },
    es: {
      sub: "Sitios web, en un clic",
      note: "Sitios con IA para negocios locales y creadores.",
      desc: "Moonrise busca negocios cercanos que aún no tienen sitio web, genera uno funcional con un clic y te deja venderlo: el dueño paga con el checkout integrado, la marca de agua desaparece y el creador se queda con el 90%. Los sitios se arman con su propia librería de UI y se publican en Vercel, con dominio propio cuando el cliente lo necesita.",
      facts: ["90% para el creador", "Sitio generado en un clic", "Buscador con OpenStreetMap"],
    },
  },
  {
    name: "OrbINT",
    href: "https://orbint.net",
    repo: "https://github.com/Delexoo/OrbINT",
    host: "orbint.net",
    image: "assets/orbint.png",
    tint: "#e5eef2",
    wash: "#d5e4ec",
    en: {
      sub: "Open-source intelligence",
      note: "Local case files for reconnaissance.",
      desc: "An open-source reconnaissance casebook. Instead of juggling a dozen tabs, you collect scattered identifiers — phone numbers, usernames, emails, IPs, wallets, vehicles and more — into a single case file that stays on your machine, built for looking into publicly available information responsibly.",
      facts: ["Open source on GitHub", "20+ identifier fields", "Case files stay local"],
    },
    es: {
      sub: "Inteligencia de fuentes abiertas",
      note: "Expedientes locales de reconocimiento.",
      desc: "Un expediente de reconocimiento de código abierto. En vez de saltar entre decenas de pestañas, reúne identificadores dispersos —teléfonos, usuarios, correos, IPs, billeteras, vehículos y más— en un solo archivo que se queda en tu equipo, pensado para investigar información pública de forma responsable.",
      facts: ["Código abierto en GitHub", "Más de 20 campos", "Expedientes locales"],
    },
  },
  {
    name: "MusicWidget",
    href: "https://delexoo.github.io/MusicWidget/",
    repo: "https://github.com/Delexoo/MusicWidget",
    host: "delexoo.github.io/MusicWidget",
    image: "assets/musicwidget.png",
    tint: "#e7efd9",
    wash: "#d5e2c4",
    en: {
      sub: "Desktop music player",
      note: "A floating player for Windows.",
      desc: "A 4 MB floating player for Windows 10 and 11 that stays on top of other windows so your music is always one click away. Playlists are plain folders on disk, tracks can be pulled in from the web, and a hotkey tucks the widget into the tray — no account, no ads, open source.",
      facts: ["Windows 10 / 11 · 4 MB", "Folder playlists", "Open source, no account"],
    },
    es: {
      sub: "Reproductor de escritorio",
      note: "Un reproductor flotante para Windows.",
      desc: "Un reproductor flotante de 4 MB para Windows 10 y 11 que se queda encima de las demás ventanas para tener la música a un clic. Las listas son carpetas normales en el disco, puedes traer pistas desde la web y un atajo lo esconde en la bandeja: sin cuenta, sin anuncios y de código abierto.",
      facts: ["Windows 10 / 11 · 4 MB", "Listas por carpetas", "Código abierto, sin cuenta"],
    },
  },
  {
    name: "GitReplay",
    href: "https://github.com/Delexoo/GitReplay",
    repo: "https://github.com/Delexoo/GitReplay",
    host: "github.com/Delexoo/GitReplay",
    image: "assets/gitreplay.png",
    tint: "#e7e9f2",
    wash: "#d9dcea",
    en: {
      sub: "Watch a repo build",
      note: "Replay any GitHub repository. Beta.",
      desc: "Takes any repository you can access — private ones included — and types its files out on screen character by character, with pause, speed and scrub controls. Web projects get a live HTML, CSS and JS preview while they build, and the whole thing runs in the browser on GitHub Pages with nothing to install.",
      facts: ["MIT licensed", "Character-by-character replay", "Runs in the browser"],
    },
    es: {
      sub: "Ver cómo se arma un repo",
      note: "Reproduce cualquier repositorio de GitHub. Beta.",
      desc: "Toma cualquier repositorio al que tengas acceso —privados incluidos— y escribe sus archivos en pantalla carácter por carácter, con pausa, velocidad y barra de avance. Los proyectos web tienen vista previa HTML, CSS y JS en vivo, y todo corre en el navegador sobre GitHub Pages sin instalar nada.",
      facts: ["Licencia MIT", "Reproducción carácter a carácter", "Corre en el navegador"],
    },
  },
];

const stack = [
  ["C", "assets/icons/c.svg"],
  ["C#", "assets/icons/csharp.svg"],
  ["Python", "assets/icons/python.svg"],
  ["JavaScript", "assets/icons/javascript.svg"],
  ["TypeScript", "assets/icons/typescript.svg"],
  ["React", "assets/icons/react.svg"],
  ["Vercel", "assets/icons/vercel.svg"],
  ["GitHub", "assets/icons/github.svg"],
  ["Visual Studio Code", "assets/icons/visualstudiocode.svg"],
  ["Cursor", "assets/icons/cursor.svg"],
  ["OpenRouter", "assets/icons/openrouter.svg"],
  ["Anthropic", "assets/icons/anthropic.svg"],
  ["ChatGPT", "assets/icons/openai.svg"],
  ["DeepSeek", "assets/icons/deepseek.svg"],
  ["Qwen", "assets/icons/qwen.svg"],
  ["Kali", "assets/icons/kalilinux.svg"],
  ["OSINT Framework", "assets/icons/osint.svg"],
  ["Oracle VM", "assets/icons/oracle.svg"],
  ["Wireshark", "assets/icons/wireshark.svg"],
  ["Nmap", "assets/icons/nmap.svg"],
  ["AI Engineering", "assets/icons/ai.svg"],
  ["Prompt engineering", "assets/icons/prompt.svg"],
  ["Digital Forensics", "assets/icons/forensics.svg"],
];

const stripeHref = "https://buy.stripe.com/9B63cu3RE2ouaKgcHLcjS00";

const socials = [
  { href: "mailto:teambrilliantt@hotmail.com", en: "Email", es: "Correo", src: "assets/socials/gmail.svg" },
  { href: "tel:+14013000957", en: "Phone", es: "Teléfono", src: "assets/socials/iphone.jpg" },
  { href: "https://github.com/Delexoo", en: "GitHub", es: "GitHub", src: "assets/socials/github.webp" },
  { href: "https://t.me/delexoo", en: "Telegram", es: "Telegram", src: "assets/socials/telegram.svg" },
  { discord: true, en: "Discord", es: "Discord", src: "assets/socials/discord.webp" },
  { href: "https://open.spotify.com/user/31bkbmqthacfrfchjncyj2kpvase", en: "Spotify", es: "Spotify", src: "assets/socials/spotify.webp" },
  { href: "https://namemc.com/Delexo", en: "NameMC", es: "NameMC", src: "assets/socials/namemc.svg" },
  { href: "https://gdbrowser.com/u/vans", en: "GDBrowser", es: "GDBrowser", src: "assets/socials/gdbrowser.png" },
  { href: stripeHref, en: "Donate", es: "Donar", src: "assets/socials/donate.svg?v=2" },
];

const githubMark = '<svg class="github-mark" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>';

const glyphs = {
  person: '<circle cx="12" cy="8" r="3.1"/><path d="M5.7 19.1c1.25-2.75 3.35-4.15 6.3-4.15s5.05 1.4 6.3 4.15"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  support: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  back: '<path d="M15 6.5 8.5 12 15 17.5"/><path d="M9 12h9"/>',
  external: '<path d="M14 6h4.2V10.2"/><path d="M18 6.2 10.2 14"/><path d="M16 13.4V18a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 18V9.5A1.5 1.5 0 0 1 6.5 8H11"/>',
};

let lang = "en";
let view = "home";
let index = 0;
let booted = false;
let actionKey = "";
let lowerKey = "";
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

function tip(label) {
  return `<span class="tip">${esc(label)}</span>`;
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

function inAbout(name) {
  return name === "profile" || name === "skills" || name === "certs" || name === "stack";
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
  if (!motionOk || autoHold || discordOpen || (view !== "home" && view !== "socials")) return;
  autoTimer = window.setTimeout(() => { sliding = false; }, motionOk ? 280 : 0);
  fillTimer = window.setTimeout(() => {
    if (!autoHold && !sliding) armAuto();
  }, motionOk ? 520 : 0);
}

function armAuto() {
  if (!motionOk || autoHold || discordOpen || (view !== "home" && view !== "socials")) return;
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
    if (autoHold || discordOpen || (view !== "home" && view !== "socials")) return;
    stepProjects(1);
  };
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

function runSlideOut(panel, first) {
  const inline = panel.style.transform;
  panel.style.transform = "none";
  const base = panel.getBoundingClientRect();
  panel.style.transform = inline;
  if (!first || !first.width || !base.width) return;
  const dx = first.left - base.left;
  const dy = first.top - base.top;
  const distance = first.width * 1.05;
  panel.getAnimations().forEach((anim) => anim.cancel());
  panel.animate(
    [
      { transform: `translate(${dx}px, ${dy}px)` },
      { transform: `translate(${dx + distance}px, ${dy}px)` },
    ],
    { duration: 560, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
  );
  panel.animate(
    [
      { opacity: 1, offset: 0 },
      { opacity: 1, offset: 0.6 },
      { opacity: 0, offset: 1 },
    ],
    { duration: 560, easing: "linear" }
  );
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
  const slideOut = motionOk && window.innerWidth <= 980 && cardUp(prev) && inAbout(next);
  const exitFrom = slideOut ? panel.getBoundingClientRect() : null;
  view = next;
  paint();
  if (view === "home" || view === "socials") scheduleAuto();
  else stopProgress();
  if (window.innerWidth <= 980) revealMobileInfo();
  if (slideOut) {
    runSlideOut(panel, exitFrom);
    return;
  }
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
    if (view !== "home" && view !== "socials") return;
    const deck = document.getElementById("deck");
    if (deck) deck.style.transition = "none";
    placeDeck();
    if (deck) {
      void deck.offsetWidth;
      deck.style.transition = "";
    }
  });

  const panel = document.getElementById("panel");
  const holdAuto = (on) => {
    autoHold = on;
    if (!progressAnim) {
      if (!on) scheduleAuto();
      return;
    }
    if (on) progressAnim.pause();
    else progressAnim.play();
  };
  panel.addEventListener("pointerenter", () => holdAuto(true));
  panel.addEventListener("pointerleave", () => holdAuto(false));
  document.getElementById("dots").addEventListener("pointerenter", () => holdAuto(true));
  document.getElementById("dots").addEventListener("pointerleave", () => holdAuto(false));
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
    if (dot && (view === "home" || view === "socials")) {
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
  let linkTip = "";
  const placeVisit = () => {
    if (!visit) return;
    const label = overCard && (view === "home" || view === "socials") ? copy[lang].visit : linkTip;
    if (visit.textContent !== label) visit.textContent = label;
    const show = !!label;
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
  window.addEventListener("pointermove", (event) => {
    tx = event.clientX;
    ty = event.clientY;
    const card = event.target.closest && event.target.closest(".card.is-on");
    overCard = !!(card && !card.hasAttribute("data-clone"));
    const link = event.target.closest && event.target.closest(".prose-link");
    const linkTipEl = link ? link.querySelector(".tip") : null;
    linkTip = linkTipEl ? linkTipEl.textContent : "";
    if (active) return;
    x = tx;
    y = ty;
    active = true;
    cursor.classList.add("is-on");
  });
  document.addEventListener("pointerleave", () => {
    active = false;
    overCard = false;
    linkTip = "";
    cursor.classList.remove("is-on");
  });
  const tick = () => {
    const follow = motionOk ? 0.45 : 1;
    x += (tx - x) * follow;
    y += (ty - y) * follow;
    cursor.style.transform = `translate(${x - 5}px, ${y - 4.2}px)`;
    placeVisit();
    window.requestAnimationFrame(tick);
  };
  tick();
}

function init() {
  try {
    const saved = localStorage.getItem("delexo-lang");
    if (saved === "en" || saved === "es") lang = saved;
  } catch (err) { /* ignore */ }
  document.body.classList.add("is-booting");
  paint();
  booted = true;
  bind();
  bindCursor();
  window.setTimeout(() => {
    document.body.classList.remove("is-booting");
    if (!sliding && !progressAnim) armAuto();
  }, 1100);
}

init();
