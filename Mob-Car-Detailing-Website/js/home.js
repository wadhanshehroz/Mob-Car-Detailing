/* ==========================================================================
   HOMEPAGE LOGIC
   ========================================================================== */

// Plays HERO_MEDIA.videoSrcs back-to-back on a loop (clip 1, then clip 2,
// then back to clip 1...) with a quick opacity crossfade on each swap.
// Falls back to a poster image if video can't play (very old browsers,
// data-saver mode) and to the illustrated SVG if no video is configured.
function renderHeroBackground(){
  const mount = document.getElementById("heroBg");

  if(HERO_MEDIA.mode === "video" && HERO_MEDIA.videoSrcs && HERO_MEDIA.videoSrcs.length){
    const video = document.createElement("video");
    video.autoplay = true;
    video.muted = true;
    video.loop = false; // we manage looping ourselves to alternate clips
    video.playsInline = true;
    video.setAttribute("webkit-playsinline", "true");
    if(HERO_MEDIA.posterSrc) video.poster = HERO_MEDIA.posterSrc;
    mount.innerHTML = "";
    mount.appendChild(video);

    const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let i = 0;
    function playClip(index){
      video.style.opacity = "0";
      window.setTimeout(() => {
        video.src = HERO_MEDIA.videoSrcs[index];
        video.load();
        video.play().catch(() => { /* autoplay blocked — poster stays visible */ });
        video.style.opacity = "1";
      }, 220);
    }
    video.addEventListener("ended", () => {
      i = (i + 1) % HERO_MEDIA.videoSrcs.length;
      playClip(i);
    });

    if(prefersReducedMotion){
      // Respect reduced-motion: show a single static poster frame, no autoplay.
      video.removeAttribute("autoplay");
      video.pause();
    }else{
      playClip(0);
    }
    return;
  }

  if(HERO_MEDIA.mode === "image" && HERO_MEDIA.imageSrc){
    mount.innerHTML = `<img src="${HERO_MEDIA.imageSrc}" alt="Mobile detailing technician washing a car" style="width:100%;height:100%;object-fit:cover;">`;
    return;
  }

  // Fallback: original vector illustration — a car silhouette on a
  // driveway with a looping "shine sweep" animation across the paint.
  mount.innerHTML = `
  <svg viewBox="0 0 1440 700" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#0F172A"/>
        <stop offset="1" stop-color="#1E3A8A"/>
      </linearGradient>
      <linearGradient id="shineGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
        <stop offset="0.5" stop-color="#ffffff" stop-opacity="0.4"/>
        <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
      </linearGradient>
      <radialGradient id="floorGlow" cx="55%" cy="100%" r="70%">
        <stop offset="0" stop-color="#3B82F6" stop-opacity="0.5"/>
        <stop offset="1" stop-color="#3B82F6" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1440" height="700" fill="url(#skyGrad)"/>
    <ellipse cx="1000" cy="660" rx="560" ry="150" fill="url(#floorGlow)"/>
    <g stroke="#1E293B" stroke-width="2" opacity="0.6">
      <line x1="0" y1="640" x2="1440" y2="640"/>
      <line x1="0" y1="676" x2="1440" y2="676"/>
    </g>
    <ellipse cx="775" cy="648" rx="230" ry="16" fill="#000000" opacity="0.28"/>
    <g transform="translate(560,326) scale(18)" fill="none" stroke="#93C5FD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.95">
      <path d="M3 13l1.5-4.5A2 2 0 0 1 6.4 7h11.2a2 2 0 0 1 1.9 1.5L21 13"/>
      <path d="M3 13h18v4a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4z"/>
      <circle cx="7.5" cy="17" r="1.5" fill="#0F172A"/>
      <circle cx="16.5" cy="17" r="1.5" fill="#0F172A"/>
    </g>
    <g fill="#60A5FA" opacity="0.55">
      <circle cx="686" cy="654" r="3.5"/>
      <circle cx="712" cy="666" r="2.5"/>
      <circle cx="842" cy="650" r="3.5"/>
      <circle cx="868" cy="664" r="2.5"/>
      <circle cx="775" cy="672" r="2.5"/>
    </g>
    <rect class="shine-rect" x="-160" y="0" width="260" height="700" fill="url(#shineGrad)"/>
  </svg>`;
}

// Floating bubble particles layered above the hero video for a bit of
// extra shimmer/motion.
function renderHeroBubbles(){
  const wrap = document.getElementById("heroBubbles");
  let html = "";
  for(let i = 0; i < 14; i++){
    const left = Math.random() * 100;
    const size = 6 + Math.random() * 14;
    const duration = 7 + Math.random() * 8;
    const delay = Math.random() * 10;
    html += `<span class="bubble" style="left:${left}%;width:${size}px;height:${size}px;animation-duration:${duration}s;animation-delay:-${delay}s;"></span>`;
  }
  wrap.innerHTML = html;
}

// Floating rating card — stars only, no review count (per brand request).
function renderHeroFloatingCard(){
  document.getElementById("heroFloatingCard").innerHTML = `
    <div class="big-rating"><span class="num">${BRAND.rating}</span><span style="font-size:14px;color:#CBD5E1;">/ 5</span></div>
    <div class="stars-row">${Array.from({ length: 5 }).map(() => icon("star")).join("")}</div>
    <div class="caption-row">Rated by our customers</div>`;
}

