/* ==========================================================================
   SHARED COMPONENTS
   Rendered on every page so behavior/markup never drifts between pages.
   Each render fn returns an HTML string; each bind/init fn wires events
   after the markup is in the DOM.
   ========================================================================== */

// ---------------------------------------------------------------------
// Site header + mobile nav
// ---------------------------------------------------------------------
function renderHeader(activePage) {
  const isRoot = activePage === "home";
  const fix = (href) => isRoot ? href.replace("../", "").replace("service.html", "pages/service.html").replace("comparison.html", "pages/comparison.html") : href;
  const compactLogoSrc = isRoot ? BRAND_LOGOMARK_SRC : "../" + BRAND_LOGOMARK_SRC;
  const wideLogoSrc = isRoot ? BRAND_LOGO_SRC : "../" + BRAND_LOGO_SRC;

  const homeHref = fix("../index.html");
  const comparisonHref = fix("comparison.html");
  const faqHref = fix("../index.html#faq");
  const firstServiceHref = fix(`service.html?service=${SERVICES[0].id}`);
  const serviceLinksHtml = SERVICES.map(s => `<a href="${fix(`service.html?service=${s.id}`)}">${s.name}</a>`).join("");

  return `
  <header class="site-header" id="siteHeader">
    <div class="container">
      <a href="${isRoot ? '#' : '../index.html'}" class="brand">
        <span class="brand-compact">
          <span class="brand-mark"><img src="${compactLogoSrc}" alt="${BRAND.name} logo"></span>
          <span class="brand-compact-text">${BRAND.shortName}</span>
        </span>
        <span class="brand-wide"><img src="${wideLogoSrc}" alt="${BRAND.name} logo"></span>
      </a>
      <nav class="nav-links">
        <a href="${homeHref}">Home</a>
        <div class="nav-dropdown">
          <a href="${firstServiceHref}" class="nav-dropdown-trigger">Services${icon("chevronDown")}</a>
          <div class="nav-dropdown-panel">${serviceLinksHtml}</div>
        </div>
        <a href="${comparisonHref}">Compare Packages</a>
        <a href="${faqHref}">FAQ</a>
      </nav>
      <div class="nav-actions">
        <a href="${WHATSAPP_GENERIC_URL}" target="_blank" rel="noopener" class="nav-whatsapp" aria-label="Chat on WhatsApp: ${WHATSAPP_DISPLAY}">
          ${icon("whatsapp")}<span class="nav-whatsapp-number">${WHATSAPP_DISPLAY}</span>
        </a>
        <a href="${isRoot ? 'pages/booking.html' : 'booking.html'}" class="btn btn-primary btn-sm">Book Now</a>
        <button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false">${icon("menu")}</button>
      </div>
    </div>
  </header>
  <div class="mobile-nav" id="mobileNav">
    <a href="${homeHref}">Home</a>
    <div class="mobile-nav-services">
      <button class="mobile-nav-services-toggle" id="mobileServicesToggle" aria-expanded="false">
        Services${icon("chevronDown")}
      </button>
      <div class="mobile-nav-services-panel" id="mobileServicesPanel">${serviceLinksHtml}</div>
    </div>
    <a href="${comparisonHref}">Compare Packages</a>
    <a href="${faqHref}">FAQ</a>
    <a href="${WHATSAPP_GENERIC_URL}" target="_blank" rel="noopener" class="mobile-nav-whatsapp">${icon("whatsapp")}&nbsp; Chat on WhatsApp</a>
  </div>`;
}

function bindHeader() {
  const header = document.getElementById("siteHeader");
  const toggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");
  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }, { passive: true });
  }
  if (toggle && mobileNav) {
    toggle.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open);
    });
    mobileNav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      mobileNav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }));
  }
  const servicesToggle = document.getElementById("mobileServicesToggle");
  const servicesPanel = document.getElementById("mobileServicesPanel");
  if (servicesToggle && servicesPanel) {
    servicesToggle.addEventListener("click", () => {
      const open = servicesPanel.classList.toggle("is-open");
      servicesToggle.setAttribute("aria-expanded", open);
    });
  }
}

