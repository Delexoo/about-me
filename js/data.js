// Delexo data: projects, stack, socials and inline brand glyphs.
const projects = [
  {
    name: "Mochi",
    href: "https://mochi-delexo.vercel.app/",
    host: "mochi-delexo.vercel.app",
    image: "assets/mochi.webp",
    icon: "assets/apps/mochi.svg",
    tint: "#f4efe6",
    wash: "#e7d3b8",
    en: {
      sub: "Windows AI assistant",
      note: "Always-on desktop companion. Beta.",
      desc: "An AI assistant that docks to the right edge of the Windows desktop, so you can ask about whatever is on screen, queue your own music, hide from a screenshare, or let it edit files and take notes without opening another window. Chats and playlists stay local and encrypted on the PC, and voice input is optional.",
      facts: ["Windows", "Local & encrypted", "Chat · music · files"],
    },
    es: {
      sub: "Asistente de IA para Windows",
      note: "Compañero de escritorio, siempre activo. Beta.",
      desc: "Un asistente de IA que se ancla al borde derecho del escritorio de Windows: le preguntas por lo que hay en pantalla, pones tu música, te escondes de una captura de pantalla o dejas que edite archivos y tome notas sin abrir otra ventana. Las conversaciones y listas se quedan locales y cifradas en el PC, y la voz es opcional.",
      facts: ["Windows", "Local y cifrado", "Chat · música · archivos"],
    },
  },
  {
    name: "Moonrise",
    href: "https://trymoonrise.com/",
    host: "trymoonrise.com",
    image: "assets/moonrise.webp",
    icon: "assets/apps/moonrise.svg",
    tint: "#f6deb6",
    wash: "#f0c48a",
    en: {
      sub: "Websites, in one click",
      note: "AI sites for local businesses and creators.",
      desc: "Moonrise scans nearby businesses that still have no website, generates a working site for one in a single click, and lets you sell it: the owner pays through the built-in checkout, the watermark comes off, and the creator keeps 90%. Sites are assembled from its own UI library and deploy to Vercel, with a custom domain when the client is ready for one.",
      facts: ["90% creator cut", "One-click sites", "Local businesses"],
    },
    es: {
      sub: "Sitios web, en un clic",
      note: "Sitios con IA para negocios locales y creadores.",
      desc: "Moonrise busca negocios cercanos que aún no tienen sitio web, genera uno funcional con un clic y te deja venderlo: el dueño paga con el checkout integrado, la marca de agua desaparece y el creador se queda con el 90%. Los sitios se arman con su propia librería de UI y se publican en Vercel, con dominio propio cuando el cliente lo necesita.",
      facts: ["90% al creador", "Sitio en un clic", "Negocios locales"],
    },
  },
  {
    name: "Free University Tools",
    href: "https://freeuniversitytools.com/",
    repo: "https://github.com/Delexoo/freeuniversitytools",
    host: "freeuniversitytools.com",
    image: "assets/freeuniversitytools.webp",
    icon: "assets/apps/freeuniversitytools.svg",
    tint: "#eef4f1",
    wash: "#c9ddd3",
    en: {
      sub: "Student tool directory",
      note: "Thousands of free apps, one search.",
      desc: "A curated directory of free and free-tier tools for students: AI, study apps, books, courses, converters, design, productivity, and more. Search and filter by pricing or type, browse categories, or open the full student directory, no account required, and the list keeps growing through community reports.",
      facts: ["Search & filters", "Free tools", "Open source"],
    },
    es: {
      sub: "Directorio de herramientas",
      note: "Miles de apps gratis, en una búsqueda.",
      desc: "Un directorio curado de herramientas gratis y con plan gratuito para estudiantes: IA, estudio, libros, cursos, conversores, diseño, productividad y más. Busca y filtra por precio o tipo, explora categorías o abre el directorio completo, sin cuenta, y la lista crece con reportes de la comunidad.",
      facts: ["Búsqueda", "Gratis", "Código abierto"],
    },
  },
  {
    name: "OrbINT",
    href: "https://orbint.net",
    repo: "https://github.com/Delexoo/OrbINT",
    host: "orbint.net",
    image: "assets/orbint-poster.webp?v=1",
    imageAnim: "assets/orbint.webp?v=3",
    icon: "assets/apps/orbint.svg",
    tint: "#e5eef2",
    wash: "#d5e4ec",
    en: {
      sub: "Open-source intelligence",
      note: "Local case files for reconnaissance.",
      desc: "An open-source reconnaissance casebook. Instead of juggling a dozen tabs, you collect scattered identifiers (phone numbers, usernames, emails, IPs, wallets, vehicles and more) into a single case file that stays on your machine, built for looking into publicly available information responsibly.",
      facts: ["Open source", "20+ fields", "Local cases"],
    },
    es: {
      sub: "Inteligencia de fuentes abiertas",
      note: "Expedientes locales de reconocimiento.",
      desc: "Un expediente de reconocimiento de código abierto. En vez de saltar entre decenas de pestañas, reúne identificadores dispersos (teléfonos, usuarios, correos, IPs, billeteras, vehículos y más) en un solo archivo que se queda en tu equipo, pensado para investigar información pública de forma responsable.",
      facts: ["Código abierto", "+20 campos", "Local"],
    },
  },
  {
    name: "MusicWidget",
    href: "https://delexoo.github.io/MusicWidget/",
    repo: "https://github.com/Delexoo/MusicWidget",
    host: "delexoo.github.io/MusicWidget",
    image: "assets/musicwidget.webp",
    icon: "assets/apps/musicwidget.svg",
    tint: "#e7efd9",
    wash: "#d5e2c4",
    en: {
      sub: "Desktop music player",
      note: "A floating player for Windows.",
      desc: "A 4 MB floating player for Windows 10 and 11 that stays on top of other windows so your music is always one click away. Playlists are plain folders on disk, tracks can be pulled in from the web, and a hotkey tucks the widget into the tray, no account, no ads, open source.",
      facts: ["Windows · 4 MB", "Folder playlists", "No account"],
    },
    es: {
      sub: "Reproductor de escritorio",
      note: "Un reproductor flotante para Windows.",
      desc: "Un reproductor flotante de 4 MB para Windows 10 y 11 que se queda encima de las demás ventanas para tener la música a un clic. Las listas son carpetas normales en el disco, puedes traer pistas desde la web y un atajo lo esconde en la bandeja: sin cuenta, sin anuncios y de código abierto.",
      facts: ["Windows · 4 MB", "Listas", "Sin cuenta"],
    },
  },
  {
    name: "GitReplay",
    href: "https://github.com/Delexoo/GitReplay",
    repo: "https://github.com/Delexoo/GitReplay",
    host: "github.com/Delexoo/GitReplay",
    image: "assets/gitreplay.webp",
    icon: "assets/apps/gitreplay.svg",
    tint: "#e7e9f2",
    wash: "#d9dcea",
    en: {
      sub: "Watch a repo build",
      note: "Replay any GitHub repository. Beta.",
      desc: "Takes any repository you can access, private ones included, and types its files out on screen character by character, with pause, speed and scrub controls. Web projects get a live HTML, CSS and JS preview while they build, and the whole thing runs in the browser on GitHub Pages with nothing to install.",
      facts: ["MIT", "Live replay", "In-browser"],
    },
    es: {
      sub: "Ver cómo se arma un repo",
      note: "Reproduce cualquier repositorio de GitHub. Beta.",
      desc: "Toma cualquier repositorio al que tengas acceso, privados incluidos, y escribe sus archivos en pantalla carácter por carácter, con pausa, velocidad y barra de avance. Los proyectos web tienen vista previa HTML, CSS y JS en vivo, y todo corre en el navegador sobre GitHub Pages sin instalar nada.",
      facts: ["MIT", "En vivo", "Navegador"],
    },
  },
  {
    name: "Vibe Code Checklist",
    href: "https://delexoo.github.io/vibe-code-checklist/",
    repo: "https://github.com/Delexoo/vibe-code-checklist",
    host: "delexoo.github.io/vibe-code-checklist",
    image: "assets/vibecodechecklist.webp",
    icon: "assets/apps/vibecodechecklist.svg",
    tint: "#f2f2f0",
    wash: "#dcdcd6",
    en: {
      sub: "Ship-readiness audit",
      note: "Catch demo polish before you launch.",
      desc: "A checklist for vibe-coded web apps that look finished but may still miss 404s, page titles, privacy copy, loading states, or a design that does not scream generated. Tick items by hand in the browser, or paste one prompt into the agent that has your project open and get a self-contained HTML scorecard with what is done, missing, or not applicable.",
      facts: ["Manual or agent", "HTML scorecard", "Open source"],
    },
    es: {
      sub: "Auditoría antes de publicar",
      note: "Detecta el pulido falso antes de lanzar.",
      desc: "Una lista para apps web hechas con IA que parecen listas pero aún pueden carecer de 404, títulos, textos de privacidad, estados de carga o un diseño que no grite “generado”. Marca ítems a mano en el navegador o pega un solo prompt en el agente que tenga tu proyecto abierto y obtén un informe HTML con lo hecho, lo que falta y lo que no aplica.",
      facts: ["Manual o agente", "Informe HTML", "Código abierto"],
    },
  },
  {
    name: "Capes++",
    href: "https://shop.beacons.ai/delexo/3f484dc8-435a-4a40-9be2-57b53c493c30",
    host: "shop.beacons.ai",
    image: "assets/capes.webp",
    icon: "assets/apps/capes.svg",
    tint: "#efe8f4",
    wash: "#d9cce6",
    en: {
      sub: "Minecraft cape customizer",
      note: "Swap free capes for your own style.",
      desc: "A simple Windows tool for Java Edition that replaces free Minecraft capes (Migrator, Vanilla, MCC, Cherry Blossom, and more) with any design you pick. Includes 75+ capes, PNG assets, full Python source, and support for uploading your own files. Works on 1.8.9 with OptiFine capes disabled.",
      facts: ["Java Edition", "75+ capes", "Full source"],
    },
    es: {
      sub: "Personaliza capas de Minecraft",
      note: "Cambia capas gratis por tu propio estilo.",
      desc: "Una herramienta simple para Windows en Java Edition que reemplaza capas gratis de Minecraft (Migrator, Vanilla, MCC, Cherry Blossom y más) por el diseño que elijas. Incluye más de 75 capas, archivos PNG, el código fuente en Python y soporte para subir tus propios archivos. Funciona en 1.8.9 con las capas de OptiFine desactivadas.",
      facts: ["Java Edition", "+75 capas", "Código fuente"],
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
  ["VS Code", "assets/icons/visualstudiocode.svg"],
  ["Cursor", "assets/icons/cursor.svg"],
  ["OpenRouter", "assets/icons/openrouter.svg"],
  ["Anthropic", "assets/icons/anthropic.svg"],
  ["ChatGPT", "assets/icons/openai.svg"],
  ["DeepSeek", "assets/icons/deepseek.svg"],
  ["Qwen", "assets/icons/qwen.svg"],
  ["Kali", "assets/icons/kalilinux.svg"],
  ["OSINT", "assets/icons/osint.svg"],
  ["Oracle VM", "assets/icons/oracle.svg"],
  ["Wireshark", "assets/icons/wireshark.svg"],
  ["Nmap", "assets/icons/nmap.svg"],
  ["AI Engineering", "assets/icons/ai.svg"],
  ["Prompt Engineering", "assets/icons/prompt.svg"],
  ["Digital Forensics", "assets/icons/forensics.svg"],
];

const stripeHref = "https://buy.stripe.com/9B63cu3RE2ouaKgcHLcjS00";

const profileRepo = {
  commits: "https://api.github.com/repos/Delexoo/about-me/commits?per_page=1",
};

const profileViewsEndpoint = {
  hit: "https://abacus.jasoncameron.dev/hit/delexo/profile-views",
  get: "https://abacus.jasoncameron.dev/get/delexo/profile-views",
};

const socials = [
  { href: "mailto:teambrilliantt@hotmail.com", en: "Email", es: "Correo", src: "assets/socials/gmail.svg" },
  { href: "tel:+14013000957", en: "Phone", es: "Teléfono", src: "assets/socials/iphone.jpg" },
  { href: "https://github.com/Delexoo", en: "GitHub", es: "GitHub", src: "assets/socials/github.webp" },
  { href: "https://t.me/delexxo", en: "Telegram", es: "Telegram", src: "assets/socials/telegram.svg" },
  { discord: true, en: "Discord", es: "Discord", src: "assets/socials/discord.webp" },
  { href: "https://open.spotify.com/user/31bkbmqthacfrfchjncyj2kpvase", en: "Spotify", es: "Spotify", src: "assets/socials/spotify.webp" },
  { href: "https://namemc.com/Delexo", en: "NameMC", es: "NameMC", src: "assets/socials/namemc.webp?v=3" },
  { href: "https://gdbrowser.com/u/vans", en: "GDBrowser", es: "GDBrowser", src: "assets/socials/gdbrowser.webp?v=4" },
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