document.addEventListener("DOMContentLoaded", () => {

  // --- Header / Footer / Conversion bar ---
  document.getElementById("headerMount").innerHTML = renderHeader("home");
  document.getElementById("footerMount").innerHTML = renderFooter(true);
  document.getElementById("conversionBarMount").innerHTML = renderConversionBar("root");
  bindHeader();
  bindConversionBar();

  // --- Hero icons / stats ---
  document.getElementById("heroEyebrow").innerHTML = `${icon("pin")} Serving ${BRAND.serviceCity} · ${BRAND.serviceRadius}`;
  document.getElementById("heroStars").innerHTML = `${Array.from({ length: 5 }).map(() => icon("star")).join("")} <span style="margin-left:4px;">${BRAND.rating}</span>`;
  document.getElementById("heroTrustLine").innerHTML = `${icon("check")} We come to you — no drop-off required`;
  document.getElementById("mapAssetIcon") && (document.getElementById("mapAssetIcon").innerHTML = icon("pin"));
  document.getElementById("scrollCue").innerHTML = icon("chevronDown");

  renderHeroBackground();
  renderHeroBubbles();
  renderHeroFloatingCard();

  // --- Vehicle selector ---
  document.getElementById("vehicleSelectorMount").innerHTML = renderVehicleSelector({
    showContinue: true,
    continueHref: "pages/comparison.html",
  });
  bindVehicleSelector(() => {
    renderPackageGrid(); // refresh prices when vehicle changes
    bindConversionBar();
  });

  // --- Trust bar (no raw car-count stat, per brand request) ---
  const TRUST_ITEMS = [
    { icon: "car", label: "100% Mobile Service" },
    { icon: "star", label: `${BRAND.rating}-Star Average Rating` },
    { icon: "shield", label: "Fully Insured & Background-Checked" },
    { icon: "leaf", label: "Eco-Friendly Products" },
    { icon: "checkCircle", label: "Satisfaction Guarantee" },
  ];
  document.getElementById("trustBarMount").innerHTML = TRUST_ITEMS.map(t =>
    `<div class="trust-item">${icon(t.icon)}<span>${t.label}</span></div>`).join("");

  // --- How it works ---
  const STEPS = [
    { n: "01", title: "Choose Your Service", desc: "Pick the level of care your vehicle needs, from a quick wash to a full ceramic coating." },
    { n: "02", title: "Pick a Time & Location", desc: "Choose a date, time, and address that works for you — we'll come right to you." },
    { n: "03", title: "We Come to You", desc: "Our van arrives fully stocked with water, power, and supplies. No setup needed on your end." },
  ];
  document.getElementById("stepsMount").innerHTML = STEPS.map(s => `
    <div class="step reveal">
      <div class="step-badge">${s.n}</div>
      <h3>${s.title}</h3>
      <p style="font-size:14.5px;">${s.desc}</p>
    </div>`).join("");

  // --- Package grid (re-rendered whenever vehicle changes) ---
  function renderPackageGrid(){
    const vehicleId = getVehicle() || "sedan";
    document.getElementById("packageGridMount").innerHTML = PACKAGES.map(pkg => `
      <div class="package-card ${pkg.popular ? 'package-card--featured' : ''}">
        ${pkg.popular ? `<span class="badge badge-popular">Most Popular</span>` : ""}
        <div class="icon-tile">${icon("sparkle")}</div>
        <h3>${pkg.name}</h3>
        <p style="font-size:14.5px;">${pkg.description}</p>
        <div class="package-price">
          <span class="amount">${formatPrice(priceForVehicle(pkg.basePrice, vehicleId))}</span>
          <span class="from">starting price</span>
        </div>
        <div class="package-features">
          ${pkg.features.map(f => `<div class="feature-line">${icon("check")}<span>${f}</span></div>`).join("")}
        </div>
        <a href="pages/comparison.html" class="btn ${pkg.popular ? 'btn-primary' : 'btn-secondary'} btn-block">View Details</a>
      </div>`).join("");
  }
  renderPackageGrid();

  // --- Before / After (homepage default: Exterior Wash & Wax) ---
  const exteriorSvc = serviceById("exterior-wash-wax");
  document.getElementById("beforeAfterMount").innerHTML = renderBeforeAfter({
    beforeImg: exteriorSvc.beforeImage,
    afterImg: exteriorSvc.afterImage,
    caption: "Exterior Wash & Wax — real results from a recent job",
  });
  bindBeforeAfter();
  document.getElementById("seeFullGalleryBtn").href = "pages/gallery.html";

  // --- Testimonials ---
  document.getElementById("testimonialsMount").innerHTML = renderTestimonials();
  bindTestimonials();

  // --- Service area (Lahore, static — no ZIP lookup) ---
  document.getElementById("serviceAreaHeadline").textContent = `Currently Servicing ${BRAND.serviceCity}`;
  document.getElementById("serviceAreaSub").innerHTML = `We cover <strong>${BRAND.serviceCity}</strong> and everywhere within a <strong>${BRAND.serviceRadius}</strong> — wherever you park, we can reach you.`;
  document.getElementById("cityTagsMount").innerHTML = SERVICE_AREA_CITIES
    .map(c => `<span class="city-tag">${icon("checkCircle")} ${c}</span>`).join("");

  // --- FAQ ---
  document.getElementById("faqMount").innerHTML = renderFaqList(HOME_FAQS, "home-faq");
  bindFaqAccordion();
  document.getElementById("chatWithUsLink").href = WHATSAPP_GENERIC_URL;

  // --- Final CTA -> WhatsApp ---
  document.getElementById("finalCtaBtn").href = WHATSAPP_GENERIC_URL;

  bindReveal();
});
