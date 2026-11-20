// ---------- Visual enhancements (icons, motion, spotlight, marquee) ----------
(function () {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lang = () => (document.documentElement.lang === "ar" ? "ar" : "en");

  // ----- 1. Consistent line icons instead of emoji / symbols -----
  const ICONS = {
    grad: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    gym: '<path d="M6 6v12M18 6v12M2 9v6M22 9v6M6 12h12"/>',
    cam: '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="M16 10l6-3v10l-6-3z"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2c3 3.5 3 16.5 0 20M12 2c-3 3.5-3 16.5 0 20"/>',
    phone: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',
    film: '<rect x="2" y="3" width="20" height="18" rx="2"/><path d="M7 3v18M17 3v18M2 9h5M2 15h5M17 9h5M17 15h5"/>',
    headset: '<path d="M3 14v-2a9 9 0 0 1 18 0v2"/><rect x="3" y="14" width="4" height="6" rx="1"/><rect x="17" y="14" width="4" height="6" rx="1"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    play: '<circle cx="12" cy="12" r="10"/><path d="M10 8l6 4-6 4z"/>',
    diamond: '<path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
    code: '<path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>',
  };
  const ICON_MAP = {
    "🎓": "grad", "🏋": "gym", "🎥": "cam", "✒": "pen", "▶": "play",
    "◆": "diamond", "⚙": "gear", "🐍": "code", "🌐": "globe",
    "📱": "phone", "🎬": "film", "🎧": "headset",
  };
  document.querySelectorAll(".chip-icon, .s-icon, .skill-icon").forEach((el) => {
    const key = ICON_MAP[el.textContent.replace(/️/g, "").trim()];
    if (key) {
      el.innerHTML = `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${ICONS[key]}</svg>`;
    }
  });

  // ----- 2. Scroll progress bar -----
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  document.body.appendChild(bar);
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ----- 3. Skills marquee under the hero (home page) -----
  const MARQ = {
    en: ["Web Apps", "Education Systems", "Gym Management", "Media & Ads", "Graphic Design", "Video Editing", "UI/UX", "Python"],
    ar: ["تطبيقات ويب", "أنظمة تعليمية", "إدارة الصالات", "إعلام وإعلانات", "تصميم جرافيك", "مونتاج فيديو", "تصميم UI/UX", "بايثون"],
  };
  const hero = document.querySelector(".hero");
  let marquee = null;
  function renderMarquee() {
    const row = MARQ[lang()].map((x) => `<span>${x}</span><i>✦</i>`).join("");
    marquee.innerHTML = `<div class="marquee-track">${row}${row}</div>`;
  }
  if (hero) {
    marquee = document.createElement("div");
    marquee.className = "marquee";
    hero.insertAdjacentElement("afterend", marquee);
    renderMarquee();
  }

  // ----- 4. Typing effect on the role line (home page) -----
  const ROLES = {
    en: ["Software Engineer", "Web Developer", "Graphic Designer", "Video Editor"],
    ar: ["مهندس برمجيات", "مطور ويب", "مصمم جرافيك", "مونتير فيديو"],
  };
  const roleEl = document.querySelector(".role");
  if (roleEl && !reduceMotion) {
    roleEl.classList.add("typing");
    let wi = 0, n = 0, del = false;
    const step = () => {
      const words = ROLES[lang()];
      const w = words[wi % words.length];
      if (n > w.length) n = w.length; // language switched mid-word
      let delay;
      if (!del) {
        n++;
        delay = 110;
        if (n >= w.length) { del = true; delay = 1600; }
      } else {
        n--;
        delay = 50;
        if (n <= 0) { n = 0; del = false; wi++; delay = 350; }
      }
      roleEl.textContent = w.slice(0, n);
      setTimeout(step, delay);
    };
    roleEl.textContent = "";
    setTimeout(step, 400);
  }

  // ----- 5. Pointer effects (desktop only): cursor glow, card spotlight, hero parallax -----
  if (matchMedia("(pointer: fine)").matches && !reduceMotion) {
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);
    const root = document.documentElement.style;
    addEventListener("pointermove", (e) => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      root.setProperty("--px", (e.clientX / innerWidth - 0.5) * -18 + "px");
      root.setProperty("--py", (e.clientY / innerHeight - 0.5) * -12 + "px");
      const panel = e.target.closest ? e.target.closest(".panel") : null;
      if (panel) {
        const r = panel.getBoundingClientRect();
        panel.style.setProperty("--mx", e.clientX - r.left + "px");
        panel.style.setProperty("--my", e.clientY - r.top + "px");
      }
    }, { passive: true });
  }

  // Re-render language-dependent pieces when the language is switched
  document.addEventListener("langchange", () => {
    if (marquee) renderMarquee();
  });
})();
