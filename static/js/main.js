/* ==========================================================================
   PORTFOLIO — main.js
   - Fullscreen animated navigation overlay
   - SwiperJS draggable gallery (with drag-scroll fallback)
   - Scroll reveal, header auto-hide, clock, tech-stack tags
   ========================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };

  /* ------------------------------------------------------------------
     0. Dark / Light theme
     ------------------------------------------------------------------ */
  var root       = document.documentElement;
  var themeBtn   = $("#themeToggle");
  var themeLabel = $("#themeLabel");
  var metaTheme  = $('meta[name="theme-color"]');

  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    root.setAttribute("data-bs-theme", t);
    if (themeLabel) themeLabel.textContent = t === "light" ? "Light" : "Dark";
    if (themeBtn) {
      themeBtn.setAttribute("aria-pressed", t === "light" ? "true" : "false");
      themeBtn.setAttribute("aria-label", t === "light" ? "Ganti ke mode gelap" : "Ganti ke mode terang");
    }
    if (metaTheme) metaTheme.setAttribute("content", t === "light" ? "#f4f2ec" : "#0a0a0a");
  }

  applyTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark");

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.classList.add("theme-transition");
      applyTheme(next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      setTimeout(function () { root.classList.remove("theme-transition"); }, 600);
    });
  }

  /* ------------------------------------------------------------------
     1. Fullscreen Navigation Overlay
     ------------------------------------------------------------------ */
  var toggleBtn = $("#menuToggle");
  var closeBtn  = $("#menuClose");
  var overlay   = $("#navOverlay");
  var body      = document.body;
  var lastFocus = null;

  function openMenu() {
    if (!overlay || overlay.classList.contains("is-open")) return;
    lastFocus = document.activeElement;
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    toggleBtn.setAttribute("aria-expanded", "true");
    body.classList.add("no-scroll");
    setTimeout(function () { if (closeBtn) closeBtn.focus(); }, 500);
  }

  function closeMenu() {
    if (!overlay || !overlay.classList.contains("is-open")) return;
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    toggleBtn.setAttribute("aria-expanded", "false");
    body.classList.remove("no-scroll");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  if (toggleBtn) toggleBtn.addEventListener("click", openMenu);
  if (closeBtn)  closeBtn.addEventListener("click", closeMenu);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();

    // Focus trap sederhana saat overlay terbuka
    if (e.key === "Tab" && overlay && overlay.classList.contains("is-open")) {
      var focusables = $$("a, button", overlay).filter(function (el) { return el.offsetParent !== null; });
      if (!focusables.length) return;
      var first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Smooth scroll untuk semua tautan anchor internal; tutup menu bila terbuka
  $$("a[data-nav-link]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = link.getAttribute("href");
      if (!href || href.charAt(0) !== "#") return;
      var target = $(href);
      if (!target) return;
      e.preventDefault();

      var wasOpen = overlay && overlay.classList.contains("is-open");
      if (wasOpen) closeMenu();

      // Tunggu animasi tutup overlay sebelum scroll agar halus
      setTimeout(function () {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        if (history.replaceState) history.replaceState(null, "", href);
      }, wasOpen ? 450 : 0);
    });
  });

  /* ------------------------------------------------------------------
     2. Header auto-hide saat scroll ke bawah
     ------------------------------------------------------------------ */
  var header = $("#siteHeader");
  var lastY = window.pageYOffset;
  var ticking = false;

  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var y = window.pageYOffset;
      if (header && !body.classList.contains("no-scroll")) {
        if (y > lastY && y > 200) header.classList.add("is-hidden");
        else header.classList.remove("is-hidden");
      }
      lastY = y;
      ticking = false;
    });
  }, { passive: true });

  /* ------------------------------------------------------------------
     3. Jam (WIB)
     ------------------------------------------------------------------ */
  var clock = $("#clock");
  function tick() {
    if (!clock) return;
    try {
      var t = new Intl.DateTimeFormat("id-ID", {
        timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
      }).format(new Date()).replace(/\./g, ":");
      clock.textContent = t + " WIB";
    } catch (err) {
      var d = new Date();
      clock.textContent = pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
    }
  }
  if (clock) { tick(); setInterval(tick, 1000); }

  /* ------------------------------------------------------------------
     4. Tech-stack tags (dari string "Django, PostgreSQL, Docker")
     ------------------------------------------------------------------ */
  $$(".tags[data-tags]").forEach(function (wrap) {
    var raw = wrap.getAttribute("data-tags") || "";
    raw.split(",").forEach(function (item) {
      var name = item.trim();
      if (!name) return;
      var span = document.createElement("span");
      span.className = "tag mono";
      span.textContent = name;
      wrap.appendChild(span);
    });
  });

  /* ------------------------------------------------------------------
     5. Works gallery — SwiperJS (draggable) + fallback drag-scroll
     ------------------------------------------------------------------ */
  var swiperEl = $("#worksSwiper");

  if (swiperEl) {
    var currentEl  = $("#worksCurrent");
    var progressEl = $("#worksProgressBar");
    var prevBtn    = $("#worksPrev");
    var nextBtn    = $("#worksNext");

    if (typeof Swiper !== "undefined") {
      var swiper = new Swiper(swiperEl, {
        slidesPerView: "auto",
        spaceBetween: 32,
        grabCursor: true,
        freeMode: { enabled: true, sticky: true, momentumRatio: 0.6 },
        speed: 700,
        resistanceRatio: 0.6,
        mousewheel: { forceToAxis: true },
        keyboard: { enabled: true },
        navigation: { prevEl: prevBtn, nextEl: nextBtn, disabledClass: "swiper-button-disabled" },
        a11y: { enabled: true },
        on: {
          init: updateProgress,
          slideChange: updateProgress,
          progress: updateProgress,
          setTranslate: updateProgress
        }
      });

      function updateProgress(sw) {
        sw = sw && sw.slides ? sw : swiper;
        if (!sw || !sw.slides) return;
        var total = sw.slides.length;
        var idx   = Math.min(sw.activeIndex + 1, total);
        if (currentEl) currentEl.textContent = pad(idx);
        if (progressEl) {
          var p = typeof sw.progress === "number" && isFinite(sw.progress) ? sw.progress : 0;
          var minW = 100 / total;
          progressEl.style.width = Math.max(minW, Math.min(100, p * 100)) + "%";
        }
      }
    } else {
      // Fallback bila CDN Swiper gagal dimuat: drag-scroll native
      initDragScroll(swiperEl);
    }
  }

  function initDragScroll(el) {
    el.style.overflowX = "auto";
    el.style.scrollbarWidth = "none";
    var wrapper = $(".swiper-wrapper", el);
    if (wrapper) { wrapper.style.display = "flex"; wrapper.style.gap = "2rem"; }

    var isDown = false, startX = 0, startScroll = 0, moved = false;

    el.addEventListener("pointerdown", function (e) {
      isDown = true; moved = false;
      startX = e.pageX; startScroll = el.scrollLeft;
      el.setPointerCapture(e.pointerId);
    });
    el.addEventListener("pointermove", function (e) {
      if (!isDown) return;
      var dx = e.pageX - startX;
      if (Math.abs(dx) > 4) moved = true;
      el.scrollLeft = startScroll - dx;
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (ev) {
      el.addEventListener(ev, function () { isDown = false; });
    });
    el.addEventListener("click", function (e) {
      if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
    }, true);

    var prev = $("#worksPrev"), next = $("#worksNext");
    var step = function () { return Math.min(window.innerWidth * 0.78, 560) + 32; };
    if (prev) prev.addEventListener("click", function () { el.scrollBy({ left: -step(), behavior: "smooth" }); });
    if (next) next.addEventListener("click", function () { el.scrollBy({ left:  step(), behavior: "smooth" }); });
  }

  /* ------------------------------------------------------------------
     6. Scroll reveal
     ------------------------------------------------------------------ */
  var revealEls = $$(".reveal");

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    revealEls.forEach(function (el, i) {
      // stagger kecil untuk elemen bersaudara
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ------------------------------------------------------------------
     7. Form kontak: cegah submit ganda
     ------------------------------------------------------------------ */
  var form = $(".contact-form");
  if (form) {
    form.addEventListener("submit", function () {
      var btn = $("button[type=submit]", form);
      if (btn) {
        btn.disabled = true;
        btn.firstChild.textContent = "Mengirim… ";
      }
    });
  }
})();