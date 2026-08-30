(function () {
  "use strict";

  const SPLASH_MIN_MS = 1100;
  const SPLASH_FADE_MS = 850;

  function supportersApiBase() {
    return (window.SUPPORTERS_API_BASE || "").replace(/\/+$/, "");
  }

  function supabasePublicConfig() {
    const url = (window.SUPABASE_URL || "").replace(/\/+$/, "");
    const key = window.SUPABASE_ANON_KEY || "";
    return url && key ? { url, key } : null;
  }

  /** Render API first; Supabase REST fallback when CORS blocks preview origins. */
  async function fetchLeaderboardRows(limit) {
    const safeLimit = Math.max(1, Math.min(10000, Math.floor(Number(limit) || 5)));
    const api = supportersApiBase();

    const tryRender = async () => {
      const endpoint = api
        ? `${api}/leaderboard?limit=${safeLimit}`
        : `/leaderboard?limit=${safeLimit}`;
      const response = await fetch(endpoint, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!response.ok) return null;
      const data = await response.json().catch(() => null);
      return data && Array.isArray(data.rows) ? data.rows : null;
    };

    const trySupabase = async () => {
      const cfg = supabasePublicConfig();
      if (!cfg) return null;
      const url = new URL(`${cfg.url}/rest/v1/supporters`);
      url.searchParams.set("select", "display_name,note,total_cents,social_url");
      url.searchParams.set("order", "total_cents.desc");
      url.searchParams.set("limit", String(safeLimit));
      const response = await fetch(url.toString(), {
        headers: {
          apikey: cfg.key,
          Authorization: `Bearer ${cfg.key}`,
          Accept: "application/json",
        },
        cache: "no-store",
      });
      if (!response.ok) return null;
      const rows = await response.json().catch(() => null);
      return Array.isArray(rows) ? rows : null;
    };

    try {
      const rows = await tryRender();
      if (rows) return rows;
    } catch (_error) {}

    try {
      const rows = await trySupabase();
      if (rows) return rows;
    } catch (_error) {}

    return null;
  }

  function initSplash() {
    const splash = document.getElementById("splash");
    if (!splash) return;

    document.documentElement.classList.add("splash-active");

    const hide = () => {
      splash.classList.add("is-hidden");
      splash.setAttribute("aria-hidden", "true");

      const unlock = () => {
        document.documentElement.classList.remove("splash-active");
      };

      splash.addEventListener(
        "transitionend",
        (event) => {
          if (event.target !== splash || event.propertyName !== "opacity") return;
          unlock();
        },
        { once: true }
      );
      window.setTimeout(unlock, SPLASH_FADE_MS + 80);
    };

    const started = performance.now();

    const finish = () => {
      const elapsed = performance.now() - started;
      const wait = Math.max(0, SPLASH_MIN_MS - elapsed);
      window.setTimeout(hide, wait);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }
  }

  function initPageTransitions() {
    const internal = document.querySelectorAll('a[data-transition="page"]');
    internal.forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (!href || href.startsWith("#") || link.target === "_blank") return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        e.preventDefault();
        const splash = document.getElementById("splash");
        if (splash) {
          splash.classList.remove("is-hidden");
          splash.setAttribute("aria-hidden", "false");
          document.documentElement.classList.add("splash-active");
        }
        window.setTimeout(() => {
          window.location.href = href;
        }, 420);
      });
    });
  }

  function getScrollProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    const scrollHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    const maxScroll = scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return 0;
    return Math.min(1, Math.max(0, scrollTop / maxScroll));
  }

  function initScrollProgress() {
    const thumb = document.getElementById("scrollThumb");
    if (!thumb) return;

    let ticking = false;

    function update() {
      const progress = getScrollProgress();
      document.documentElement.style.setProperty("--scroll-progress", String(progress));
      thumb.style.width = `${progress * 100}%`;
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", update, { passive: true });
    update();
  }

  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach((el) => observer.observe(el));
  }

  function markActiveNav() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("[data-nav]").forEach((link) => {
      const target = link.getAttribute("data-nav");
      const isHome = path === "" || path === "index.html";
      const active =
        (target === "home" && isHome) ||
        (target !== "home" && path === target + ".html");
      link.classList.toggle("is-active", active);
    });
  }

  function applyNavProximity(group, index) {
    const links = [...group.querySelectorAll(".nav-link")];
    const scales = [1.32, 1.12, 1.06];

    group.classList.add("is-active");
    links.forEach((link, i) => {
      const distance = Math.abs(i - index);
      const scale = scales[distance] || 1;
      link.style.setProperty("--proximity-scale", String(scale));
      if (distance <= 2) {
        link.setAttribute("data-proximity", String(distance));
      } else {
        link.removeAttribute("data-proximity");
      }
    });
  }

  function resetNavProximity(group) {
    group.classList.remove("is-active");
    group.querySelectorAll(".nav-link").forEach((link) => {
      link.style.removeProperty("--proximity-scale");
      link.removeAttribute("data-proximity");
    });
  }

  function initScrollSectionFocus() {
    const sections = [...document.querySelectorAll(".site-section")];
    if (!sections.length) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ticking = false;

    function update() {
      const viewportAnchor = window.innerHeight * 0.4;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const top = rect.top;
        const height = rect.height || 1;
        const center = top + height * 0.38;
        const distance = Math.abs(viewportAnchor - center);
        const range = Math.max(height * 0.85, window.innerHeight * 0.45);
        const focus = Math.max(0, Math.min(1, 1 - distance / range));

        if (!reducedMotion) {
          section.style.setProperty("--section-focus", focus.toFixed(3));
          section.classList.toggle("is-scroll-focused", focus > 0.42);
        }
      });

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", update, { passive: true });
    update();
  }

  function initMobileNav() {
    const nav = document.getElementById("siteNav");
    const toggle = document.getElementById("navMenuToggle");
    const panel = document.getElementById("navMenuPanel");
    if (!nav || !toggle || !panel) return;

    const mq = window.matchMedia("(max-width: 768px)");

    function isMobile() {
      return mq.matches;
    }

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.documentElement.classList.toggle("nav-menu-open", open && isMobile());
    }

    function closeMenu() {
      setOpen(false);
    }

    toggle.addEventListener("click", () => {
      setOpen(!nav.classList.contains("is-open"));
    });

    panel.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (isMobile()) closeMenu();
      });
    });

    document.addEventListener("click", (event) => {
      if (!isMobile() || !nav.classList.contains("is-open")) return;
      if (!nav.contains(event.target)) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    mq.addEventListener("change", () => {
      if (!mq.matches) closeMenu();
    });

    nav.closeMenu = closeMenu;
  }

  function initSectionNav() {
    const navGroup = document.querySelector(".hero__links.nav-proximity");
    const links = [...document.querySelectorAll(".hero__links .nav-link[data-section]")];
    if (!links.length) return;

    const sectionIds = [...new Set(links.map((link) => link.dataset.section || "").filter(Boolean))];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const contentSections = sections.filter((section) => section.id !== "top");
    const menuLabel = document.getElementById("navMenuLabel");
    const sectionLabels = {
      top: "Home",
      projects: "Projects",
      courses: "Courses",
      journey: "Journey",
      supporters: "Supporters",
    };
    const mobileMq = window.matchMedia("(max-width: 768px)");

    if (!sections.length) return;

    const allNavLinks = navGroup
      ? [...navGroup.querySelectorAll(".nav-link")]
      : links;

    let navHovered = false;

    if (navGroup) {
      navGroup.addEventListener("mouseenter", () => {
        navHovered = true;
      });
      navGroup.addEventListener("mouseleave", () => {
        navHovered = false;
        updateActiveSection();
      });
    }

    function setActive(id) {
      links.forEach((link) => {
        link.classList.toggle("is-active", link.dataset.section === id);
      });
      if (menuLabel && mobileMq.matches) {
        menuLabel.textContent = sectionLabels[id] || "Menu";
      } else if (menuLabel) {
        menuLabel.textContent = "Menu";
      }
    }

    function applyScrollNavProximity(activeLink) {
      if (mobileMq.matches || !navGroup || navHovered || !activeLink) return;
      const index = allNavLinks.indexOf(activeLink);
      if (index >= 0) applyNavProximity(navGroup, index);
    }

    function updateActiveSection() {
      const probe = window.innerHeight * 0.35;
      let current = "top";

      contentSections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= probe + 48) current = section.id;
      });

      setActive(current);

      const activeLink = links.find((link) => link.dataset.section === current);
      applyScrollNavProximity(activeLink);
    }

    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        const sectionId = link.dataset.section || "";
        const target = document.getElementById(sectionId);
        if (!target) return;
        event.preventDefault();
        if (sectionId === "top") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        setActive(sectionId);
        applyScrollNavProximity(link);
        navGroup?.closeMenu?.();
      });
    });

    mobileMq.addEventListener("change", updateActiveSection);
    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    document.addEventListener("scroll", updateActiveSection, { passive: true, capture: true });
    window.addEventListener("resize", updateActiveSection);
  }

  function initNavProximity() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 768px)").matches) return;

    document.querySelectorAll(".nav-proximity").forEach((group) => {
      const links = [...group.querySelectorAll(".nav-link")];
      if (!links.length) return;

      links.forEach((link, index) => {
        link.addEventListener("mouseenter", () => applyNavProximity(group, index));
        link.addEventListener("focus", () => applyNavProximity(group, index));
      });

      group.addEventListener("mouseleave", () => {
        const active = group.querySelector(".nav-link.is-active");
        if (active) {
          applyNavProximity(group, links.indexOf(active));
          return;
        }
        resetNavProximity(group);
      });

      group.addEventListener("focusout", (event) => {
        if (!group.contains(event.relatedTarget)) {
          const active = group.querySelector(".nav-link.is-active");
          if (active) {
            applyNavProximity(group, links.indexOf(active));
          } else {
            resetNavProximity(group);
          }
        }
      });
    });
  }

  function initSupportersLeaderboard() {
    const list = document.getElementById("supportersList");
    const donateBtn = document.getElementById("supportersDonateBtn");
    const statusEl = document.getElementById("supportersStatus");
    const thanks = document.getElementById("supportersThanks");
    const thanksClose = document.getElementById("supportersThanksClose");
    const skipBtn = document.getElementById("supportersSkipBtn");
    const saveBtn = document.getElementById("supportersSaveBtn");
    const nameInput = document.getElementById("supportersName");
    const noteInput = document.getElementById("supportersNote");
    const nameCount = document.getElementById("supportersNameCount");
    const noteCount = document.getElementById("supportersNoteCount");
    if (!list) return;

    const TOP_N = 5;
    const NOTE_MAX = 100;

    function apiBase() {
      return supportersApiBase();
    }

    function escapeHtml(value) {
      return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll("\"", "&quot;")
        .replaceAll("'", "&#39;");
    }

    function safeUrl(url) {
      const value = (url || "").trim();
      if (!value || value.length > 220) return "";
      try {
        const parsed = new URL(value);
        if (parsed.protocol === "http:" || parsed.protocol === "https:") {
          return parsed.toString();
        }
      } catch (_error) {}
      return "";
    }

    function fmtMoneyFromCents(cents) {
      const amount = Number(cents || 0) / 100;
      return amount.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
      });
    }

    function padRank(index) {
      return String(index + 1).padStart(2, "0");
    }

    function setStatus(message) {
      if (statusEl) statusEl.textContent = message || "";
    }

    function updateCounts() {
      if (nameCount && nameInput) {
        nameCount.textContent = `${nameInput.value.length}/40`;
      }
      if (noteCount && noteInput) {
        noteCount.textContent = `${noteInput.value.length}/${NOTE_MAX}`;
      }
    }

    function avatarInitial(name) {
      const trimmed = (name || "?").trim();
      return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
    }

    function rowHtml({ rank, nameHtml, amount, lead, loading }) {
      const leadClass = lead ? " supporters__row--lead" : "";
      const loadingClass = loading ? " supporters__row--loading" : "";
      const plainName = nameHtml.replace(/<[^>]*>/g, "");
      const initial = avatarInitial(plainName);
      return `
        <tr class="supporters__row${leadClass}${loadingClass}">
          <td class="supporters__rank"${rank ? ` aria-label="Rank ${rank}"` : ' aria-hidden="true"'}>${rank || "–"}</td>
          <td class="supporters__name-cell">
            <span class="supporters__avatar${loading ? " supporters__avatar--empty" : ""}" aria-hidden="true">${loading ? "" : escapeHtml(initial)}</span>
            <span class="supporters__name">${nameHtml}</span>
          </td>
          <td class="supporters__amount"><span class="supporters__amount-tag">${escapeHtml(amount)}</span></td>
        </tr>`;
    }

    function renderLeaderboard(donors) {
      if (!donors.length) {
        list.innerHTML = rowHtml({
          rank: "",
          nameHtml: "No supporters yet. Be the first.",
          amount: "–",
          lead: true,
          loading: true,
        });
        list.setAttribute("aria-busy", "false");
        return;
      }

      list.innerHTML = donors.slice(0, TOP_N).map((row, index) => {
        const name = (row.display_name || "–").toString();
        const amount = fmtMoneyFromCents(row.total_cents);
        const social = safeUrl(row.social_url);
        const nameHtml = social
          ? `<a href="${escapeHtml(social)}" target="_blank" rel="noopener noreferrer">${escapeHtml(name)}</a>`
          : escapeHtml(name);

        return rowHtml({
          rank: padRank(index),
          nameHtml,
          amount,
          lead: index === 0,
          loading: false,
        });
      }).join("");

      list.setAttribute("aria-busy", "false");
    }

    async function loadLeaderboard() {
      list.setAttribute("aria-busy", "true");
      list.innerHTML = rowHtml({
        rank: "",
        nameHtml: "Loading supporters…",
        amount: "–",
        lead: false,
        loading: true,
      });

      try {
        const rows = await fetchLeaderboardRows(TOP_N);
        if (!rows) throw new Error("leaderboard_unavailable");
        const paid = rows.filter((row) => Number(row.total_cents) > 0);
        renderLeaderboard(paid);
      } catch (_error) {
        list.innerHTML = rowHtml({
          rank: "",
          nameHtml: "Couldn't load supporters.",
          amount: "–",
          lead: false,
          loading: true,
        });
        list.setAttribute("aria-busy", "false");
      }
    }

    function showThanksForm(sessionId) {
      if (!thanks) return;
      thanks.hidden = false;
      thanks.dataset.sessionId = sessionId || "";
      try {
        const previous = localStorage.getItem("sup_display_name");
        if (previous && nameInput && !nameInput.value) {
          nameInput.value = previous.slice(0, 40);
        }
      } catch (_error) {}
      updateCounts();
      nameInput?.focus();
    }

    function hideThanksForm() {
      if (!thanks) return;
      thanks.hidden = true;
      thanks.dataset.sessionId = "";
      setStatus("");
    }

    async function prefillFromBackend(sessionId) {
      try {
        const api = apiBase();
        const endpoint = api
          ? `${api}/supporter?session_id=${encodeURIComponent(sessionId)}`
          : `/supporter?session_id=${encodeURIComponent(sessionId)}`;
        const response = await fetch(endpoint, {
          headers: { Accept: "application/json" },
        });
        if (!response.ok) return;
        const data = await response.json().catch(() => null);
        const supporter = data && data.supporter ? data.supporter : null;
        if (!supporter) return;
        if (nameInput && typeof supporter.display_name === "string") {
          nameInput.value = supporter.display_name.slice(0, 40);
        }
        if (noteInput && typeof supporter.note === "string") {
          noteInput.value = supporter.note.slice(0, NOTE_MAX);
        }
        updateCounts();
      } catch (_error) {}
    }

    function goToCheckout(stripeUrl) {
      if (!stripeUrl) return;
      setStatus("Opening Stripe checkout…");
      window.location.assign(stripeUrl);
      window.setTimeout(() => {
        if (!statusEl) return;
        statusEl.innerHTML = `Redirect blocked? <a class="text-link" href="${escapeHtml(stripeUrl)}">Continue to Stripe checkout</a>`;
      }, 900);
    }

    async function startCheckout() {
      if (!donateBtn) return;
      const api = apiBase();
      if (
        !api &&
        window.location.protocol.startsWith("http") &&
        window.location.hostname !== "localhost" &&
        window.location.hostname !== "127.0.0.1"
      ) {
        setStatus("Supporters backend is not configured.");
        return;
      }

      const displayName = (nameInput && nameInput.value) || "";

      try {
        donateBtn.setAttribute("aria-busy", "true");
        donateBtn.disabled = true;
        setStatus("");

        // Cross-origin API (Render): JSON POST when CORS allows, else GET /donate redirect
        if (api) {
          try {
            const response = await fetch(`${api}/create-checkout-session`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                display_name: displayName.slice(0, 40),
              }),
            });
            const data = await response.json().catch(() => null);
            if (response.ok && data && data.url) {
              goToCheckout(data.url);
              return;
            }
          } catch (_fetchError) {
            /* CORS on preview origins — use GET redirect on API host */
          }
          const donateUrl = new URL(`${api}/donate`);
          if (displayName) {
            donateUrl.searchParams.set("display_name", displayName.slice(0, 40));
          }
          window.location.href = donateUrl.toString();
          return;
        }

        const response = await fetch("/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ display_name: displayName }),
        });
        const data = await response.json().catch(() => null);
        if (!response.ok || !data || !data.url) {
          setStatus(
            (data && (data.detail || data.error)) || "Checkout failed. Try again."
          );
          return;
        }

        goToCheckout(data.url);
      } catch (_error) {
        setStatus("Couldn't reach the supporters backend. Try again in a moment.");
      } finally {
        donateBtn.disabled = false;
        donateBtn.removeAttribute("aria-busy");
      }
    }

    async function saveNote(event) {
      event.preventDefault();
      if (!thanks) return;

      const api = apiBase();
      const sessionId = thanks.dataset.sessionId || "";
      const name = (nameInput && nameInput.value || "").trim();
      const note = (noteInput && noteInput.value || "").trim().slice(0, NOTE_MAX);

      if (!sessionId) {
        setStatus("Missing checkout session. Please donate first.");
        return;
      }
      if (!name) {
        setStatus("Please enter your name.");
        nameInput?.focus();
        return;
      }

      try {
        setStatus("Saving…");
        if (saveBtn) {
          saveBtn.disabled = true;
          saveBtn.setAttribute("aria-busy", "true");
        }

        const response = await fetch(api ? `${api}/save-note` : "/save-note", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            display_name: name,
            note,
            social_url: "",
          }),
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          setStatus(
            (data && (data.detail || data.error)) || "Couldn’t save your note."
          );
          return;
        }

        try {
          localStorage.setItem("sup_display_name", name.slice(0, 40));
        } catch (_error) {}
        setStatus("Saved. Thank you for supporting.");
        await loadLeaderboard();
      } catch (_error) {
        setStatus("Couldn’t save your note. Try again.");
      } finally {
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.removeAttribute("aria-busy");
        }
      }
    }

    function readThanksParams() {
      const url = new URL(window.location.href);
      const thanksFlag = url.searchParams.get("thanks");
      const sessionId = url.searchParams.get("session_id");
      if (thanksFlag !== "1" || !sessionId) return;

      showThanksForm(sessionId);
      prefillFromBackend(sessionId);
      url.searchParams.delete("thanks");
      url.searchParams.delete("session_id");
      window.history.replaceState(
        {},
        "",
        url.pathname + (url.search ? url.search : "") + url.hash
      );
    }

    donateBtn?.addEventListener("click", startCheckout);
    thanks?.addEventListener("submit", saveNote);
    thanksClose?.addEventListener("click", hideThanksForm);
    skipBtn?.addEventListener("click", hideThanksForm);
    nameInput?.addEventListener("input", updateCounts);
    noteInput?.addEventListener("input", updateCounts);

    loadLeaderboard();
    readThanksParams();
  }

  function initMoonriseGithubEmbed() {
    const root = document.getElementById("moonriseGithubEmbed");
    if (!root) return;

    const repoPath = root.dataset.repo || "Delexoo/MoonriseWebAgency";
    const descriptionEl = document.getElementById("moonriseRepoDescription");
    const starsEl = document.getElementById("moonriseRepoStars");
    const forksEl = document.getElementById("moonriseRepoForks");
    const updatedEl = document.getElementById("moonriseRepoUpdated");
    const languagesWrap = document.getElementById("moonriseRepoLanguages");
    const langBar = document.getElementById("moonriseRepoLangBar");
    const langList = document.getElementById("moonriseRepoLangList");

    const fallbackDescription =
      "Your sales team command center: training, leads, scripts, commissions, and team tools in one place.";

    const languageColors = {
      JavaScript: "#f1e05a",
      CSS: "#663399",
      HTML: "#e34c26",
      TypeScript: "#3178c6",
      Python: "#3572a5",
    };

    function formatUpdated(dateString) {
      if (!dateString) return "–";
      try {
        return new Intl.DateTimeFormat(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        }).format(new Date(dateString));
      } catch (_error) {
        return "–";
      }
    }

    function renderLanguages(languages) {
      if (!languagesWrap || !langBar || !langList) return;

      const entries = Object.entries(languages || {});
      if (!entries.length) {
        languagesWrap.hidden = true;
        return;
      }

      const total = entries.reduce((sum, [, bytes]) => sum + bytes, 0);
      const sorted = entries.sort((a, b) => b[1] - a[1]).slice(0, 4);

      langBar.innerHTML = sorted
        .map(([name, bytes]) => {
          const width = total ? (bytes / total) * 100 : 0;
          const color = languageColors[name] || "#8b8b8b";
          return `<span style="width:${width}%;background:${color}"></span>`;
        })
        .join("");

      langList.innerHTML = sorted
        .map(([name, bytes]) => {
          const percent = total ? Math.round((bytes / total) * 100) : 0;
          const color = languageColors[name] || "#8b8b8b";
          return `<li><span style="background:${color}"></span>${name} ${percent}%</li>`;
        })
        .join("");

      languagesWrap.hidden = false;
    }

    async function loadRepoEmbed() {
      try {
        const [repoResponse, languagesResponse] = await Promise.all([
          fetch(`https://api.github.com/repos/${repoPath}`, {
            headers: { Accept: "application/vnd.github+json" },
          }),
          fetch(`https://api.github.com/repos/${repoPath}/languages`, {
            headers: { Accept: "application/vnd.github+json" },
          }),
        ]);

        if (!repoResponse.ok) throw new Error("repo_request_failed");

        const repo = await repoResponse.json();
        const languages = languagesResponse.ok
          ? await languagesResponse.json().catch(() => ({}))
          : {};

        if (descriptionEl) {
          descriptionEl.textContent =
            repo.description || fallbackDescription;
        }
        if (starsEl) starsEl.textContent = String(repo.stargazers_count ?? 0);
        if (forksEl) forksEl.textContent = String(repo.forks_count ?? 0);
        if (updatedEl) updatedEl.textContent = formatUpdated(repo.updated_at);

        renderLanguages(languages);
      } catch (_error) {
        if (descriptionEl) descriptionEl.textContent = fallbackDescription;
        if (starsEl) starsEl.textContent = "–";
        if (forksEl) forksEl.textContent = "–";
        if (updatedEl) updatedEl.textContent = "–";
        if (languagesWrap) languagesWrap.hidden = true;
      }
    }

    loadRepoEmbed();
  }

  function initCourseFolders() {
    const grids = document.querySelectorAll(".course-grid, .course-rail");
    if (!grids.length) return;

    grids.forEach((grid) => {
      const cards = [...grid.querySelectorAll(":scope > .course-card")];
      if (cards.length <= 3) return;

      const hidden = cards.slice(2);
      const count = hidden.length;

      hidden.forEach((card) => card.classList.add("course-card--folded"));

      const overflow = document.createElement("div");
      overflow.className = grid.classList.contains("course-rail")
        ? "course-rail__overflow"
        : "course-grid__overflow";

      const overflowInner = document.createElement("div");
      overflowInner.className = grid.classList.contains("course-rail")
        ? "course-rail__overflow-inner"
        : "course-grid__overflow-inner";

      hidden.forEach((card) => overflowInner.appendChild(card));
      overflow.appendChild(overflowInner);

      const previews = hidden
        .slice(0, 3)
        .map((card) => card.querySelector(".course-card__media img")?.getAttribute("src"))
        .filter(Boolean);

      const previewHtml = previews
        .map(
          (src) =>
            `<span class="course-folder__preview"><img src="${src}" alt="" loading="lazy" decoding="async"></span>`
        )
        .join("");

      const folder = document.createElement("button");
      folder.type = "button";
      folder.className = "course-folder reveal is-visible";
      folder.setAttribute("aria-expanded", "false");
      folder.setAttribute("aria-label", `Show ${count} more courses`);
      folder.innerHTML = `
        <span class="course-folder__media" aria-hidden="true">
          <span class="course-folder__stack">${previewHtml}</span>
          <span class="course-folder__count">+${count}</span>
        </span>
        <span class="course-folder__name">Click For More!</span>
      `;

      cards[1].after(folder);
      folder.after(overflow);

      const folderName = folder.querySelector(".course-folder__name");
      const folderCount = folder.querySelector(".course-folder__count");

      function setFolderState(expanded) {
        folder.setAttribute("aria-expanded", expanded ? "true" : "false");
        folder.setAttribute(
          "aria-label",
          expanded ? `Hide ${count} courses` : `Show ${count} more courses`
        );
        folder.classList.toggle("course-folder--expanded", expanded);
        if (folderName) {
          folderName.textContent = expanded ? "Click For Less!" : "Click For More!";
        }
        if (folderCount) {
          folderCount.textContent = expanded ? "−" : `+${count}`;
        }
      }

      function expand() {
        setFolderState(true);
        folder.classList.add("is-opening");
        grid.classList.add("is-expanding");

        requestAnimationFrame(() => {
          grid.classList.add("is-expanded");

          hidden.forEach((card, index) => {
            card.classList.remove("is-folding");
            card.style.animationDelay = `${index * 0.05}s`;
            card.classList.add("is-unfolding");
          });

          window.setTimeout(() => {
            grid.classList.remove("is-expanding");
            folder.classList.remove("is-opening");
            hidden.forEach((card) => {
              card.classList.remove("is-unfolding");
              card.style.animationDelay = "";
            });
          }, 520);
        });
      }

      function collapse() {
        folder.classList.add("is-closing");
        grid.classList.add("is-collapsing");
        grid.classList.remove("is-expanded");
        setFolderState(false);

        hidden.forEach((card, index) => {
          card.classList.remove("is-unfolding");
          card.style.animationDelay = `${Math.min(index, 4) * 0.03}s`;
          card.classList.add("is-folding");
        });

        window.setTimeout(() => {
          grid.classList.remove("is-collapsing");
          folder.classList.remove("is-closing");
          hidden.forEach((card) => {
            card.classList.remove("is-folding");
            card.style.animationDelay = "";
          });
        }, 480);
      }

      folder.addEventListener("click", () => {
        if (
          folder.classList.contains("is-opening") ||
          folder.classList.contains("is-closing") ||
          grid.classList.contains("is-expanding") ||
          grid.classList.contains("is-collapsing")
        ) {
          return;
        }

        if (grid.classList.contains("is-expanded")) {
          collapse();
        } else {
          expand();
        }
      });
    });
  }

  function initJourneyTimeline() {
    const timeline = document.getElementById("journeyTimeline");
    if (!timeline) return;

    const items = [...timeline.querySelectorAll(".journey-item")];
    let ticking = false;

    function update() {
      const anchor = window.innerHeight * 0.6;

      items.forEach((item) => {
        const isGoal = item.classList.contains("journey-item--goal");
        if (isGoal) {
          item.classList.remove("is-reached");
          return;
        }

        const node = item.querySelector(".journey-item__node");
        if (!node) return;
        const nodeRect = node.getBoundingClientRect();
        const nodeCenter = nodeRect.top + nodeRect.height / 2;
        item.classList.toggle("is-reached", anchor >= nodeCenter);
      });

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }

  function initFaqAccordion() {
    const items = document.querySelectorAll(".faq-item");
    if (!items.length) return;

    function collapseItem(item, panel) {
      panel.style.height = `${panel.scrollHeight}px`;
      panel.offsetHeight;
      panel.style.height = "0px";

      const onEnd = (event) => {
        if (event.propertyName !== "height") return;
        panel.removeEventListener("transitionend", onEnd);
        item.removeAttribute("open");
        panel.style.height = "";
      };

      panel.addEventListener("transitionend", onEnd);
    }

    function expandItem(item, panel) {
      item.setAttribute("open", "");
      panel.style.height = "0px";
      panel.offsetHeight;
      panel.style.height = `${panel.scrollHeight}px`;

      const onEnd = (event) => {
        if (event.propertyName !== "height") return;
        panel.removeEventListener("transitionend", onEnd);
        if (item.hasAttribute("open")) {
          panel.style.height = "auto";
        }
      };

      panel.addEventListener("transitionend", onEnd);
    }

    items.forEach((item) => {
      const summary = item.querySelector("summary");
      const panel = item.querySelector(".faq-item__panel");
      if (!summary || !panel) return;

      summary.addEventListener("click", (event) => {
        event.preventDefault();

        if (item.hasAttribute("open")) {
          collapseItem(item, panel);
          return;
        }

        items.forEach((other) => {
          if (other === item || !other.hasAttribute("open")) return;
          const otherPanel = other.querySelector(".faq-item__panel");
          if (otherPanel) collapseItem(other, otherPanel);
        });

        expandItem(item, panel);
      });
    });
  }

  function initSiteInfoTabs() {
    const tabs = [...document.querySelectorAll(".site-info__tab")];
    const panels = [...document.querySelectorAll(".site-info__panel")];
    const supportersTbody = document.getElementById("siteInfoSupporters");
    if (!tabs.length || !panels.length) return;

    let supportersLoaded = false;
    let supportersLoading = false;

    function escapeHtml(value) {
      return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll("\"", "&quot;")
        .replaceAll("'", "&#39;");
    }

    function safeUrl(url) {
      const value = (url || "").trim();
      if (!value || value.length > 220) return "";
      try {
        const parsed = new URL(value);
        if (parsed.protocol === "http:" || parsed.protocol === "https:") {
          return parsed.toString();
        }
      } catch (_error) {}
      return "";
    }

    function fmtMoneyFromCents(cents) {
      const amount = Number(cents || 0) / 100;
      return amount.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
      });
    }

    function apiBase() {
      return supportersApiBase();
    }

    async function loadSupporters() {
      if (!supportersTbody || supportersLoaded || supportersLoading) return;
      supportersLoading = true;
      supportersTbody.innerHTML = `<tr><td>–</td><td colspan="3">Loading supporters...</td></tr>`;

      try {
        const rows = await fetchLeaderboardRows(10000);
        if (!rows) throw new Error("leaderboard_unavailable");
        const paid = rows.filter((row) => Number(row.total_cents) > 0);

        if (!paid.length) {
          supportersTbody.innerHTML = `
            <tr>
              <td>–</td>
              <td>No supporters yet.</td>
              <td class="site-info__supporters-note-col">–</td>
              <td><span class="site-info__amount">–</span></td>
            </tr>`;
          supportersLoaded = true;
          return;
        }

        supportersTbody.innerHTML = paid.map((row, index) => {
          const name = (row.display_name || "–").toString();
          const note = (row.note || "–").toString();
          const social = safeUrl(row.social_url);
          const nameHtml = social
            ? `<a href="${escapeHtml(social)}" target="_blank" rel="noopener noreferrer">${escapeHtml(name)}</a>`
            : escapeHtml(name);

          return `
            <tr>
              <td>${index + 1}</td>
              <td>${nameHtml}</td>
              <td class="site-info__supporters-note-col">${escapeHtml(note)}</td>
              <td><span class="site-info__amount">${escapeHtml(fmtMoneyFromCents(row.total_cents))}</span></td>
            </tr>`;
        }).join("");

        supportersLoaded = true;
      } catch (_error) {
        supportersTbody.innerHTML = `<tr><td>–</td><td colspan="3">Couldn't load the leaderboard.</td></tr>`;
      } finally {
        supportersLoading = false;
      }
    }

    function selectTab(index) {
      tabs.forEach((tab, tabIndex) => {
        const selected = tabIndex === index;
        tab.setAttribute("aria-selected", selected ? "true" : "false");
        tab.tabIndex = selected ? 0 : -1;
      });

      panels.forEach((panel, panelIndex) => {
        panel.hidden = panelIndex !== index;
      });

      if (panels[index]?.id === "site-info-panel-supporters") {
        loadSupporters();
      }
    }

    function selectTabByName(name) {
      const index = tabs.findIndex((tab) => tab.id === `site-info-tab-${name}`);
      if (index >= 0) selectTab(index);
    }

    const TAB_HASHES = {
      privacy: "",
      terms: "terms",
      links: "links",
      supporters: "supporters",
    };

    const HASH_TO_TAB = {
      "": "privacy",
      privacy: "privacy",
      terms: "terms",
      links: "links",
      "all-links": "links",
      supporters: "supporters",
    };

    function syncSiteInfoHash(tabName) {
      const hashKey = TAB_HASHES[tabName] ?? tabName;
      const nextHash = hashKey ? `#${hashKey}` : "";
      const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`;
      if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== nextUrl) {
        history.replaceState(null, "", nextUrl);
      }
    }

    function handleSiteInfoHash() {
      const key = window.location.hash.replace(/^#/, "").toLowerCase();
      const tabName = HASH_TO_TAB[key];
      if (!tabName) return;
      selectTabByName(tabName);
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        selectTab(index);
        const tabName = tab.id.replace("site-info-tab-", "");
        syncSiteInfoHash(tabName);
      });
      tab.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
        event.preventDefault();
        const direction = event.key === "ArrowRight" ? 1 : -1;
        const next = (index + direction + tabs.length) % tabs.length;
        selectTab(next);
        tabs[next].focus();
        const tabName = tabs[next].id.replace("site-info-tab-", "");
        syncSiteInfoHash(tabName);
      });
    });

    handleSiteInfoHash();
    window.addEventListener("hashchange", handleSiteInfoHash);
  }

  function initQuickLinks() {
    const discordBtn = document.getElementById("quickDiscordBtn");
    const shareBtn = document.getElementById("quickShareBtn");
    const status = document.getElementById("quickLinkStatus");
    const modal = document.getElementById("shareModal");
    const closeBtn = document.getElementById("shareModalClose");
    const shareAction = document.getElementById("shareModalShare");
    const copyAction = document.getElementById("shareModalCopy");
    const qrImg = document.getElementById("shareModalQr");
    const urlLabel = document.getElementById("shareModalUrl");

    async function copyText(value) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(value);
        return;
      }
      const input = document.createElement("textarea");
      input.value = value;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }

    let statusTimer = 0;
    function flashStatus(message, el) {
      if (status) {
        status.textContent = message;
        window.clearTimeout(statusTimer);
        statusTimer = window.setTimeout(() => {
          status.textContent = "";
        }, 1600);
      }
      if (!el) return;
      el.classList.add("is-copied");
      window.setTimeout(() => el.classList.remove("is-copied"), 1600);
    }

    function shareUrl() {
      return "https://delexo.store/";
    }

    function shareHostLabel() {
      return "delexo.store";
    }

    let open = false;
    let lastFocus = null;

    function setShareOpen(next) {
      if (!modal) return;
      open = next;
      if (open) {
        lastFocus = document.activeElement;
        const url = shareUrl();
        if (urlLabel) urlLabel.textContent = shareHostLabel();
        if (qrImg) {
          qrImg.src =
            "https://api.qrserver.com/v1/create-qr-code/?size=304x304&margin=8&data=" +
            encodeURIComponent(url);
        }
        modal.hidden = false;
        modal.offsetHeight;
        modal.classList.add("is-open");
        document.documentElement.classList.add("share-modal-open");
        closeBtn?.focus();
        return;
      }

      modal.classList.remove("is-open");
      document.documentElement.classList.remove("share-modal-open");
      const onEnd = (event) => {
        if (event.target !== modal || event.propertyName !== "opacity") return;
        modal.removeEventListener("transitionend", onEnd);
        if (!open) modal.hidden = true;
      };
      modal.addEventListener("transitionend", onEnd);
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    }

    if (discordBtn) {
      discordBtn.addEventListener("click", async () => {
        const handle = discordBtn.getAttribute("data-discord") || "delexxo";
        try {
          await copyText(handle);
          flashStatus(`Copied Discord: ${handle}`, discordBtn);
        } catch (_error) {
          flashStatus(handle, discordBtn);
        }
      });
    }

    if (shareBtn && modal) {
      shareBtn.setAttribute("aria-haspopup", "dialog");
      shareBtn.setAttribute("aria-controls", "shareModal");
      shareBtn.addEventListener("click", () => setShareOpen(true));
    } else if (shareBtn) {
      shareBtn.addEventListener("click", async () => {
        const url = shareUrl();
        const payload = {
          title: document.title || "DELEXO",
          text: "Check out Delexo",
          url,
        };
        try {
          if (navigator.share) {
            await navigator.share(payload);
            return;
          }
          await copyText(url);
          flashStatus("Link copied", shareBtn);
        } catch (error) {
          if (error && error.name === "AbortError") return;
          try {
            await copyText(url);
            flashStatus("Link copied", shareBtn);
          } catch (_error) {
            flashStatus("Can't share", shareBtn);
          }
        }
      });
    }

    if (modal) {
      closeBtn?.addEventListener("click", () => setShareOpen(false));
      modal.querySelectorAll("[data-share-close]").forEach((el) => {
        el.addEventListener("click", () => setShareOpen(false));
      });

      document.addEventListener("keydown", (event) => {
        if (!open || event.key !== "Escape") return;
        setShareOpen(false);
      });

      shareAction?.addEventListener("click", async () => {
        const url = shareUrl();
        const payload = {
          title: document.title || "DELEXO",
          text: "Check out Delexo",
          url,
        };
        try {
          if (navigator.share) {
            await navigator.share(payload);
            return;
          }
          await copyText(url);
          const original = shareAction.textContent;
          shareAction.textContent = "Link copied";
          shareAction.classList.add("is-done");
          window.setTimeout(() => {
            shareAction.textContent = original;
            shareAction.classList.remove("is-done");
          }, 1400);
        } catch (error) {
          if (error && error.name === "AbortError") return;
        }
      });

      copyAction?.addEventListener("click", async () => {
        try {
          await copyText(shareUrl());
          const original = copyAction.textContent;
          copyAction.textContent = "Copied!";
          copyAction.classList.add("is-done");
          window.setTimeout(() => {
            copyAction.textContent = original;
            copyAction.classList.remove("is-done");
          }, 1400);
        } catch (_error) {
          copyAction.textContent = "Can't copy";
        }
      });
    }
  }

  function initYtComment() {
    const timeEl = document.getElementById("ytCommentTime");
    const likeBtn = document.getElementById("ytCommentLike");
    const dislikeBtn = document.getElementById("ytCommentDislike");
    if (!timeEl && !likeBtn) return;

    const SEEN_KEY = "delexo-yt-comment-seen-at";
    const VOTE_KEY = "delexo-yt-comment-vote";

    function plural(n, unit) {
      return n === 1 ? `${n} ${unit} ago` : `${n} ${unit}s ago`;
    }

    function formatRelative(ms) {
      const sec = Math.max(0, Math.floor(ms / 1000));
      if (sec < 60) return "just now";
      const min = Math.floor(sec / 60);
      if (min < 60) return plural(min, "minute");
      const hr = Math.floor(min / 60);
      if (hr < 24) return plural(hr, "hour");
      const day = Math.floor(hr / 24);
      if (day < 365) return plural(day, "day");
      const year = Math.floor(day / 365);
      return plural(year, "year");
    }

    function getSeenAt() {
      try {
        const raw = localStorage.getItem(SEEN_KEY);
        const n = raw ? Number(raw) : NaN;
        if (Number.isFinite(n) && n > 0) return n;
      } catch (_error) {}
      const now = Date.now();
      try {
        localStorage.setItem(SEEN_KEY, String(now));
      } catch (_error) {}
      return now;
    }

    function updateTime() {
      if (!timeEl) return;
      const seenAt = getSeenAt();
      const label = formatRelative(Date.now() - seenAt);
      timeEl.textContent = label;
      timeEl.setAttribute("datetime", new Date(seenAt).toISOString());
      timeEl.setAttribute("title", `First seen ${new Date(seenAt).toLocaleString()}`);
    }

    if (timeEl) {
      updateTime();
      window.setInterval(updateTime, 15000);
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden) updateTime();
      });
    }

    if (!likeBtn || !dislikeBtn) return;

    let vote = null;
    try {
      const saved = localStorage.getItem(VOTE_KEY);
      if (saved === "like" || saved === "dislike") vote = saved;
    } catch (_error) {}

    function renderVotes() {
      const liked = vote === "like";
      const disliked = vote === "dislike";
      likeBtn.classList.toggle("is-active", liked);
      dislikeBtn.classList.toggle("is-active", disliked);
      likeBtn.setAttribute("aria-pressed", liked ? "true" : "false");
      dislikeBtn.setAttribute("aria-pressed", disliked ? "true" : "false");
    }

    function setVote(next) {
      vote = next;
      try {
        if (vote) localStorage.setItem(VOTE_KEY, vote);
        else localStorage.removeItem(VOTE_KEY);
      } catch (_error) {}
      renderVotes();
    }

    likeBtn.addEventListener("click", () => {
      setVote(vote === "like" ? null : "like");
    });

    dislikeBtn.addEventListener("click", () => {
      setVote(vote === "dislike" ? null : "dislike");
    });

    renderVotes();
  }


  function initProjectTips() {
    const tiles = Array.from(document.querySelectorAll(".app-tile[data-desc]"));
    if (!tiles.length) return;

    const tip = document.createElement("div");
    tip.className = "project-tip";
    tip.id = "projectTipLive";
    tip.setAttribute("role", "tooltip");
    tip.hidden = true;
    tip.innerHTML =
      '<p class="project-tip__text"></p><span class="project-tip__arrow" aria-hidden="true"></span>';
    document.body.appendChild(tip);

    const textEl = tip.querySelector(".project-tip__text");
    let activeTile = null;
    let hideTimer = null;
    let leaveTimer = null;

    function place(tile) {
      const anchor = tile.querySelector(".app-icon") || tile;
      const rect = anchor.getBoundingClientRect();
      const tipWidth = tip.offsetWidth || 200;
      const pad = 12;
      let x = rect.left + rect.width / 2;
      x = Math.max(pad + tipWidth / 2, Math.min(window.innerWidth - pad - tipWidth / 2, x));
      tip.style.left = `${Math.round(x)}px`;
      tip.style.top = `${Math.round(rect.top)}px`;
    }

    function show(tile) {
      const desc = (tile.getAttribute("data-desc") || "").trim();
      if (!desc) return;

      clearTimeout(hideTimer);
      clearTimeout(leaveTimer);
      activeTile = tile;
      textEl.textContent = desc;
      tip.hidden = false;
      tip.classList.remove("is-leaving");
      tile.setAttribute("aria-describedby", tip.id);
      place(tile);
      requestAnimationFrame(() => {
        tip.classList.add("is-visible");
        place(tile);
      });
    }

    function hide() {
      if (!activeTile && !tip.classList.contains("is-visible")) return;
      if (activeTile) activeTile.removeAttribute("aria-describedby");
      activeTile = null;
      tip.classList.remove("is-visible");
      tip.classList.add("is-leaving");
      clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => {
        tip.classList.remove("is-leaving");
        tip.hidden = true;
      }, 200);
    }

    tiles.forEach((tile) => {
      tile.addEventListener("pointerenter", () => show(tile));
      tile.addEventListener("pointerleave", () => {
        clearTimeout(hideTimer);
        hideTimer = setTimeout(hide, 40);
      });
      tile.addEventListener("focus", () => show(tile));
      tile.addEventListener("blur", hide);
    });

    window.addEventListener(
      "scroll",
      () => {
        if (activeTile) place(activeTile);
      },
      { passive: true }
    );

    window.addEventListener("resize", () => {
      if (activeTile) place(activeTile);
    });
  }

  initSplash();
  initPageTransitions();
  initScrollProgress();
  initScrollSectionFocus();
  initReveal();
  initMobileNav();
  initSectionNav();
  initNavProximity();
  initSupportersLeaderboard();
  initMoonriseGithubEmbed();
  initCourseFolders();
  initJourneyTimeline();
  initFaqAccordion();
  initSiteInfoTabs();
  markActiveNav();
  initQuickLinks();
  initProjectTips();
  initYtComment();
})();