// ---------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------
function renderFooter(isRoot) {
  const p = isRoot ? "pages/" : "";
  const wideLogoSrc = isRoot ? BRAND_LOGO_SRC : "../" + BRAND_LOGO_SRC;
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="${isRoot ? '#' : '../index.html'}" class="brand">
            <span class="brand-wide footer-logo"><img src="${wideLogoSrc}" alt="${BRAND.name} logo"></span>
          </a>
          <p>${BRAND.tagline}</p>
          <div class="social-row">
            <a href="#" aria-label="Instagram">${icon("instagram")}</a>
            <a href="#" aria-label="Facebook">${icon("facebook")}</a>
            <a href="#" aria-label="TikTok">${icon("tiktok")}</a>
          </div>
        </div>
        <div>
          <h4 class="caption">QUICK LINKS</h4>
          <ul>
            <li><a href="${isRoot ? '#' : '../index.html'}">Home</a></li>
            <li><a href="${p}gallery.html">Gallery</a></li>
            <li><a href="${p}comparison.html">Compare Packages</a></li>
            <li><a href="${p}booking.html">Book Now</a></li>
            <li><a href="${isRoot ? '#faq' : '../index.html#faq'}">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4 class="caption">SERVICES</h4>
          <ul>
            ${SERVICES.map(s => `<li><a href="${p}service.html?service=${s.id}">${s.name}</a></li>`).join("")}
          </ul>
        </div>
        <div>
          <h4 class="caption">CONTACT</h4>
          <ul>
            <li><a href="${WHATSAPP_GENERIC_URL}" target="_blank" rel="noopener">${icon("whatsapp")} Chat on WhatsApp</a></li>
            <li>${icon("mail")} ${BRAND.email}</li>
            <li>${icon("clock")} ${BRAND.hours}</li>
            <li>${icon("pin")} Serving ${BRAND.serviceCity}</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 ${BRAND.name}. All rights reserved.</span>
        <span><a href="#">Privacy Policy</a> &nbsp;·&nbsp; <a href="#">Terms of Service</a></span>
      </div>
    </div>
  </footer>`;
}

// ---------------------------------------------------------------------
// Fixed mobile conversion bar (persistent, global)
// ---------------------------------------------------------------------
function renderConversionBar(mode, bookingCtaLabel) {
  // mode: "default" (Book Now + generic label) | "booking" (dynamic total + step CTA)
  return `
  <div class="conversion-bar" id="conversionBar">
    <div class="container">
      <span class="cb-label" id="cbLabel">Ready to book?<strong id="cbLabelStrong">Get an instant quote</strong></span>
      ${mode === "booking"
      ? `<button class="btn btn-primary" id="cbBookingCta">${bookingCtaLabel || "Continue"}</button>`
      : `<a href="${mode === "root" ? "pages/booking.html" : "booking.html"}" class="btn btn-primary">Book Now</a>`}
    </div>
  </div>`;
}

function bindConversionBar() {
  const bar = document.getElementById("conversionBar");
  if (!bar) return;
  const labelStrong = document.getElementById("cbLabelStrong");
  const label = document.getElementById("cbLabel");
  const pkgId = getSelectedPackage();
  if (pkgId && labelStrong) {
    const total = computeRunningTotal();
    label.firstChild.textContent = "Current total";
    labelStrong.textContent = formatPrice(total);
  }
  // Hide bar while any modal/overlay is open
  document.addEventListener("overlay:open", () => bar.classList.add("is-hidden"));
  document.addEventListener("overlay:close", () => bar.classList.remove("is-hidden"));
}

// ---------------------------------------------------------------------
// Interactive Vehicle Selector module
// ---------------------------------------------------------------------
function renderVehicleSelector(opts) {
  opts = opts || {};
  const heading = opts.heading || "What Are We Detailing Today?";
  const compact = opts.compact;
  return `
  <div class="vehicle-selector" id="vehicleSelector">
    ${!compact ? `<h3>${heading}</h3><p class="sub text-muted">Vehicle size affects pricing and time on site.</p>` : ""}
    <div class="vehicle-tiles">
      ${VEHICLE_TYPES.map(v => `
        <button class="vehicle-tile" data-vehicle="${v.id}" aria-pressed="false">
          ${icon(v.icon)}<span>${v.label}</span>
        </button>`).join("")}
    </div>
    <div class="vehicle-result" id="vehicleResult" hidden>
      <span>Recommended package for <strong id="vehicleResultLabel"></strong></span>
      ${opts.showContinue ? `<a href="${opts.continueHref || 'comparison.html'}" class="btn btn-secondary btn-sm">Continue to Packages</a>` : ""}
    </div>
    <p class="selector-tooltip">${icon("info")} Vehicle size affects price due to time & materials</p>
  </div>`;
}

function bindVehicleSelector(onChange) {
  const root = document.getElementById("vehicleSelector");
  if (!root) return;
  const tiles = root.querySelectorAll(".vehicle-tile");
  const resultBox = document.getElementById("vehicleResult");
  const resultLabel = document.getElementById("vehicleResultLabel");

  function applyActive(vehicleId) {
    tiles.forEach(t => {
      const active = t.dataset.vehicle === vehicleId;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-pressed", active);
    });
    if (resultBox && vehicleId) {
      resultBox.hidden = false;
      resultLabel.textContent = vehicleById(vehicleId).label;
    }
  }

  tiles.forEach(t => {
    t.addEventListener("click", () => {
      const id = t.dataset.vehicle;
      setVehicle(id);
      applyActive(id);
      if (typeof onChange === "function") onChange(id);
      document.dispatchEvent(new CustomEvent("vehicle:change", { detail: { vehicleId: id } }));
    });
  });

  const existing = getVehicle();
  if (existing) applyActive(existing);
}

// ---------------------------------------------------------------------
// FAQ accordion (identical pattern used on every page)
// ---------------------------------------------------------------------
function renderFaqList(items, idPrefix) {
  return `
  <div class="faq-list">
    ${items.map((item, i) => `
      <div class="faq-item ${i === 0 ? 'is-open' : ''}" id="${idPrefix}-${i}">
        <button class="faq-question" aria-expanded="${i === 0}">
          ${item.q}${icon("chevronDown")}
        </button>
        <div class="faq-answer"><div class="faq-answer-inner">${item.a}</div></div>
      </div>`).join("")}
  </div>`;
}

function bindFaqAccordion(container) {
  const scope = container || document;
  scope.querySelectorAll(".faq-item").forEach(item => {
    const btn = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    function setOpen(open) {
      item.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open);
      answer.style.maxHeight = open ? answer.scrollHeight + "px" : "0px";
    }
    setOpen(item.classList.contains("is-open"));
    btn.addEventListener("click", () => setOpen(!item.classList.contains("is-open")));
  });
}

// ---------------------------------------------------------------------
// Testimonials carousel
// ---------------------------------------------------------------------
function renderTestimonials() {
  return `
  <div class="testimonial-carousel">
    <div class="testimonial-track" id="testimonialTrack">
      ${TESTIMONIALS.map(t => `
        <div class="testimonial-card">
          <div class="stars">${Array.from({ length: 5 }).map((_, i) => `<span style="opacity:${i < t.rating ? 1 : .25}">${icon("star")}</span>`).join("")}</div>
          <p class="testimonial-quote">"${t.quote}"</p>
          <div>
            <div class="testimonial-name">${t.name}</div>
            <div class="caption">${t.meta} · via ${t.platform}</div>
          </div>
        </div>`).join("")}
    </div>
    <div class="carousel-arrows">
      <button id="testimonialPrev" aria-label="Previous">${icon("chevronLeft")}</button>
      <button id="testimonialNext" aria-label="Next">${icon("chevronRight")}</button>
    </div>
    <div class="carousel-dots" id="testimonialDots"></div>
  </div>`;
}

function bindTestimonials() {
  const track = document.getElementById("testimonialTrack");
  if (!track) return;
  const dotsWrap = document.getElementById("testimonialDots");
  const cards = track.children.length;
  const perView = window.innerWidth >= 900 ? 3 : 1;
  const pages = Math.max(1, cards - perView + 1);

  for (let i = 0; i < pages; i++) {
    const dot = document.createElement("button");
    if (i === 0) dot.classList.add("is-active");
    dot.addEventListener("click", () => scrollToPage(i));
    dotsWrap.appendChild(dot);
  }
  function scrollToPage(i) {
    const cardW = track.children[0].getBoundingClientRect().width + 20;
    track.scrollTo({ left: cardW * i, behavior: "smooth" });
  }
  track.addEventListener("scroll", () => {
    const cardW = track.children[0].getBoundingClientRect().width + 20;
    const idx = Math.round(track.scrollLeft / cardW);
    [...dotsWrap.children].forEach((d, i) => d.classList.toggle("is-active", i === idx));
  }, { passive: true });

  document.getElementById("testimonialPrev")?.addEventListener("click", () => track.scrollBy({ left: -(track.children[0].getBoundingClientRect().width + 20), behavior: "smooth" }));
  document.getElementById("testimonialNext")?.addEventListener("click", () => track.scrollBy({ left: (track.children[0].getBoundingClientRect().width + 20), behavior: "smooth" }));
}

// ---------------------------------------------------------------------
// Before / After drag slider (real photos)
// idSuffix lets multiple sliders coexist on one page (e.g. the gallery);
// existing callers that don't pass one keep the original fixed ids.
// ---------------------------------------------------------------------
function renderBeforeAfter(opts) {
  opts = opts || {};
  const beforeImg = opts.beforeImg || "";
  const afterImg = opts.afterImg || "";
  const caption = opts.caption || "";
  const s = opts.idSuffix || "";
  return `
  <div class="ba-wrap">
    <div class="ba-slider" id="baSlider${s}">
      <div class="ba-img ba-before"><img src="${beforeImg}" alt="Before detailing" loading="lazy"></div>
      <div class="ba-img ba-after" id="baAfter${s}"><img src="${afterImg}" alt="After detailing" loading="lazy"></div>
      <span class="ba-corner left">BEFORE</span>
      <span class="ba-corner right">AFTER</span>
      <div class="ba-handle" id="baHandle${s}">
        <div class="grip">${icon("arrows")}</div>
      </div>
    </div>
    <p class="ba-caption">${caption}</p>
  </div>`;
}

function bindBeforeAfter(idSuffix) {
  const s = idSuffix || "";
  const slider = document.getElementById(`baSlider${s}`);
  if (!slider) return;
  const after = document.getElementById(`baAfter${s}`);
  const handle = document.getElementById(`baHandle${s}`);
  let dragging = false;

  function setPosition(clientX) {
    const rect = slider.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(2, Math.min(98, pct));
    after.style.clipPath = `inset(0 0 0 ${pct}%)`;
    handle.style.left = pct + "%";
  }
  function start(e) { dragging = true; setPosition((e.touches ? e.touches[0].clientX : e.clientX)); }
  function move(e) { if (!dragging) return; setPosition((e.touches ? e.touches[0].clientX : e.clientX)); }
  function end() { dragging = false; }

  handle.addEventListener("mousedown", start);
  handle.addEventListener("touchstart", start, { passive: true });
  window.addEventListener("mousemove", move);
  window.addEventListener("touchmove", move, { passive: true });
  window.addEventListener("mouseup", end);
  window.addEventListener("touchend", end);
  slider.addEventListener("click", (e) => setPosition(e.clientX));
}

// ---------------------------------------------------------------------
// Scroll-reveal (subtle, used sparingly per frontend-design restraint)
// ---------------------------------------------------------------------
function bindReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || !els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}
